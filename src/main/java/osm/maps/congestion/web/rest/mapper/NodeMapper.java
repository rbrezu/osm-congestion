package osm.maps.congestion.web.rest.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import osm.maps.congestion.domain.parser.GraphNode;
import osm.maps.congestion.web.rest.dto.NodeDTO;

/**
 * Mapper for the entity Node and its DTO NodeDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface NodeMapper {

    @Mappings({
        @Mapping(target = "lat", expression = "java(node.getLocation().getY())"),
        @Mapping(target = "lon", expression = "java(node.getLocation().getX())")
    })
    NodeDTO nodeToNodeDTO(GraphNode node);

    GraphNode nodeDTOToNode(NodeDTO nodeDTO);
}
