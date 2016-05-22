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
import osm.maps.congestion.domain.parser.DirectedEdge;
import osm.maps.congestion.service.EdgeService;
import osm.maps.congestion.web.rest.dto.EdgeDTO;
import osm.maps.congestion.web.rest.mapper.EdgeMapper;
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
 * REST controller for managing Edge.
 */
@RestController
@RequestMapping("/api")
public class EdgeResource {

    private final Logger log = LoggerFactory.getLogger(EdgeResource.class);

    @Inject
    private EdgeService edgeService;

    @Inject
    private EdgeMapper edgeMapper;

    /**
     * POST  /edges -> Create a new edge.
     */
    @RequestMapping(value = "/edges",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<EdgeDTO> createEdge(@RequestBody EdgeDTO edgeDTO) throws URISyntaxException {
        log.debug("REST request to save Edge : {}", edgeDTO);
        if (edgeDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("edge", "idexists", "A new edge cannot already have an ID")).body(null);
        }
        EdgeDTO result = edgeService.save(edgeDTO);
        return ResponseEntity.created(new URI("/api/edges/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("edge", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /edges -> Updates an existing edge.
     */
    @RequestMapping(value = "/edges",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<EdgeDTO> updateEdge(@RequestBody EdgeDTO edgeDTO) throws URISyntaxException {
        log.debug("REST request to update Edge : {}", edgeDTO);
        if (edgeDTO.getId() == null) {
            return createEdge(edgeDTO);
        }
        EdgeDTO result = edgeService.save(edgeDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("edge", edgeDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /edges -> get all the edges.
     */
    @RequestMapping(value = "/edges",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<EdgeDTO>> getAllEdges(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Edges");
        Page<DirectedEdge> page = edgeService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/edges");
        return new ResponseEntity<>(page.getContent().stream()
            .map(edgeMapper::edgeToEdgeDTO)
            .collect(Collectors.toCollection(LinkedList::new)), headers, HttpStatus.OK);
    }

    /**
     * GET  /edges/:id -> get the "id" edge.
     */
    @RequestMapping(value = "/edges/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<EdgeDTO> getEdge(@PathVariable Long id) {
        log.debug("REST request to get Edge : {}", id);
        EdgeDTO edgeDTO = edgeService.findOne(id);
        return Optional.ofNullable(edgeDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /edges/:id -> delete the "id" edge.
     */
    @RequestMapping(value = "/edges/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteEdge(@PathVariable Long id) {
        log.debug("REST request to delete Edge : {}", id);
        edgeService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("edge", String.valueOf(id))).build();
    }
}
