package osm.maps.congestion.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import osm.maps.congestion.domain.parser.GraphNode;
import osm.maps.congestion.repository.GraphNodeRepository;
import osm.maps.congestion.web.rest.dto.NodeDTO;
import osm.maps.congestion.web.rest.mapper.NodeMapper;

import javax.inject.Inject;

/**
 * Service Implementation for managing Node.
 */
@Service
public class NodeService {

    private final Logger log = LoggerFactory.getLogger(NodeService.class);

    @Inject
    private GraphNodeRepository nodeRepository;

    @Inject
    private NodeMapper nodeMapper;

    /**
     * Save a node.
     * @return the persisted entity
     */
    public NodeDTO save(NodeDTO nodeDTO) {
        log.debug("Request to save Node : {}", nodeDTO);
        GraphNode node = nodeMapper.nodeDTOToNode(nodeDTO);
        node = nodeRepository.save(node);
        NodeDTO result = nodeMapper.nodeToNodeDTO(node);
        return result;
    }

    /**
     *  get all the nodes.
     *  @return the list of entities
     */
    public Page<GraphNode> findAll(Pageable pageable) {
        log.debug("Request to get all Nodes");
        Page<GraphNode> result = nodeRepository.findAll(pageable);
        return result;
    }

    /**
     *  get one node by id.
     *  @return the entity
     */
    public NodeDTO findOne(long id) {
        log.debug("Request to get Node : {}", id);
        GraphNode node = nodeRepository.findOne(id);
        return nodeMapper.nodeToNodeDTO(node);
    }

    /**
     *  delete the  node by id.
     */
    public void delete(long id) {
        log.debug("Request to delete Node : {}", id);
        nodeRepository.delete(id);
    }
}
