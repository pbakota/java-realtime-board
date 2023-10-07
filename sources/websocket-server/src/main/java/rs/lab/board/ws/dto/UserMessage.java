package rs.lab.board.ws.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper=false)
public class UserMessage extends MessageHeader {
    private String user;
    private String message;
}
