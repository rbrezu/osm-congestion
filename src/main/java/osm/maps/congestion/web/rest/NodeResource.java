package osm.maps.congestion.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import osm.maps.congestion.domain.parser.GraphNode;
import osm.maps.congestion.service.NodeService;
import osm.maps.congestion.web.rest.dto.NodeDTO;
import osm.maps.congestion.web.rest.mapper.NodeMapper;
import osm.maps.congestion.web.rest.util.HeaderUtil;
import osm.maps.congestion.web.rest.util.PaginationUtil;

import javax.inject.Inject;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * REST controller for managing Node.
 */
@RestController
@RequestMapping("/api")
public class NodeResource {

    private final Logger log = LoggerFactory.getLogger(NodeResource.class);

    @Inject
    private NodeService nodeService;

    @Inject
    private NodeMapper nodeMapper;

    /**
     * POST  /nodes -> Create a new node.
     */
    @RequestMapping(value = "/nodes",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<NodeDTO> createNode(@RequestBody NodeDTO nodeDTO) throws URISyntaxException {
        log.debug("REST request to save Node : {}", nodeDTO);
        if (nodeDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("node", "idexists", "A new node cannot already have an ID")).body(null);
        }
        NodeDTO result = nodeService.save(nodeDTO);
        return ResponseEntity.created(new URI("/api/nodes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("node", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /nodes -> Updates an existing node.
     */
    @RequestMapping(value = "/nodes",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<NodeDTO> updateNode(@RequestBody NodeDTO nodeDTO) throws URISyntaxException {
        log.debug("REST request to update Node : {}", nodeDTO);
        if (nodeDTO.getId() == null) {
            return createNode(nodeDTO);
        }
        NodeDTO result = nodeService.save(nodeDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("node", nodeDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /nodes -> get all the nodes.
     */
    @RequestMapping(value = "/nodes",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<NodeDTO>> getAllNodes(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Nodes");
        Page<GraphNode> page = nodeService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/nodes");
        return new ResponseEntity<>(page.getContent().stream()
            .map(nodeMapper::nodeToNodeDTO)
            .collect(Collectors.toCollection(LinkedList::new)), headers, HttpStatus.OK);
    }

    /**
     * GET  /nodes/:id -> get the "id" node.
     */
    @RequestMapping(value = "/nodes/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<NodeDTO> getNode(@PathVariable Long id) {
        log.debug("REST request to get Node : {}", id);
        NodeDTO nodeDTO = nodeService.findOne(id);
        return Optional.ofNullable(nodeDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /nodes/:id -> delete the "id" node.
     */
    @RequestMapping(value = "/nodes/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteNode(@PathVariable Long id) {
        log.debug("REST request to delete Node : {}", id);
        nodeService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("node", String.valueOf(id))).build();
    }
}
