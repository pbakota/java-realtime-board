package rs.lab.board.ws.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import rs.lab.board.ws.dto.CreateBoardItemMessage;
import rs.lab.board.ws.dto.MoveBoardItemMessage;
import rs.lab.board.ws.dto.RemoveBoardItemMessage;
import rs.lab.board.ws.dto.UserMessage;

import java.util.HashMap;
import java.util.Map;

public class FormatHelper {
    private static final ObjectMapper mapper = new ObjectMapper();

    public static Map<String, Object> jsonToMap(String json) {
        try {
            Map<String, Object> userData = mapper.readValue(json, new TypeReference<Map<String, Object>>() {
            });
            return userData;
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public static Object jsonToObject(String json) {
        try {
            var map = jsonToMap(json);
            switch ((String) map.get("type")) {
                case "USER_MESSAGE":
                    return mapper.readValue(json, new TypeReference<UserMessage>() {
                    });
                case "OBJECT_CREATED":
                    return mapper.readValue(json, new TypeReference<CreateBoardItemMessage>() {
                    });
                case "OBJECT_MOVED":
                    return mapper.readValue(json, new TypeReference<MoveBoardItemMessage>() {
                    });
                case "OBJECT_REMOVED":
                    return mapper.readValue(json, new TypeReference<RemoveBoardItemMessage>() {
                    });
                default:
                    throw new RuntimeException("Not a valid message");
            }

        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
