package rs.lab.board.ws.dto;

import lombok.Data;

@Data
public class ApiRequest {
    private String method;
    private Object[] args;

    @SuppressWarnings("unchecked")
    public <T> T getArg(int index) {
        if(index < 0 || index > args.length) {
            throw new IndexOutOfBoundsException();
        }
        return (T)args[index];
    }
}
