package osm.maps.congestion.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import osm.maps.congestion.domain.Authority;

/**
 * Spring Data MongoDB repository for the Authority entity.
 */
public interface AuthorityRepository extends MongoRepository<Authority, String> {
}
