package osm.maps.congestion.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import osm.maps.congestion.domain.parser.GraphNode;

/**
 * Created by root on 15.05.2016.
 */
public interface GraphNodeRepository extends MongoRepository<GraphNode, Long> {
}
