package osm.maps.congestion.web.rest.mapper;

import org.mapstruct.Mapper;
import osm.maps.congestion.domain.parser.GraphNode;
import osm.maps.congestion.web.rest.dto.NodeDTO;

/**
 * Mapper for the entity Node and its DTO NodeDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface NodeMapper {

    NodeDTO nodeToNodeDTO(GraphNode node);

    GraphNode nodeDTOToNode(NodeDTO nodeDTO);
}
