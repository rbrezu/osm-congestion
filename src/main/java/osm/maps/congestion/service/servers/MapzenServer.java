package osm.maps.congestion.service.servers;

import com.squareup.okhttp.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import retrofit.Call;
import retrofit.http.GET;
import retrofit.http.Streaming;
import retrofit.http.Url;

/**
 * Created by root on 23.05.2016.
 */
public interface MapzenServer {
    @GET
    @Streaming
    Call<ResponseBody> getFile(@Url String url);
}
