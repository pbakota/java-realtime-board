package rs.lab.board.ws.models;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.ReadOnlyProperty;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.util.List;

@Data
@Builder
@Document("boards")
public class BoardEntity {
    @Id
    private String id;
    private String name;
    @ReadOnlyProperty
    @DocumentReference(lazy = true, lookup="{'boardId':?#{#self._id} }")
    private List<BoardItemEntity> items;
}
