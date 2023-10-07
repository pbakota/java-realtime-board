package rs.lab.board.ws.models;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Collection;

public interface BoardItemRepository extends MongoRepository<BoardItemEntity, String> {

    @Query("{ 'boardId': ?0 }")
    public Collection<BoardItemEntity> findAllByBoardId(String boardId);

}
