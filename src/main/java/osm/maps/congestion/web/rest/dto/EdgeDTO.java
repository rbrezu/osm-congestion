package osm.maps.congestion.web.rest.dto;

import java.io.Serializable;


/**
 * A DTO for the Edge entity.
 */
public class EdgeDTO implements Serializable {

    private Long id;

    private Double length;

    private Long startNode;

    private Long endNode;

    private Integer speedMax;

    private String type;

    private String name;

    private Boolean isOneway;

    private Double weight;

    private Long way_id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public Double getLength() {
        return length;
    }

    public void setLength(Double length) {
        this.length = length;
    }
    public Integer getSpeedMax() {
        return speedMax;
    }

    public void setSpeedMax(Integer speedMax) {
        this.speedMax = speedMax;
    }
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getIsOneway() {
        return isOneway;
    }

    public void setIsOneway(Boolean isOneway) {
        this.isOneway = isOneway;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }
    public Long getWay_id() {
        return way_id;
    }

    public void setWay_id(Long way_id) {
        this.way_id = way_id;
    }

    public Long getStartNode() {
        return startNode;
    }

    public void setStartNode(Long startNode) {
        this.startNode = startNode;
    }

    public Long getEndNode() {
        return endNode;
    }

    public void setEndNode(Long endNode) {
        this.endNode = endNode;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EdgeDTO)) return false;

        EdgeDTO edgeDTO = (EdgeDTO) o;

        if (id != null ? !id.equals(edgeDTO.id) : edgeDTO.id != null) return false;
        if (length != null ? !length.equals(edgeDTO.length) : edgeDTO.length != null) return false;
        if (startNode != null ? !startNode.equals(edgeDTO.startNode) : edgeDTO.startNode != null) return false;
        if (endNode != null ? !endNode.equals(edgeDTO.endNode) : edgeDTO.endNode != null) return false;
        if (speedMax != null ? !speedMax.equals(edgeDTO.speedMax) : edgeDTO.speedMax != null) return false;
        if (type != null ? !type.equals(edgeDTO.type) : edgeDTO.type != null) return false;
        if (name != null ? !name.equals(edgeDTO.name) : edgeDTO.name != null) return false;
        if (isOneway != null ? !isOneway.equals(edgeDTO.isOneway) : edgeDTO.isOneway != null) return false;
        if (weight != null ? !weight.equals(edgeDTO.weight) : edgeDTO.weight != null) return false;
        return !(way_id != null ? !way_id.equals(edgeDTO.way_id) : edgeDTO.way_id != null);

    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (length != null ? length.hashCode() : 0);
        result = 31 * result + (startNode != null ? startNode.hashCode() : 0);
        result = 31 * result + (endNode != null ? endNode.hashCode() : 0);
        result = 31 * result + (speedMax != null ? speedMax.hashCode() : 0);
        result = 31 * result + (type != null ? type.hashCode() : 0);
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (isOneway != null ? isOneway.hashCode() : 0);
        result = 31 * result + (weight != null ? weight.hashCode() : 0);
        result = 31 * result + (way_id != null ? way_id.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "EdgeDTO{" +
            "id=" + id +
            ", length=" + length +
            ", startNode=" + startNode +
            ", endNode=" + endNode +
            ", speedMax=" + speedMax +
            ", type='" + type + '\'' +
            ", name='" + name + '\'' +
            ", isOneway=" + isOneway +
            ", weight=" + weight +
            ", way_id=" + way_id +
            '}';
    }
}
