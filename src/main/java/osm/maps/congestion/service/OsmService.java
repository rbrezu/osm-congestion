package osm.maps.congestion.service;

import com.squareup.okhttp.ResponseBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Service;
import org.springframework.util.StopWatch;
import org.xmlpull.v1.XmlPullParserException;
import osm.maps.congestion.config.JHipsterProperties;
import osm.maps.congestion.domain.parser.OsmParser;
import osm.maps.congestion.repository.DirectedEdgeRepository;
import osm.maps.congestion.repository.GraphNodeRepository;
import osm.maps.congestion.service.servers.BBox;
import osm.maps.congestion.service.servers.OsmServer;
import retrofit.Response;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.io.*;
import java.net.SocketTimeoutException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Pattern;

/**
 * Created by root on 15.05.2016.
 */
@Service
public class OsmService {
    private final Logger log = LoggerFactory.getLogger(OsmService.class);

    @Inject
    private OsmServer osmServer;

    @Inject
    private JHipsterProperties properties;

    @Inject
    private DirectedEdgeRepository edgeRepository;

    @Inject
    private GraphNodeRepository nodeRepository;

    private AtomicInteger depthcount = new AtomicInteger(0);

    @PostConstruct
    public void init() {
        log.debug("OsmService initializing");
        StopWatch watch = new StopWatch();
        watch.start();
/*
        try {
            Future<String> completed = requestForBBox(
        new BBox(27.4016, 47.0456,
            27.9183, 47.2543));

            completed.get();
        } catch (InterruptedException | IOException | ExecutionException e1) {
            e1.printStackTrace();
        }*/

        //addToDb();

        watch.stop();
        log.debug("OsmService initialized in: {}",
            watch.getTotalTimeMillis());
    }

    @Async
    public Future<String> parseTheFile(Path filePath) {
        log.debug("Starting parsing file : {}", filePath.getFileName());

        try {
            OsmParser parser = new OsmParser(filePath);

            edgeRepository.save(parser.getEdges());
            nodeRepository.save(parser.getNodes());

            log.debug("Parsing successful : {}", filePath.getFileName());
        } catch (IOException | XmlPullParserException e) {
            e.printStackTrace();
            log.debug("Failed : {}", filePath.getFileName());
        }

        return new AsyncResult<>("GataBre");
    }

    public void addToDb() {
        File[] mareLista = listFilesMatching(new File("/home/cerber/Servers/map-congestion"), ".*-osm.xml");

        int k = 0;
        for (File file : mareLista) {
            log.debug("Parsing file {} from {}.", k++, mareLista.length);
            parseTheFile(file.toPath());
        }
    }

    @Async
    public Future<String> requestForBBox(BBox bbox) throws IOException {
        Response<ResponseBody> response = null;
        boolean socketFuckingTimeoutException = false;
        try {
             response = osmServer.getMapFile(bbox)
                .execute();
        } catch (SocketTimeoutException e) {
            socketFuckingTimeoutException = true;
            log.debug("Fucking socket timeout exception for the whole gang !");
        }

        if (socketFuckingTimeoutException || (!response.isSuccess() && response.code() != HttpStatus.INTERNAL_SERVER_ERROR.value())) {
            List<Future<String>> requests = new ArrayList<>();
            BBox[][] boxes = bbox.parseIntoMatrix();
            depthcount.incrementAndGet();
            log.debug("Going down the rabbit hole, level {} !", depthcount);

            for (BBox[] bBoxes : boxes)
                for (BBox box : bBoxes) {
                    requests.add(requestForBBox(box));
                }

            depthcount.decrementAndGet();
            log.debug("Exiting rabbit hole, level {} !", depthcount);

            boolean ok = true;
            do {
                for (Future request : requests)
                    ok = ok && request.isDone();
            } while (!ok);
        } else  if (response.isSuccess()) {
            log.debug("OsmService server worked");

            DataInputStream in = new DataInputStream(response.body().byteStream());

            String fileName = System.currentTimeMillis() + "-osm.xml";
            File savedFile = new File(fileName);
            OutputStream out = new FileOutputStream(savedFile.getPath());

            int i, totalBytes = 0;
            byte[] buff = new byte[4096];
            while ((i = in.read(buff)) > 0) {
                out.write(buff, 0, i);
                out.flush();
                totalBytes += i;
            }

            in.close();
            out.close();
            log.debug("Bytes {} from total {} read!", totalBytes, response.body().contentLength());
            //parseTheFile(savedFile.toPath());
            return new AsyncResult<>("ok");
        }

        return new AsyncResult<>("failed");
    }

    public static File[] listFilesMatching(File root, String regex) {
        if(!root.isDirectory()) {
            throw new IllegalArgumentException(root+" is no directory.");
        }
        final Pattern p = Pattern.compile(regex); // careful: could also throw an exception!
        return root.listFiles(file -> {
            return p.matcher(file.getName()).matches();
        });
    }
}
