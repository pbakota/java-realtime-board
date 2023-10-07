import { BoardApp } from "./app";

const CANVAS_ID = 'canvas';
const BROKER_URL = 'ws://192.168.7.3:8081/websocket';

const $board = new BoardApp(CANVAS_ID, BROKER_URL);
$board.run();