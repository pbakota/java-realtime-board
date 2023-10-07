package rs.lab.board.ws.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import rs.lab.board.ws.dto.*;
import rs.lab.board.ws.services.BoardService;
import rs.lab.board.ws.utils.FormatHelper;

import java.util.Random;

@Slf4j
@Controller
public class WebSocketController {
    private static final Random RANDOM = new Random();
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private BoardService boardService;

    @Value("${server.port}")
    private String port;

    @Autowired
    public WebSocketController(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/incoming")
    @SendTo("/topic/outgoing")
    public String incoming(RawMessage message) {
        log.info(String.format("received message: %s", message));
        var obj = FormatHelper.jsonToObject(message.getMessage());
        if(obj instanceof CreateBoardItemMessage) {
            createItem((CreateBoardItemMessage) obj);
        } else if(obj instanceof MoveBoardItemMessage) {
            moveItem((MoveBoardItemMessage) obj);
        } else if(obj instanceof RemoveBoardItemMessage) {
            removeItem((RemoveBoardItemMessage) obj);
        } else if(obj instanceof UserMessage) {
            userMessage((UserMessage) obj);
        }
        return message.getMessage();
    }

    private void createItem(CreateBoardItemMessage message) {
        var board = boardService.findBoardByName(message.getBoardName());
        board.ifPresentOrElse(b -> {
            boardService.createBoardItem(
                    b.getId(),
                    message.getId(),
                    message.getItemType(),
                    message.getPosition(),
                    message.getSize(),
                    message.getFaceColor(),
                    message.getBorderColor(),
                    message.getStrokeWidth()
            );
        }, () -> {
            log.warn("Board {} does not exist", message.getBoardName());
        });
    }

    private void moveItem(MoveBoardItemMessage message) {
        var board = boardService.findBoardByName(message.getBoardName());
        board.ifPresent(b -> {
            boardService.moveBoardItem(message.getId(), message.getPosition());
        });
    }

    private void removeItem(RemoveBoardItemMessage message) {
        var board = boardService.findBoardByName(message.getBoardName());
        board.ifPresent(b -> {
            boardService.removeBoardItem(message.getId());
        });
    }

    private void userMessage(UserMessage message) {
        log.info("User message: {}", message.getMessage());
        // TODO: Store user messages into db
    }
}