package rs.lab.board.ws.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import rs.lab.board.ws.models.*;
import rs.lab.board.ws.utils.Vector2d;

import java.util.Collection;
import java.util.Collections;
import java.util.Optional;

@Slf4j
@Service
public class BoardService {
    @Autowired
    private BoardItemRepository boardItemRepository;

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
        if(board != null) {
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
}
