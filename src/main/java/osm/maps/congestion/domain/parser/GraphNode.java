package osm.maps.congestion.domain.parser;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;

/**
 * Created by root on 15.05.2016.
 */
@Document(collection = "graph_node")
public class GraphNode implements Serializable {
    /**
     *
     */
    private static final long serialVersionUID = -951013750518377697L;
    /**
     *
     */

    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint location;

    @Id
    private long id;


    public GraphNode() {
        this.location = new GeoJsonPoint(0, 0);
        this.id = 0;
    }

    public GraphNode(double lat, double lon, long id) {
        this.location = new GeoJsonPoint(lat, lon);
        this.id = id;
    }


    public long getId() {
        return id;
    }

    public void setId(long l){
        this.id = l;
    }

    public GeoJsonPoint getLocation() {
        return location;
    }

    public void setLocation(GeoJsonPoint location) {
        this.location = location;
    }

    @Override
    public boolean equals(Object node) {
        if(node == null)
            return false;
        GraphNode node_x = (GraphNode) node;
        return (node_x.id == this.id);
    }

    @Override
    public String toString() {
        return "GraphNode{" +
            "location=" + location +
            ", id=" + id +
            '}';
    }

    @Override
    public int hashCode() {
        int result = location != null ? location.hashCode() : 0;
        result = 31 * result + (int) (id ^ (id >>> 32));
        return result;
    }
}
