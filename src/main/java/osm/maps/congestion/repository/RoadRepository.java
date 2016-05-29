package osm.maps.congestion.repository;

import org.springframework.data.geo.Box;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import osm.maps.congestion.domain.Road;

import java.util.List;

/**
 * Created by root on 24.05.2016.
 */
public interface RoadRepository extends MongoRepository<Road, String> {
    @Query("{ properties.oneway: ?0 }")
    List<Road> findAllByPropertiesOneway(String onewway);

    @Query("{ properties.highway: { $nin: ?0 } }")
    List<Road> findAllByPropertiesHighwayNot(String... highways);

    @Query("{ properties.highway: { $in: ?0 } }")
    List<Road> findAllByPropertiesHighway(String... highways);

    @Query("?0")
    List<Road> findAllByCustomQuery(String query);

    List<Road> findAllByGeometryWithin(Box box);
}
