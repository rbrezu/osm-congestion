package osm.maps.congestion.service.servers;

import com.squareup.okhttp.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import retrofit.Call;
import retrofit.http.GET;
import retrofit.http.Streaming;

/**
 * Created by root on 23.05.2016.
 */
public interface MapzenServer {
    @GET("/metro-extracts.mapzen.com/sibiu_romania.osm2pgsql-geojson.zip")
    @Streaming
    Call<ResponseBody> getFile();
}
