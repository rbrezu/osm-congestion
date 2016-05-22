package osm.maps.congestion.config;

import com.squareup.okhttp.OkHttpClient;
import org.springframework.context.annotation.Bean;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.stereotype.Component;
import osm.maps.congestion.service.servers.OsmServer;
import retrofit.JacksonConverterFactory;
import retrofit.Retrofit;

import javax.inject.Inject;

/**
 * Created by root on 15.05.2016.
 */
@Component
public class RetrofitConfiguration {
    @Inject
    private Jackson2ObjectMapperBuilder jackson2ObjectMapperBuilder;

    @Inject
    private JHipsterProperties properties;

    @Bean
    Retrofit.Builder buildRetrofitBuilder() {
        OkHttpClient httpClient = new OkHttpClient();

        httpClient.interceptors().clear();
        /*httpClient.interceptors().add(chain -> {
            Request original = chain.request();

            Request.Builder requestBuilder = original.newBuilder()
                .header("Accept", "application/json")
                .header("Content-Type", "application/json")
                .header("Content-Length", String.valueOf(original.body() != null ?
                    original.body().contentLength() : 0))
                .method(original.method(), original.body());

            Request request = requestBuilder.build();
            return chain.proceed(request);
        });
        httpClient.setReadTimeout(20, TimeUnit.SECONDS);
        httpClient.setConnectTimeout(20, TimeUnit.SECONDS);*/

        return new Retrofit.Builder()
            .client(httpClient)
            .addConverterFactory(JacksonConverterFactory.create(jackson2ObjectMapperBuilder.build()));
    }

    @Bean
    OsmServer buildOsmServer() {
        return buildRetrofitBuilder()
            .baseUrl("http://" + properties.getOsm().getServer())
            .build()
            .create(OsmServer.class);
    }
}
