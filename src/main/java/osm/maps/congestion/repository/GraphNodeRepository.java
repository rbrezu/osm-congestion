package osm.maps.congestion.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.geo.Box;
import org.springframework.data.mongodb.repository.MongoRepository;
import osm.maps.congestion.domain.parser.GraphNode;

import java.util.List;

/**
 * Created by root on 15.05.2016.
 */
public interface GraphNodeRepository extends MongoRepository<GraphNode, Long> {
    List<GraphNode> findAllByLocationWithin(Box box);
    Page<GraphNode> findAllByLocationWithin(Pageable page, Box box);
}
