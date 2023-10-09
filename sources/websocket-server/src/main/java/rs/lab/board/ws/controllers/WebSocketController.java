package rs.lab.board.ws.controllers;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import rs.lab.board.ws.dto.*;
import rs.lab.board.ws.services.BoardService;
import rs.lab.board.ws.utils.ConversionHelper;

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

    @MessageMapping("/incoming/{boardId}")
    public void incoming(@DestinationVariable String boardId, RawMessage message) {
        log.info(String.format("received message: %s", message));
        var obj = ConversionHelper.jsonToObject(message.getMessage());
        if(obj instanceof CreateBoardItemMessage) {
            createItem((CreateBoardItemMessage) obj);
        } else if(obj instanceof MoveBoardItemMessage) {
            moveItem((MoveBoardItemMessage) obj);
        } else if(obj instanceof RemoveBoardItemMessage) {
            removeItem((RemoveBoardItemMessage) obj);
        } else if(obj instanceof UserMessage) {
            userMessage((UserMessage) obj);
        }
        simpMessagingTemplate.convertAndSend(String.format("/topic/outgoing.%s", boardId), message.getMessage());
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
        boardService.storeUserMessage(message.getBoardName(), message.getUser(), message.getMessage());
    }
}