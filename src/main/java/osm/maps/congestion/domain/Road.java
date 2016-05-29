package osm.maps.congestion.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonLineString;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by root on 24.05.2016.
 */
@Document(collection = "roads")
public class Road {
    @Id
    private String id;

    private String type;

    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonLineString geometry;

    private Map<String, Object> properties = new HashMap<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public GeoJsonLineString getGeometry() {
        return geometry;
    }

    public void setGeometry(GeoJsonLineString geometry) {
        this.geometry = geometry;
    }

    public Map<String, Object> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, Object> properties) {
        this.properties = properties;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Road)) return false;

        Road road = (Road) o;

        if (type != null ? !type.equals(road.type) : road.type != null) return false;
        if (geometry != null ? !geometry.equals(road.geometry) : road.geometry != null) return false;
        return !(properties != null ? !properties.equals(road.properties) : road.properties != null);

    }

    @Override
    public int hashCode() {
        int result = type != null ? type.hashCode() : 0;
        result = 31 * result + (geometry != null ? geometry.hashCode() : 0);
        result = 31 * result + (properties != null ? properties.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Road{" +
            "type='" + type + '\'' +
            ", geometry=" + geometry +
            ", properties=" + properties +
            '}';
    }
}
