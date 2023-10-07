package rs.lab.board.ws;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import rs.lab.board.ws.models.BoardEntity;
import rs.lab.board.ws.models.BoardRepository;

import java.util.UUID;

@EnableMongoRepositories
@SpringBootApplication
public class WebsocketApplication {
    public static void main(String[] args) {
        SpringApplication.run(WebsocketApplication.class, args);
    }

    @Autowired
    private BoardRepository boardRepository;

    @EventListener
    public void seed(ContextRefreshedEvent event) {
        var board = boardRepository.findByName("default");
        if (!board.isPresent()) {
            boardRepository.save(BoardEntity.builder()
                    .id(UUID.randomUUID().toString())
                    .name("default")
                    .build());
        }
    }
}