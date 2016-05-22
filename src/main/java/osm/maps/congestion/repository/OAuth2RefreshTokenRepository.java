package osm.maps.congestion.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import osm.maps.congestion.domain.OAuth2AuthenticationRefreshToken;

/**
 * Spring Data MongoDB repository for the OAuth2AuthenticationRefreshToken entity.
 */
public interface OAuth2RefreshTokenRepository extends MongoRepository<OAuth2AuthenticationRefreshToken, String> {

    public OAuth2AuthenticationRefreshToken findByTokenId(String tokenId);
}
