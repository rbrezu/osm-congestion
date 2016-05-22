package osm.maps.congestion.web.rest.dto;

import java.io.Serializable;
import java.util.Objects;


/**
 * A DTO for the Node entity.
 */
public class NodeDTO implements Serializable {

    private Long id;

    private Double lon;


    private Double lat;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public Double getLon() {
        return lon;
    }

    public void setLon(Double lon) {
        this.lon = lon;
    }
    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        NodeDTO nodeDTO = (NodeDTO) o;

        if ( ! Objects.equals(id, nodeDTO.id)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "NodeDTO{" +
            "id=" + id +
            ", lon='" + lon + "'" +
            ", lat='" + lat + "'" +
            '}';
    }
}
