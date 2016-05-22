package osm.maps.congestion.service.servers;

import com.squareup.okhttp.ResponseBody;
import retrofit.Call;
import retrofit.http.GET;
import retrofit.http.Query;
import retrofit.http.Streaming;

/**
 * Created by root on 15.05.2016.
 */
public interface OsmServer {
    @GET("/api/0.6/map")
    @Streaming
    Call<ResponseBody> getMapFile(
        @Query("bbox") BBox left
    );

}
