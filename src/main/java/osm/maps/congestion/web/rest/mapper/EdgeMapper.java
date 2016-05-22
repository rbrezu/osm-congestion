package osm.maps.congestion.web.rest.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import osm.maps.congestion.domain.parser.DirectedEdge;
import osm.maps.congestion.domain.parser.GraphNode;
import osm.maps.congestion.web.rest.dto.EdgeDTO;

/**
 * Mapper for the entity Edge and its DTO EdgeDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public abstract class EdgeMapper {

    public abstract EdgeDTO edgeToEdgeDTO(DirectedEdge edge);

    public abstract DirectedEdge edgeDTOToEdge(EdgeDTO edgeDTO);

    public Long map(GraphNode node) {
        return node != null ? node.getId() : null;
    }

    public GraphNode map(Long nodeId) {
        return null;
    }
}
