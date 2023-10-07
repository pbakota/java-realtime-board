package rs.lab.board.ws.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import rs.lab.board.ws.utils.Vector2d;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper=false)
public class CreateBoardItemMessage extends MessageHeader {
    private String id;
    private String itemType;
    private Vector2d position;
    private Vector2d size;
    private String faceColor;
    private String borderColor;
    private int strokeWidth;
}
