package rs.lab.board.ws.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import rs.lab.board.ws.dto.ApiRequest;
import rs.lab.board.ws.dto.ApiResponse;
import rs.lab.board.ws.models.BoardItemEntity;
import rs.lab.board.ws.services.BoardService;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

@Slf4j
@Controller
public class WebSocketApiController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private BoardService boardService;

    @Autowired
    public WebSocketApiController(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/api/request")
    public void apiCall(@Header("correlation-id") String correlationId, @Header("reply-to") String replyTo, ApiRequest apiRequest) {
        log.info("Received: {}, correlationId={}, replyTo={}", apiRequest, correlationId, replyTo);

        var reply = apiMethodDispatcher(apiRequest);

        log.info("Reply: {}", reply);
        simpMessagingTemplate.convertAndSend(replyTo, reply, Map.of("correlation-id", correlationId,
                // NOTE: These header values need to match with the values that were used during the creation of the queue to prevent
                // exception (payload=RESOURCE_LOCKED - cannot obtain exclusive access to locked queue 'replies-eda3b8...(truncated))
                "exclusive", false, "durable", false, "auto-delete", true));
    }

    private ApiResponse apiMethodDispatcher(ApiRequest apiRequest) {
        ApiResponse reply;
        switch (apiRequest.getMethod()) {
            case "get-board-items": {
                reply = getBoardItems(apiRequest.getArg(0));
            } break;
            default:
                throw new RuntimeException("Invalid API method");
        }
        return reply;
    }

    private ApiResponse getBoardItems(String boardName) {
        var result = boardService.getBoardItemsByName(boardName);
        var reply = ApiResponse.builder()
                .body(result)
                .build();

        return reply;
    }
}
