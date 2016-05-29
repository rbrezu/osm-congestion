package osm.maps.congestion.service;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.squareup.okhttp.ResponseBody;
import org.geojson.Feature;
import org.geojson.FeatureCollection;
import org.geojson.GeoJsonObject;
import org.geojson.LineString;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.geo.GeoJsonLineString;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.AsyncResult;
import org.springframework.stereotype.Service;
import org.springframework.util.StopWatch;
import org.xmlpull.v1.XmlPullParserException;
import osm.maps.congestion.config.JHipsterProperties;
import osm.maps.congestion.domain.Road;
import osm.maps.congestion.domain.parser.OsmParser;
import osm.maps.congestion.repository.DirectedEdgeRepository;
import osm.maps.congestion.repository.RoadRepository;
import osm.maps.congestion.repository.GraphNodeRepository;
import osm.maps.congestion.service.servers.BBox;
import osm.maps.congestion.service.servers.MapzenServer;
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
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

/**
 * Created by root on 15.05.2016.
 */
@Service
public class OsmService {
    private final Logger log = LoggerFactory.getLogger(OsmService.class);

    @Inject
    private OsmServer osmServer;

    @Inject
    private MapzenServer mapzenServer;

    @Inject
    private JHipsterProperties properties;

    @Inject
    private DirectedEdgeRepository edgeRepository;

    @Inject
    private GraphNodeRepository nodeRepository;

    @Inject
    private ObjectMapper jsonMapper;

    @Inject
    private RoadRepository featureRepository;

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
    /*    try {
            requestForFile();
        } catch (IOException e) {
            e.printStackTrace();
        }*/

        //List<Road> roads = featureRepository.findAllByPropertiesOneway("yes");

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
    public Future<String> requestForFile () throws IOException {
        Response<ResponseBody> response = null;
        boolean socketFuckingTimeoutException = false;
        try {
            response = mapzenServer.getFile("/metro-extracts.mapzen.com/iasi_romania.osm2pgsql-geojson.zip")
                .execute();
        } catch (SocketTimeoutException e) {
            socketFuckingTimeoutException = true;
            log.debug("Fucking socket timeout exception for the whole gang !");
        }

        if (response.isSuccess()) {
            log.debug("OsmService server worked");

            ZipInputStream in = new ZipInputStream(response.body().byteStream());
            ZipEntry entry;

            FeatureCollection collection;
            while ( (entry = in.getNextEntry() ) != null ) {
                if (entry.getName().equals("iasi_romania_osm_line.geojson")) {
                    try {
                        jsonMapper.disable(JsonParser.Feature.AUTO_CLOSE_SOURCE);
                        collection = jsonMapper.readValue(in, FeatureCollection.class);
                        List<Road> roads = collection
                            .getFeatures()
                            .parallelStream()
                            .map(feature -> {
                                LineString lineString = (LineString) feature.getGeometry();

                                GeoJsonLineString geoJsonLineString = new GeoJsonLineString(
                                    lineString.getCoordinates().stream()
                                        .map(point -> new Point(point.getLongitude(), point.getLatitude()))
                                        .collect(Collectors.toList())
                                );

                                Road r = new Road();
                                r.setGeometry(geoJsonLineString);
                                r.setType("Feature");
                                r.setProperties(feature.getProperties());

                                return r;
                            })
                            .collect(Collectors.toList());

                        featureRepository.save(roads);

                        log.debug("Count of streets {}", roads.size());
                    } catch (Exception e) {
                        log.debug("Serialization fucked up");
                        e.printStackTrace();
                    }
                }
            }
            in.close();
            /*String fileName = "sibiu-file.zip";
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
            out.close();*/
            log.debug("Bytes from total {} read!", response.body().contentLength());
            //parseTheFile(savedFile.toPath());
            return new AsyncResult<>("ok");
        }

        return new AsyncResult<>("not ok");
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
