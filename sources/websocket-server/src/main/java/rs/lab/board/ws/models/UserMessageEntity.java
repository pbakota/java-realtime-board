package rs.lab.board.ws.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@Document("messages")
public class UserMessageEntity {
    @Id
    private String id;
    private String boardId;
    private String user;
    private String message;
    private Date createdAt;
}
