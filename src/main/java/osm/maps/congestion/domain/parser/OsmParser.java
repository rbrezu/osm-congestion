package osm.maps.congestion.domain.parser;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;
import org.xmlpull.v1.XmlPullParserFactory;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by root on 15.05.2016.
 */
public class OsmParser {
    private final Logger log = LoggerFactory.getLogger(OsmParser.class);

    List<GraphNode> nodes = new LinkedList<>();
    List<DirectedEdge> edges = new LinkedList<>();
    RoadGraph g = new RoadGraph();

    public OsmParser (Path path) throws FileNotFoundException, IOException, XmlPullParserException {
        LocalDateTime before = LocalDateTime.now();
        log.debug("Run started at {} ", before);
        XmlPullParserFactory factory = new org.xmlpull.mxp1.MXParserFactory();
        factory.setNamespaceAware(true);
        XmlPullParser xpp = factory.newPullParser();
        xpp.setInput ( new FileReader(path.toFile()));

        g.osmGraphParser(xpp);
        nodes = g.nodes;
        edges = g.edges;

        LocalDateTime after = LocalDateTime.now();
        log.debug("Parsing ended at {} with {} ", after, ChronoUnit.MILLIS.between(before, after));
        log.debug("Edges size: {} ", edges.size());
        log.debug("Nodes size: {} ", nodes.size());
    }

    public List<GraphNode> getNodes() {
        return nodes;
    }

    public void setNodes(List<GraphNode> nodes) {
        this.nodes = nodes;
    }

    public List<DirectedEdge> getEdges() {
        return edges;
    }

    public void setEdges(List<DirectedEdge> edges) {
        this.edges = edges;
    }

    public RoadGraph getRoadGraph() {
        return g;
    }

    public void setG(RoadGraph g) {
        this.g = g;
    }
}
