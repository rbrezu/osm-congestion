package osm.maps.congestion.web.rest.dto;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by root on 24.05.2016.
 */
public class LineString {
    private String type = "LineString";

    private List<Double[]> coordinates = new LinkedList<>();

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<Double[]> getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(List<Double[]> coordinates) {
        this.coordinates = coordinates;
    }
}
