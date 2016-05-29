package osm.maps.congestion.web.rest;

import com.codahale.metrics.annotation.Timed;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.geo.Box;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import osm.maps.congestion.domain.Road;
import osm.maps.congestion.domain.parser.DirectedEdge;
import osm.maps.congestion.repository.RoadRepository;
import osm.maps.congestion.service.RoadService;
import osm.maps.congestion.service.servers.FeatureCollection;
import osm.maps.congestion.web.rest.dto.EdgeDTO;
import osm.maps.congestion.web.rest.mapper.RoadMapper;
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
 * Created by root on 24.05.2016.
 */
@RestController
@RequestMapping("/api")
public class RoadResource {
    private final Logger log = LoggerFactory.getLogger(RoadResource.class);

    @Inject
    private RoadService roadService;

    @Inject
    private RoadRepository roadRepository;

    @Inject
    private RoadMapper roadMapper;

    /**
     * POST  /roads -> Create a new road.
     */
    @RequestMapping(value = "/road",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Road> createRoad(@RequestBody Road road) throws URISyntaxException {
        log.debug("REST request to save Road : {}", road);
        if (road.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("road", "idexists", "A new road cannot already have an ID")).body(null);
        }
        Road result = roadService.save(road);
        return ResponseEntity.created(new URI("/api/road/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("road", result.getId()))
            .body(result);
    }

    /**
     * PUT  /roads -> Updates an existing road.
     */
    @RequestMapping(value = "/road",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Road> updateRoad(@RequestBody Road road) throws URISyntaxException {
        log.debug("REST request to update road : {}", road);
        if (road.getId() == null) {
            return createRoad(road);
        }
        Road result = roadService.save(road);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("road", road.getId()))
            .body(result);
    }

    /**
     * GET  /roads -> get all the roads.
     */
    @RequestMapping(value = "/roads",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<FeatureCollection> getAllRoads(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get all edges");
        return new ResponseEntity<>(new FeatureCollection(/*
            roadRepository.findAllByGeometryWithin(new Box(
                new double[]{}, new double[]{}
            ))*/
            roadRepository.findAllByPropertiesHighway(
                "motorway", "trunk", "primary", "secondary", "tertiary", "unclassified", "road"
            ).parallelStream()
                .map(roadMapper::roadToRoadDTO)
                .collect(Collectors.toList())
        ), HttpStatus.OK);
    }

    /**
     * GET  /edges/:id -> get the "id" edge.
     */
    @RequestMapping(value = "/road/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Road> getEdge(@PathVariable String id) {
        log.debug("REST request to get Road : {}", id);
        Road result = roadService.findOne(id);
        return Optional.ofNullable(result)
            .map(rezult -> new ResponseEntity<>(
                rezult,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /edges/:id -> delete the "id" edge.
     */
    @RequestMapping(value = "/road/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteEdge(@PathVariable String id) {
        log.debug("REST request to delete Road : {}", id);
        roadService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("road", String.valueOf(id))).build();
    }
}
