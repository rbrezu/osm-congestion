package osm.maps.congestion.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import osm.maps.congestion.domain.parser.DirectedEdge;

/**
 * Created by root on 15.05.2016.
 */
public interface DirectedEdgeRepository extends MongoRepository<DirectedEdge, Long> {

}
