package rs.lab.board.ws.models;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface BoardRepository extends MongoRepository<BoardEntity, String> {
    @Query("{ 'name': ?0 }")
    Optional<BoardEntity> findByName(String name);
}
