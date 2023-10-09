package rs.lab.board.ws.models;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface BoardItemRepository extends MongoRepository<BoardItemEntity, String> {

    @Query("{ 'boardId': ?0 }")
    Collection<BoardItemEntity> findAllByBoardId(String boardId);

}
