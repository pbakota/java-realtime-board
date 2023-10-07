package rs.lab.board.ws.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import rs.lab.board.ws.utils.Vector2d;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper=false)
public class MoveBoardItemMessage extends MessageHeader {
    private String id;
    private Vector2d position;
}
