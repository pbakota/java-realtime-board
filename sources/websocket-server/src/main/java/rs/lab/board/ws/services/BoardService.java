package rs.lab.board.ws.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import rs.lab.board.ws.models.*;
import rs.lab.board.ws.utils.Vector2d;

import java.sql.Date;
import java.time.Instant;
import java.util.Collection;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
public class BoardService {
    @Autowired
    private BoardItemRepository boardItemRepository;

    @Autowired
    private UserMessageRepository userMessageRepository;

    @Autowired
    private BoardRepository boardRepository;

    public BoardItemEntity createBoardItem(String boardId, String id, String type, Vector2d position, Vector2d size,
                                           String faceColor, String borderColor, int strokeWidth) {
        var boardItem = BoardItemEntity.builder()
                .id(id)
                .boardId(boardId)
                .type(BoardItemType.valueOf(type.toUpperCase()))
                .position(position)
                .size(size)
                .faceColor(faceColor)
                .borderColor(borderColor)
                .strokeWidth(strokeWidth)
                .build();

        return boardItemRepository.save(boardItem);
    }

    public Optional<BoardEntity> findBoardByName(String boardName) {
        return boardRepository.findByName(boardName);
    }

    public Collection<BoardItemEntity> getBoardItemsByName(String boardName) {
        var board = boardRepository.findByName(boardName).orElse(null);
        if (board != null) {
            return board.getItems();
        }
        return Collections.emptyList();
    }

    public void moveBoardItem(String id, Vector2d position) {
        var boardItem = boardItemRepository.findById(id);
        boardItem.ifPresent(b -> {
            b.setPosition(position);
            boardItemRepository.save(b);
        });
    }

    public void removeBoardItem(String id) {
        var boardItem = boardItemRepository.findById(id);
        boardItem.ifPresent(b -> {
            boardItemRepository.delete(b);
        });
    }

    public BoardEntity createBoard(String boardName) {
        var board = boardRepository.findByName(boardName);
        if (board.isPresent()) {
            throw new RuntimeException(String.format("Board with name '%s' already exists", boardName));
        }
        var newBoard = boardRepository.save(BoardEntity.builder()
                .id(UUID.randomUUID().toString())
                .name(boardName)
                .build());

        return newBoard;
    }

    public Collection<UserMessageEntity> getLatestMessages(String boardName, int limit) {
        var board = boardRepository.findByName(boardName).orElse(null);
        if (board != null) {
            var result = userMessageRepository.findAllByBoardId(board.getId(),
                    PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"))).stream().collect(Collectors.toList());

            // NOTE: The result will contain an ordered list of user messages, but it will be in the wrong order
            // because the first element will be the last message, however, what we need is to be naturally sorted
            // which means the last message should be the last in the list. That is why we reverse the list here.
            Collections.reverse(result);
            return result;
        }
        return Collections.emptyList();
    }

    public void storeUserMessage(String boardName, String user, String message) {
        var board = findBoardByName(boardName);
        board.ifPresent(b -> {
            userMessageRepository.save(UserMessageEntity.builder()
                    .id(UUID.randomUUID().toString())
                    .boardId(b.getId())
                    .user(user)
                    .message(message)
                    .createdAt(Date.from(Instant.now()))
                    .build());
        });
    }
}
