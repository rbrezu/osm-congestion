package osm.maps.congestion.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import osm.maps.congestion.domain.Road;
import osm.maps.congestion.domain.parser.GraphNode;
import osm.maps.congestion.repository.GraphNodeRepository;
import osm.maps.congestion.repository.RoadRepository;
import osm.maps.congestion.service.servers.FeatureCollection;
import osm.maps.congestion.web.rest.dto.NodeDTO;
import osm.maps.congestion.web.rest.mapper.NodeMapper;
import osm.maps.congestion.web.rest.mapper.RoadMapper;

import javax.inject.Inject;

/**
 * Created by root on 24.05.2016.
 */
@Service
public class RoadService {
    private final Logger log = LoggerFactory.getLogger(RoadService.class);

    @Inject
    private RoadRepository roadRepository;

    @Inject
    private RoadMapper roadMapper;

    /**
     * Save a road.
     * @return the persisted entity
     */
    public Road save(Road road) {
        log.debug("Request to save Road : {}", road);
        return roadRepository.save(road);
    }

    /**
     *  get all the roads.
     *  @return the list of entities
     */
    public Page<Road> findAll(Pageable pageable) {
        log.debug("Request to get all Nodes");
        Page<Road> result = roadRepository.findAll(pageable);
        return result;
    }

    /**
     *  get one road by id.
     *  @return the entity
     */
    public Road findOne(String id) {
        log.debug("Request to get road : {}", id);
        return roadRepository.findOne(id);
    }

    /**
     *  delete the  road by id.
     */
    public void delete(String id) {
        log.debug("Request to delete road : {}", id);
        roadRepository.delete(id);
    }
}
