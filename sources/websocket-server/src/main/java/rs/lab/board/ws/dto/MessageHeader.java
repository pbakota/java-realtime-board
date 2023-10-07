package rs.lab.board.ws.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public abstract class MessageHeader {
    private String type;
    private String boardName;
}
