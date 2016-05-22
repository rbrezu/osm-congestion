package osm.maps.congestion.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import osm.maps.congestion.domain.parser.DirectedEdge;
import osm.maps.congestion.repository.DirectedEdgeRepository;
import osm.maps.congestion.web.rest.dto.EdgeDTO;
import osm.maps.congestion.web.rest.mapper.EdgeMapper;

import javax.inject.Inject;

/**
 * Service Implementation for managing Edge.
 */
@Service
public class EdgeService {

    private final Logger log = LoggerFactory.getLogger(EdgeService.class);

    @Inject
    private DirectedEdgeRepository edgeRepository;

    @Inject
    private EdgeMapper edgeMapper;

    /**
     * Save a edge.
     * @return the persisted entity
     */
    public EdgeDTO save(EdgeDTO edgeDTO) {
        log.debug("Request to save Edge : {}", edgeDTO);
        DirectedEdge edge = edgeMapper.edgeDTOToEdge(edgeDTO);
        edge = edgeRepository.save(edge);
        EdgeDTO result = edgeMapper.edgeToEdgeDTO(edge);
        return result;
    }

    /**
     *  get all the edges.
     *  @return the list of entities
     */
    public Page<DirectedEdge> findAll(Pageable pageable) {
        log.debug("Request to get all Edges");
        Page<DirectedEdge> result = edgeRepository.findAll(pageable);
        return result;
    }

    /**
     *  get one edge by id.
     *  @return the entity
     */
    public EdgeDTO findOne(long id) {
        log.debug("Request to get Edge : {}", id);
        DirectedEdge edge = edgeRepository.findOne(id);
        EdgeDTO edgeDTO = edgeMapper.edgeToEdgeDTO(edge);
        return edgeDTO;
    }

    /**
     *  delete the  edge by id.
     */
    public void delete(long id) {
        log.debug("Request to delete Edge : {}", id);
        edgeRepository.delete(id);
    }
}
