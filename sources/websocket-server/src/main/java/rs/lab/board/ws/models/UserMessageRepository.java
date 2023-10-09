package rs.lab.board.ws.models;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;

@Repository
public interface UserMessageRepository extends PagingAndSortingRepository<UserMessageEntity, String>, MongoRepository<UserMessageEntity, String> {

    @Query("{ 'boardId': ?0 }")
    Collection<UserMessageEntity> findAllByBoardId(String boardId);

    @Query("{ 'boardId': ?0 }")
    Page<UserMessageEntity> findAllByBoardId(String boardId, Pageable page);

}
