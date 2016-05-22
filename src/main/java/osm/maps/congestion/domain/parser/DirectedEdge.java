package osm.maps.congestion.domain.parser;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;

/**
 * Created by root on 15.05.2016.
 */
@Document(collection = "directed_edge")
public class DirectedEdge implements Serializable {
    /**
     *
     */
    private static final long serialVersionUID = -9074416579376692922L;

    @Id
    private long id;

    private GraphNode startNode;
    private GraphNode endNode;

    private double length;
    private final int speedMax;
    private boolean isOneway;

    private String type;
    private String name;
    private String other_tags;

    private float weight;

    private long way_id;

    /**
     * Constructor
     */
    public DirectedEdge(GraphNode startNode, GraphNode endNode,
                        double length, int speedMax, boolean isOneway,
                        String type, String name, float weight, long way_id ) {

        this.startNode = startNode;
        this.endNode = endNode;
        this.speedMax = speedMax;
        this.isOneway = isOneway;
        this.length = length;
        this.type = type;
        this.name = name;
        this.weight = weight;
        this.way_id = way_id;
        this.id = startNode.getId() + endNode.getId();
    }

    public DirectedEdge(GraphNode startNode, GraphNode endNode,
                        long way_id, float weight, String name,  boolean isOneway ) {

        this.startNode = startNode;
        this.endNode = endNode;
        this.speedMax = -1;
        this.isOneway = isOneway;
        this.length = length;
        this.type = null;
        this.name = name;
        this.weight = weight;
        this.way_id = way_id;
    }

    public DirectedEdge() {

        this.startNode = null;
        this.endNode = null;
        this.speedMax = -1;
        this.isOneway = false;
        this.length = 0.00;
        this.type = null;
        this.name = null;
        this.weight = 0;
        this.way_id = 0;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public GraphNode from() {
        return startNode;
    }


    public GraphNode to() {
        return endNode;
    }


    public int speedMax() {
        return speedMax;
    }

    public double getLength() {
        return length;
    }

    public boolean getIsOneway() {
        return isOneway;
    }

    public void setIsOneway(boolean isOneway) {
        this.isOneway = isOneway;
    }

    public void setType(String type){
        this.type = type;
    }
    public String getType(){
        return type;
    }

    public GraphNode getStartNode() {
        return startNode;
    }

    public void setStartNode(GraphNode startNode) {
        this.startNode = startNode;
    }

    public GraphNode getEndNode() {
        return endNode;
    }

    public void setEndNode(GraphNode endNode) {
        this.endNode = endNode;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setLength(double length) {
        this.length = length;
    }

    public int getSpeedMax() {
        return speedMax;
    }

    public void setWeight(float weight) {
        this.weight = weight;
    }

    public long getWay_id() {
        return way_id;
    }

    public void setWay_id(long way_id) {
        this.way_id = way_id;
    }

    public void setOtherTags(String other_tags) {
        this.other_tags = other_tags;
    }

    public String getOther_tags() {
        return other_tags;
    }

    public void setOther_tags(String other_tags) {
        this.other_tags = other_tags;
    }

    public double getWeight(){
        //return (this.weight*60);
        return (this.length);
    }

    public String toString() {
        return startNode.getId()  + "-&gt;" + endNode.getId() + " " + length;
    }

    public String getName() {
        // TODO Auto-generated method stub
        return name;
    }
    public float getWalkWeight(){
        float walk_weight = (float) ((this.length/3)*60);
        return walk_weight;
    }

    @Override
    public int hashCode() {
        int hash = 1;
        hash = hash+startNode.hashCode();
        hash = hash+endNode.hashCode();
        hash = hash+ Math.round(weight*1000);
        return hash;
    }
}
