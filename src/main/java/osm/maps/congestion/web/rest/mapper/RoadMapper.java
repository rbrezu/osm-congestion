package osm.maps.congestion.web.rest.mapper;

import org.mapstruct.Mapper;
import org.springframework.data.mongodb.core.geo.GeoJsonLineString;
import osm.maps.congestion.domain.Road;
import osm.maps.congestion.domain.parser.GraphNode;
import osm.maps.congestion.service.servers.FeatureCollection;
import osm.maps.congestion.web.rest.dto.LineString;
import osm.maps.congestion.web.rest.dto.NodeDTO;
import osm.maps.congestion.web.rest.dto.RoadDTO;

import java.util.List;

/**
 * Created by root on 24.05.2016.
 */
@Mapper(componentModel = "spring", uses = {})
public abstract class RoadMapper {
    public abstract RoadDTO roadToRoadDTO(Road road);

    public LineString geoJsonLineStringToLineString(GeoJsonLineString object) {
        LineString lineString = new LineString();

        object.getCoordinates().forEach(point -> {
            Double[] coords = new Double[] {point.getX(), point.getY()};
            lineString.getCoordinates().add(coords);
        });

        return lineString;
    }
}
