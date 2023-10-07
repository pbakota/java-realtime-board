package rs.lab.board.ws.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.context.annotation.Configuration;
import rs.lab.board.ws.utils.SocketUtils;

@Configuration
public class WebServerFactoryConfig implements WebServerFactoryCustomizer<ConfigurableServletWebServerFactory> {
    @Value("${server.min-port:10000}")
    private Integer minPort;
    @Value("${server.max-port:11000}")
    private Integer maxPort;

    @Override
    public void customize(ConfigurableServletWebServerFactory factory) {
        int port = SocketUtils.findAvailablePort(minPort, maxPort);
        factory.setPort(port);
        System.getProperties().put("server.port", port);
    }
}