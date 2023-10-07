package rs.lab.board.ws.models;

public enum BoardItemType {
    CIRCLE("circle"),
    RECT("rect"),
    TRIANGLE("triangle");

    private String type;

    BoardItemType(String type) {
        this.type = type;
    }
}
