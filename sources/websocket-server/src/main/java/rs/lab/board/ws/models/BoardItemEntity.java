package rs.lab.board.ws.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import rs.lab.board.ws.utils.Vector2d;

@Data
@Builder
@AllArgsConstructor
@Document("board_items")
public class BoardItemEntity {
    @Id
    private String id;
    private String boardId;
    private BoardItemType type;
    private Vector2d position;
    private Vector2d size;
    private String faceColor;
    private String borderColor;
    private Integer strokeWidth;
}
