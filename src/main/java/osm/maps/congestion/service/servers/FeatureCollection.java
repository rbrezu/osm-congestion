package osm.maps.congestion.service.servers;

import osm.maps.congestion.domain.Road;
import osm.maps.congestion.web.rest.dto.RoadDTO;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * Created by root on 24.05.2016.
 */
public class FeatureCollection {
    private String type = "FeatureCollection";
    private Map<String, Object> crs;

    private List<RoadDTO> features = new LinkedList<>();

    public FeatureCollection() {

    }

    public FeatureCollection(List<RoadDTO> features) {
        this.features = features;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Map<String, Object> getCrs() {
        return crs;
    }

    public void setCrs(Map<String, Object> crs) {
        this.crs = crs;
    }

    public List<RoadDTO> getFeatures() {
        return features;
    }

    public void setFeatures(List<RoadDTO> features) {
        this.features = features;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FeatureCollection)) return false;

        FeatureCollection that = (FeatureCollection) o;

        if (type != null ? !type.equals(that.type) : that.type != null) return false;
        if (crs != null ? !crs.equals(that.crs) : that.crs != null) return false;
        return !(features != null ? !features.equals(that.features) : that.features != null);

    }

    @Override
    public int hashCode() {
        int result = type != null ? type.hashCode() : 0;
        result = 31 * result + (crs != null ? crs.hashCode() : 0);
        result = 31 * result + (features != null ? features.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "FeatureCollection{" +
            "type='" + type + '\'' +
            ", crs=" + crs +
            ", features=" + features +
            '}';
    }
}
