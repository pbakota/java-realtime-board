import { BoardApp } from "./app";

// NOTE: CANVAS_ID and BROKER_URL are defined in html file.
// @ts-ignore
const $board = new BoardApp(CANVAS_ID, BROKER_URL);
$board.run();
