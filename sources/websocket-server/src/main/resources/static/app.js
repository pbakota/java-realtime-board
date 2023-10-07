// node_modules/uuid/dist/esm-browser/rng.js
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}

// node_modules/uuid/dist/esm-browser/stringify.js
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}
var byteToHex = [];
for (let i = 0;i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}

// node_modules/uuid/dist/esm-browser/native.js
var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native_default = {
  randomUUID
};

// node_modules/uuid/dist/esm-browser/v4.js
var v4 = function(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0;i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
};
var v4_default = v4;
// src/util.ts
class Vector2d {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  x;
  y;
  add(v) {
    return new Vector2d(this.x + v.x, this.y + v.y);
  }
}

class Rect {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  ptInRect(x, y) {
    return this.x <= x && x <= this.x + this.w && this.y <= y && y <= this.y + this.h;
  }
  aabb(rect) {
    return this.x < rect.x + rect.w && this.x + this.w > rect.x && this.y < rect.y + rect.h && this.h + this.y > rect.y;
  }
  x;
  y;
  w;
  h;
}

// src/items.ts
class Sprite {
  id;
  size;
  position;
  velocity;
  color;
  border;
  constructor(id, x, y, width, height, faceColor, borderColor) {
    this.id = id;
    this.position = new Vector2d(x, y);
    this.size = new Vector2d(width, height);
    this.velocity = new Vector2d(0, 0);
    this.color = faceColor;
    this.border = borderColor;
  }
  isOver(x, y) {
    return new Rect(this.position.x, this.position.y, this.size.x, this.size.y).ptInRect(x, y);
  }
}

class ImageCache {
  _backgroundCache;
  _cached;
  constructor() {
    this._backgroundCache = document.createElement("canvas");
    this._cached = false;
  }
  draw(ctx, render, x, y) {
    if (this._cached) {
      ctx.drawImage(this._backgroundCache, x, y);
    } else {
      render(this._backgroundCache.getContext("2d"));
      ctx.drawImage(this._backgroundCache, x, y);
      this._cached = true;
    }
  }
  clear() {
    this._cached = false;
  }
}

class BufferedSprite extends Sprite {
  _imageCache;
  constructor(id, x, y, width, height, faceColor, borderColor) {
    super(id, x, y, width, height, faceColor, borderColor);
    this._imageCache = new ImageCache;
  }
}

class Circle extends BufferedSprite {
  constructor() {
    super(...arguments);
  }
  draw(ctx) {
    this._imageCache.draw(ctx, (bctx) => {
      bctx.beginPath();
      bctx.strokeStyle = this.border;
      bctx.lineWidth = 3;
      bctx.fillStyle = this.color;
      bctx.ellipse(this.size.x / 2, this.size.y / 2, this.size.x / 2 - 6, this.size.y / 2 - 6, Math.PI / 4, 0, 2 * Math.PI);
      bctx.fill();
      bctx.stroke();
    }, this.position.x, this.position.y);
  }
  update(dt) {
  }
}

class Box extends BufferedSprite {
  constructor() {
    super(...arguments);
  }
  draw(ctx) {
    this._imageCache.draw(ctx, (bctx) => {
      bctx.beginPath();
      bctx.strokeStyle = this.border;
      bctx.lineWidth = 3;
      bctx.fillStyle = this.color;
      bctx.rect(3, 3, this.size.x - 6, this.size.y - 6);
      bctx.fill();
      bctx.stroke();
    }, this.position.x, this.position.y);
  }
  update(dt) {
  }
}

class Triangle extends BufferedSprite {
  constructor() {
    super(...arguments);
  }
  draw(ctx) {
    this._imageCache.draw(ctx, (bctx) => {
      bctx.beginPath();
      bctx.strokeStyle = this.border;
      bctx.lineWidth = 3;
      bctx.fillStyle = this.color;
      bctx.moveTo(3, this.size.y - 6);
      bctx.lineTo(this.size.x / 2, 3);
      bctx.lineTo(this.size.x - 6, this.size.y - 6);
      bctx.lineTo(3, this.size.y - 6);
      bctx.fill();
      bctx.stroke();
    }, this.position.x, this.position.y);
  }
  update(dt) {
  }
}

// src/models.ts
class Message {
  type;
  boardName;
  constructor(type, boardName) {
    this.type = type;
    this.boardName = boardName;
  }
}

class ObjectMessage extends Message {
  id;
  constructor(type, boardName, id) {
    super(type, boardName);
    this.id = id;
  }
}

class ObjectMovedMessage extends ObjectMessage {
  position;
  constructor(id, boardName, position) {
    super("OBJECT_MOVED", boardName, id);
    this.position = position;
  }
}

class ObjectRemovedMessage extends ObjectMessage {
  constructor(id, boardName) {
    super("OBJECT_REMOVED", boardName, id);
  }
}

class ObjectCreateMessage extends ObjectMessage {
  itemType;
  position;
  size;
  faceColor;
  borderColor;
  strokeWidth;
  constructor(id, boardName, itemType, position, size, faceColor, borderColor, strokeWidth) {
    super("OBJECT_CREATED", boardName, id);
    this.position = position;
    this.size = size;
    this.itemType = itemType;
    this.faceColor = faceColor;
    this.borderColor = borderColor;
    this.strokeWidth = strokeWidth;
  }
}

class UserMessage extends Message {
  user;
  message;
  constructor(boardName, user, message) {
    super("USER_MESSAGE", boardName);
    this.boardName = boardName;
    this.user = user;
    this.message = message;
  }
}

// src/boardScene.ts
class BoardScene {
  _app;
  _input;
  _shapes;
  _selected;
  _canvasWidth;
  _canvasHeight;
  _newPosition;
  _offset;
  _removeSelected;
  constructor(app) {
    this._app = app;
    this._input = app.input;
    this._shapes = [];
    this._canvasWidth = this._app.renderer.display.width;
    this._canvasHeight = this._app.renderer.display.height;
    this._newPosition = new Vector2d(this._canvasWidth / 2, this._canvasHeight / 2);
    this._selected = null;
    this._removeSelected = false;
  }
  update(dt) {
    const mouse = this._input.mousePos();
    if (this._input.isMouseDown()) {
      if (this._selected == null) {
        this._shapes.forEach((s) => {
          if (s.isOver(mouse.x, mouse.y)) {
            if (this._selected?.id != s.id) {
              this._offset = new Vector2d(s.position.x - mouse.x, s.position.y - mouse.y);
              this._selected = s;
              console.log("Selected " + s.id);
              return;
            }
          }
        });
        if (this._selected != null && this._removeSelected) {
          this._app.socket.sendMessage(new ObjectRemovedMessage(this._selected.id, this._app.boardName));
          this._selected = null;
        }
        this._removeSelected = false;
      }
      if (this._selected != null) {
        this._selected.position = mouse.add(this._offset);
        this._app.socket.sendMessage(new ObjectMovedMessage(this._selected.id, this._app.boardName, this._selected.position));
      }
    } else {
      this._selected = null;
    }
  }
  draw(ctx) {
    this._shapes.forEach((s) => {
      s.draw(ctx);
    });
  }
  command(cmd, args) {
    if (/^add\-/.test(cmd)) {
      let shapeType = null;
      let position = new Vector2d(this._newPosition.x, this._newPosition.y);
      let size = new Vector2d(100, 100);
      switch (cmd) {
        case "add-circle":
          shapeType = "circle";
          break;
        case "add-rect":
          shapeType = "rect";
          break;
        case "add-triangle":
          shapeType = "triangle";
          break;
        default:
          throw "Invalid add command";
      }
      const faceColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      const borderColor = "black";
      const strokeWidth = 3;
      this._app.socket.sendMessage(new ObjectCreateMessage(v4_default(), this._app.boardName, shapeType, position, size, faceColor, borderColor, strokeWidth));
    } else {
      switch (cmd) {
        case "refresh-board":
          this.refreshBoard();
          break;
        case "remove-selected":
          this._removeSelected = true;
          break;
        case "send-message":
          this._app.socket.sendMessage(new UserMessage(this._app.boardName, args[0], args[1]));
          break;
        default:
          throw "Invalid command";
      }
    }
  }
  addShape(bi) {
    let newShape = null;
    switch (bi.type) {
      case "CIRCLE":
        newShape = new Circle(bi.id, bi.position.x, bi.position.y, bi.size.x, bi.size.y, bi.faceColor, bi.borderColor);
        break;
      case "RECT":
        newShape = new Box(bi.id, bi.position.x, bi.position.y, bi.size.x, bi.size.y, bi.faceColor, bi.borderColor);
        break;
      case "TRIANGLE":
        newShape = new Triangle(bi.id, bi.position.x, bi.position.y, bi.size.x, bi.size.y, bi.faceColor, bi.borderColor);
        break;
      default:
        throw "Invalid shape";
    }
    this._shapes.push(newShape);
  }
  refreshBoard() {
    this._shapes = [];
    this._app.socket.callMethod((response) => {
      response.body.forEach((itemEntity) => {
        this.addShape(itemEntity);
      });
    }, "get-board-items", this._app.boardName);
  }
  wsMessage(message) {
    switch (message.type) {
      case "OBJECT_CREATED":
        {
          const obj = message;
          let newShape = null;
          switch (obj.itemType.toUpperCase()) {
            case "CIRCLE":
              newShape = new Circle(obj.id, obj.position.x, obj.position.y, obj.size.x, obj.size.y, obj.faceColor, obj.borderColor);
              break;
            case "RECT":
              newShape = new Box(obj.id, obj.position.x, obj.position.y, obj.size.x, obj.size.y, obj.faceColor, obj.borderColor);
              break;
            case "TRIANGLE":
              newShape = new Triangle(obj.id, obj.position.x, obj.position.y, obj.size.x, obj.size.y, obj.faceColor, obj.borderColor);
              break;
            default:
              throw "Invalid shape";
          }
          this._shapes.push(newShape);
        }
        break;
      case "OBJECT_REMOVED":
        {
          const obj = message;
          this._shapes = this._shapes.filter((s) => s.id != obj.id);
        }
        break;
      case "OBJECT_MOVED":
        {
          const obj = message;
          let shape = this._shapes.find((value) => value.id == obj.id);
          if (shape) {
            shape.position = obj.position;
          }
        }
        break;
      case "USER_MESSAGE":
        {
          const obj = message;
          const messageOutput = document.getElementById("message-output").getElementsByTagName("tbody")[0];
          const newRow = messageOutput.insertRow();
          const newCol = newRow.insertCell();
          newRow.style.cssText = "th-lg";
          newCol.innerHTML = `<em>${obj.user} say</em>: ${obj.message}`;
          messageOutput.appendChild(newRow);
          messageOutput.scrollTop = messageOutput.scrollHeight;
        }
        break;
      default:
        console.error(message);
        throw "Invalid message type";
    }
  }
}

// src/engine.ts
class Engine {
  _renderer;
  _start;
  _input;
  constructor(element, renderer) {
    this._renderer = renderer;
    this._input = new Input(document.getElementById(element));
    this._start = null;
  }
  get displayWidth() {
    return this._renderer.display.width;
  }
  get displayHeight() {
    return this._renderer.display.height;
  }
  get input() {
    return this._input;
  }
  storeLocal(data) {
    if (window.localStorage) {
      window.localStorage.setItem("board", JSON.stringify(data));
    }
  }
  readLocal() {
    if (window.localStorage) {
      return JSON.parse(window.localStorage.getItem("board"));
    }
  }
  get renderer() {
    return this._renderer;
  }
  loop = (ts) => {
    window.requestAnimationFrame(this.loop);
    if (this._start === null) {
      this._start = ts;
    }
    const dt = (ts - this._start) / 1000;
    this._start = ts;
    this.update(dt);
    this.draw(this._renderer.context);
    this._renderer.flip();
  };
  run() {
    window.requestAnimationFrame(this.loop);
  }
}

class Input {
  _keys = {};
  _lastk = InputKey.NO_KEY;
  _mouseDown;
  _mouseMove;
  constructor(element) {
    window.addEventListener("keydown", (e) => {
      this._keys["k" + e.code] = true;
      this._lastk = e.code;
    });
    window.addEventListener("keyup", (e) => {
      this._keys["k" + e.code] = false;
      this._lastk = InputKey.NO_KEY;
    });
    element.addEventListener("mousedown", (e) => {
      this._mouseDown = true;
    });
    element.addEventListener("mouseup", (e) => {
      this._mouseDown = false;
    });
    element.addEventListener("mousemove", (e) => {
      this._mouseMove = new Vector2d(e.offsetX, e.offsetY);
    });
    element.addEventListener("touchmove", (e) => {
      var evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
      var touch = evt.touches[0] || evt.changedTouches[0];
      this._mouseMove = new Vector2d(touch.pageX, touch.pageY);
    });
    element.addEventListener("touchstart", (e) => {
      this._mouseDown = true;
    });
    element.addEventListener("touchend", (e) => {
      this._mouseDown = false;
    });
    element.addEventListener("touchcancel", (e) => {
      this._mouseDown = false;
    });
  }
  isMouseDown = () => {
    return this._mouseDown;
  };
  mousePos = () => {
    return this._mouseMove;
  };
  isDown = (keyCode) => {
    this._lastk = keyCode;
    return this._keys["k" + keyCode] == true;
  };
  isUp = (keyCode) => {
    this._lastk = InputKey.NO_KEY;
    return this._keys["k" + keyCode] == false;
  };
  isPressed = (keyCode) => {
    var pressed = this._keys["k" + keyCode] == true;
    this._keys["k" + keyCode] = false;
    return pressed;
  };
  clear = () => {
    this._keys = {};
    this._lastk = InputKey.NO_KEY;
  };
  rawKey = () => {
    if (this._lastk == InputKey.NO_KEY)
      return InputKey.NO_KEY;
    var pressed = this._keys["k" + this._lastk] == true;
    this._keys["k" + this._lastk] = false;
    if (pressed)
      return this._lastk;
    return InputKey.NO_KEY;
  };
}
var InputKey = {
  NO_KEY: "",
  KEY_LEFT: "ArrowLeft",
  KEY_DOWN: "ArrowDown",
  KEY_RIGHT: "ArrowRight",
  KEY_UP: "ArrowUp",
  KEY_RETURN: "Enter",
  KEY_ESCAPE: "Escape",
  KEY_BS: "Backspace",
  KEY_SPACE: "Space",
  KEY_PGDOWN: "PageDown",
  KEY_PGUP: "PageUp",
  KEY_FIRE: "KeyZ",
  KEY_A: "KeyA",
  KEY_B: "KeyB",
  KEY_C: "KeyC",
  KEY_D: "KeyD",
  KEY_E: "KeyE",
  KEY_F: "KeyF",
  KEY_G: "KeyG",
  KEY_H: "KeyH",
  KEY_I: "KeyI",
  KEY_J: "KeyJ",
  KEY_K: "KeyK",
  KEY_L: "KeyL",
  KEY_M: "KeyM",
  KEY_N: "KeyN",
  KEY_O: "KeyO",
  KEY_P: "KeyP",
  KEY_Q: "KeyQ",
  KEY_R: "KeyR",
  KEY_S: "KeyS",
  KEY_T: "KeyT",
  KEY_U: "KeyU",
  KEY_V: "KeyV",
  KEY_W: "KeyW",
  KEY_X: "KeyX",
  KEY_Y: "KeyY",
  KEY_Z: "KeyZ"
};

// src/renderer.ts
class Renderer {
  _canvas;
  _ctx;
  _bcanvas;
  _bctx;
  constructor(canvasId) {
    this._canvas = document.getElementById(canvasId);
    this._ctx = this._canvas.getContext("2d");
    this._bcanvas = this._canvas.cloneNode(true);
    this._bctx = this._bcanvas.getContext("2d");
  }
  get display() {
    return this._canvas;
  }
  get context() {
    return this._ctx;
  }
  get backbuffer() {
    return this._bcanvas;
  }
  get bctx() {
    return this._bctx;
  }
  flip() {
    this._ctx.drawImage(this._bcanvas, 0, 0);
  }
}

// node_modules/tslib/tslib.es6.mjs
function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __);
}
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1)
      throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), throw: verb(1), return: verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f)
      throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _)
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
          return t;
        if (y = 0, t)
          op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2])
              _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    if (op[0] & 5)
      throw op[1];
    return { value: op[0] ? op[1] : undefined, done: true };
  }
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m)
    return m.call(o);
  if (o && typeof o.length === "number")
    return {
      next: function() {
        if (o && i >= o.length)
          o = undefined;
        return { value: o && o[i++], done: !o };
      }
    };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m)
    return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === undefined || n-- > 0) && !(r = i.next()).done)
      ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"]))
        m.call(i);
    } finally {
      if (e)
        throw e.error;
    }
  }
  return ar;
}
function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l = from.length, ar;i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar)
          ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from));
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function verb(n) {
    if (g[n])
      i[n] = function(v) {
        return new Promise(function(a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length)
      resume(q[0][0], q[0][1]);
  }
}
function __asyncValues(o) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v) {
      return new Promise(function(resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve({ value: v2, done: d });
    }, reject);
  }
}
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2)
      if (Object.prototype.hasOwnProperty.call(b2, p))
        d2[p] = b2[p];
  };
  return extendStatics(d, b);
};

// node_modules/rxjs/dist/esm5/internal/util/isFunction.js
function isFunction(value) {
  return typeof value === "function";
}

// node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js
function createErrorClass(createImpl) {
  var _super = function(instance) {
    Error.call(instance);
    instance.stack = new Error().stack;
  };
  var ctorFunc = createImpl(_super);
  ctorFunc.prototype = Object.create(Error.prototype);
  ctorFunc.prototype.constructor = ctorFunc;
  return ctorFunc;
}

// node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js
var UnsubscriptionError = createErrorClass(function(_super) {
  return function UnsubscriptionErrorImpl(errors) {
    _super(this);
    this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function(err, i) {
      return i + 1 + ") " + err.toString();
    }).join("\n  ") : "";
    this.name = "UnsubscriptionError";
    this.errors = errors;
  };
});

// node_modules/rxjs/dist/esm5/internal/util/arrRemove.js
function arrRemove(arr, item) {
  if (arr) {
    var index = arr.indexOf(item);
    0 <= index && arr.splice(index, 1);
  }
}

// node_modules/rxjs/dist/esm5/internal/Subscription.js
function isSubscription(value) {
  return value instanceof Subscription || value && ("closed" in value) && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe);
}
var execFinalizer = function(finalizer) {
  if (isFunction(finalizer)) {
    finalizer();
  } else {
    finalizer.unsubscribe();
  }
};
var Subscription = function() {
  function Subscription2(initialTeardown) {
    this.initialTeardown = initialTeardown;
    this.closed = false;
    this._parentage = null;
    this._finalizers = null;
  }
  Subscription2.prototype.unsubscribe = function() {
    var e_1, _a, e_2, _b;
    var errors;
    if (!this.closed) {
      this.closed = true;
      var _parentage = this._parentage;
      if (_parentage) {
        this._parentage = null;
        if (Array.isArray(_parentage)) {
          try {
            for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next();!_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
              var parent_1 = _parentage_1_1.value;
              parent_1.remove(this);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return))
                _a.call(_parentage_1);
            } finally {
              if (e_1)
                throw e_1.error;
            }
          }
        } else {
          _parentage.remove(this);
        }
      }
      var initialFinalizer = this.initialTeardown;
      if (isFunction(initialFinalizer)) {
        try {
          initialFinalizer();
        } catch (e) {
          errors = e instanceof UnsubscriptionError ? e.errors : [e];
        }
      }
      var _finalizers = this._finalizers;
      if (_finalizers) {
        this._finalizers = null;
        try {
          for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next();!_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
            var finalizer = _finalizers_1_1.value;
            try {
              execFinalizer(finalizer);
            } catch (err) {
              errors = errors !== null && errors !== undefined ? errors : [];
              if (err instanceof UnsubscriptionError) {
                errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
              } else {
                errors.push(err);
              }
            }
          }
        } catch (e_2_1) {
          e_2 = { error: e_2_1 };
        } finally {
          try {
            if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return))
              _b.call(_finalizers_1);
          } finally {
            if (e_2)
              throw e_2.error;
          }
        }
      }
      if (errors) {
        throw new UnsubscriptionError(errors);
      }
    }
  };
  Subscription2.prototype.add = function(teardown) {
    var _a;
    if (teardown && teardown !== this) {
      if (this.closed) {
        execFinalizer(teardown);
      } else {
        if (teardown instanceof Subscription2) {
          if (teardown.closed || teardown._hasParent(this)) {
            return;
          }
          teardown._addParent(this);
        }
        (this._finalizers = (_a = this._finalizers) !== null && _a !== undefined ? _a : []).push(teardown);
      }
    }
  };
  Subscription2.prototype._hasParent = function(parent) {
    var _parentage = this._parentage;
    return _parentage === parent || Array.isArray(_parentage) && _parentage.includes(parent);
  };
  Subscription2.prototype._addParent = function(parent) {
    var _parentage = this._parentage;
    this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
  };
  Subscription2.prototype._removeParent = function(parent) {
    var _parentage = this._parentage;
    if (_parentage === parent) {
      this._parentage = null;
    } else if (Array.isArray(_parentage)) {
      arrRemove(_parentage, parent);
    }
  };
  Subscription2.prototype.remove = function(teardown) {
    var _finalizers = this._finalizers;
    _finalizers && arrRemove(_finalizers, teardown);
    if (teardown instanceof Subscription2) {
      teardown._removeParent(this);
    }
  };
  Subscription2.EMPTY = function() {
    var empty = new Subscription2;
    empty.closed = true;
    return empty;
  }();
  return Subscription2;
}();
var EMPTY_SUBSCRIPTION = Subscription.EMPTY;

// node_modules/rxjs/dist/esm5/internal/config.js
var config = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: undefined,
  useDeprecatedSynchronousErrorHandling: false,
  useDeprecatedNextContext: false
};

// node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js
var timeoutProvider = {
  setTimeout: function(handler, timeout) {
    var args = [];
    for (var _i = 2;_i < arguments.length; _i++) {
      args[_i - 2] = arguments[_i];
    }
    var delegate = timeoutProvider.delegate;
    if (delegate === null || delegate === undefined ? undefined : delegate.setTimeout) {
      return delegate.setTimeout.apply(delegate, __spreadArray([handler, timeout], __read(args)));
    }
    return setTimeout.apply(undefined, __spreadArray([handler, timeout], __read(args)));
  },
  clearTimeout: function(handle) {
    var delegate = timeoutProvider.delegate;
    return ((delegate === null || delegate === undefined ? undefined : delegate.clearTimeout) || clearTimeout)(handle);
  },
  delegate: undefined
};

// node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js
function reportUnhandledError(err) {
  timeoutProvider.setTimeout(function() {
    var onUnhandledError = config.onUnhandledError;
    if (onUnhandledError) {
      onUnhandledError(err);
    } else {
      throw err;
    }
  });
}

// node_modules/rxjs/dist/esm5/internal/util/noop.js
function noop() {
}

// node_modules/rxjs/dist/esm5/internal/NotificationFactories.js
function errorNotification(error) {
  return createNotification("E", undefined, error);
}
function nextNotification(value) {
  return createNotification("N", value, undefined);
}
function createNotification(kind, value, error) {
  return {
    kind,
    value,
    error
  };
}
var COMPLETE_NOTIFICATION = function() {
  return createNotification("C", undefined, undefined);
}();

// node_modules/rxjs/dist/esm5/internal/util/errorContext.js
function errorContext(cb) {
  if (config.useDeprecatedSynchronousErrorHandling) {
    var isRoot = !context;
    if (isRoot) {
      context = { errorThrown: false, error: null };
    }
    cb();
    if (isRoot) {
      var _a = context, errorThrown = _a.errorThrown, error = _a.error;
      context = null;
      if (errorThrown) {
        throw error;
      }
    }
  } else {
    cb();
  }
}
function captureError(err) {
  if (config.useDeprecatedSynchronousErrorHandling && context) {
    context.errorThrown = true;
    context.error = err;
  }
}
var context = null;

// node_modules/rxjs/dist/esm5/internal/Subscriber.js
var bind = function(fn, thisArg) {
  return _bind.call(fn, thisArg);
};
var handleUnhandledError = function(error) {
  if (config.useDeprecatedSynchronousErrorHandling) {
    captureError(error);
  } else {
    reportUnhandledError(error);
  }
};
var defaultErrorHandler = function(err) {
  throw err;
};
var handleStoppedNotification = function(notification, subscriber) {
  var onStoppedNotification = config.onStoppedNotification;
  onStoppedNotification && timeoutProvider.setTimeout(function() {
    return onStoppedNotification(notification, subscriber);
  });
};
var Subscriber = function(_super) {
  __extends(Subscriber2, _super);
  function Subscriber2(destination) {
    var _this = _super.call(this) || this;
    _this.isStopped = false;
    if (destination) {
      _this.destination = destination;
      if (isSubscription(destination)) {
        destination.add(_this);
      }
    } else {
      _this.destination = EMPTY_OBSERVER;
    }
    return _this;
  }
  Subscriber2.create = function(next, error, complete) {
    return new SafeSubscriber(next, error, complete);
  };
  Subscriber2.prototype.next = function(value) {
    if (this.isStopped) {
      handleStoppedNotification(nextNotification(value), this);
    } else {
      this._next(value);
    }
  };
  Subscriber2.prototype.error = function(err) {
    if (this.isStopped) {
      handleStoppedNotification(errorNotification(err), this);
    } else {
      this.isStopped = true;
      this._error(err);
    }
  };
  Subscriber2.prototype.complete = function() {
    if (this.isStopped) {
      handleStoppedNotification(COMPLETE_NOTIFICATION, this);
    } else {
      this.isStopped = true;
      this._complete();
    }
  };
  Subscriber2.prototype.unsubscribe = function() {
    if (!this.closed) {
      this.isStopped = true;
      _super.prototype.unsubscribe.call(this);
      this.destination = null;
    }
  };
  Subscriber2.prototype._next = function(value) {
    this.destination.next(value);
  };
  Subscriber2.prototype._error = function(err) {
    try {
      this.destination.error(err);
    } finally {
      this.unsubscribe();
    }
  };
  Subscriber2.prototype._complete = function() {
    try {
      this.destination.complete();
    } finally {
      this.unsubscribe();
    }
  };
  return Subscriber2;
}(Subscription);
var _bind = Function.prototype.bind;
var ConsumerObserver = function() {
  function ConsumerObserver2(partialObserver) {
    this.partialObserver = partialObserver;
  }
  ConsumerObserver2.prototype.next = function(value) {
    var partialObserver = this.partialObserver;
    if (partialObserver.next) {
      try {
        partialObserver.next(value);
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  };
  ConsumerObserver2.prototype.error = function(err) {
    var partialObserver = this.partialObserver;
    if (partialObserver.error) {
      try {
        partialObserver.error(err);
      } catch (error) {
        handleUnhandledError(error);
      }
    } else {
      handleUnhandledError(err);
    }
  };
  ConsumerObserver2.prototype.complete = function() {
    var partialObserver = this.partialObserver;
    if (partialObserver.complete) {
      try {
        partialObserver.complete();
      } catch (error) {
        handleUnhandledError(error);
      }
    }
  };
  return ConsumerObserver2;
}();
var SafeSubscriber = function(_super) {
  __extends(SafeSubscriber2, _super);
  function SafeSubscriber2(observerOrNext, error, complete) {
    var _this = _super.call(this) || this;
    var partialObserver;
    if (isFunction(observerOrNext) || !observerOrNext) {
      partialObserver = {
        next: observerOrNext !== null && observerOrNext !== undefined ? observerOrNext : undefined,
        error: error !== null && error !== undefined ? error : undefined,
        complete: complete !== null && complete !== undefined ? complete : undefined
      };
    } else {
      var context_1;
      if (_this && config.useDeprecatedNextContext) {
        context_1 = Object.create(observerOrNext);
        context_1.unsubscribe = function() {
          return _this.unsubscribe();
        };
        partialObserver = {
          next: observerOrNext.next && bind(observerOrNext.next, context_1),
          error: observerOrNext.error && bind(observerOrNext.error, context_1),
          complete: observerOrNext.complete && bind(observerOrNext.complete, context_1)
        };
      } else {
        partialObserver = observerOrNext;
      }
    }
    _this.destination = new ConsumerObserver(partialObserver);
    return _this;
  }
  return SafeSubscriber2;
}(Subscriber);
var EMPTY_OBSERVER = {
  closed: true,
  next: noop,
  error: defaultErrorHandler,
  complete: noop
};

// node_modules/rxjs/dist/esm5/internal/symbol/observable.js
var observable = function() {
  return typeof Symbol === "function" && Symbol.observable || "@@observable";
}();

// node_modules/rxjs/dist/esm5/internal/util/identity.js
function identity(x) {
  return x;
}

// node_modules/rxjs/dist/esm5/internal/util/pipe.js
function pipeFromArray(fns) {
  if (fns.length === 0) {
    return identity;
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return function piped(input) {
    return fns.reduce(function(prev, fn) {
      return fn(prev);
    }, input);
  };
}

// node_modules/rxjs/dist/esm5/internal/Observable.js
var getPromiseCtor = function(promiseCtor) {
  var _a;
  return (_a = promiseCtor !== null && promiseCtor !== undefined ? promiseCtor : config.Promise) !== null && _a !== undefined ? _a : Promise;
};
var isObserver = function(value) {
  return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
};
var isSubscriber = function(value) {
  return value && value instanceof Subscriber || isObserver(value) && isSubscription(value);
};
var Observable = function() {
  function Observable2(subscribe) {
    if (subscribe) {
      this._subscribe = subscribe;
    }
  }
  Observable2.prototype.lift = function(operator) {
    var observable3 = new Observable2;
    observable3.source = this;
    observable3.operator = operator;
    return observable3;
  };
  Observable2.prototype.subscribe = function(observerOrNext, error, complete) {
    var _this = this;
    var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
    errorContext(function() {
      var _a = _this, operator = _a.operator, source = _a.source;
      subscriber.add(operator ? operator.call(subscriber, source) : source ? _this._subscribe(subscriber) : _this._trySubscribe(subscriber));
    });
    return subscriber;
  };
  Observable2.prototype._trySubscribe = function(sink) {
    try {
      return this._subscribe(sink);
    } catch (err) {
      sink.error(err);
    }
  };
  Observable2.prototype.forEach = function(next, promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function(resolve, reject) {
      var subscriber = new SafeSubscriber({
        next: function(value) {
          try {
            next(value);
          } catch (err) {
            reject(err);
            subscriber.unsubscribe();
          }
        },
        error: reject,
        complete: resolve
      });
      _this.subscribe(subscriber);
    });
  };
  Observable2.prototype._subscribe = function(subscriber) {
    var _a;
    return (_a = this.source) === null || _a === undefined ? undefined : _a.subscribe(subscriber);
  };
  Observable2.prototype[observable] = function() {
    return this;
  };
  Observable2.prototype.pipe = function() {
    var operations = [];
    for (var _i = 0;_i < arguments.length; _i++) {
      operations[_i] = arguments[_i];
    }
    return pipeFromArray(operations)(this);
  };
  Observable2.prototype.toPromise = function(promiseCtor) {
    var _this = this;
    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function(resolve, reject) {
      var value;
      _this.subscribe(function(x) {
        return value = x;
      }, function(err) {
        return reject(err);
      }, function() {
        return resolve(value);
      });
    });
  };
  Observable2.create = function(subscribe) {
    return new Observable2(subscribe);
  };
  return Observable2;
}();
// node_modules/rxjs/dist/esm5/internal/util/lift.js
function hasLift(source) {
  return isFunction(source === null || source === undefined ? undefined : source.lift);
}
function operate(init) {
  return function(source) {
    if (hasLift(source)) {
      return source.lift(function(liftedSource) {
        try {
          return init(liftedSource, this);
        } catch (err) {
          this.error(err);
        }
      });
    }
    throw new TypeError("Unable to lift unknown Observable type");
  };
}

// node_modules/rxjs/dist/esm5/internal/operators/OperatorSubscriber.js
function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
  return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
}
var OperatorSubscriber = function(_super) {
  __extends(OperatorSubscriber2, _super);
  function OperatorSubscriber2(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
    var _this = _super.call(this, destination) || this;
    _this.onFinalize = onFinalize;
    _this.shouldUnsubscribe = shouldUnsubscribe;
    _this._next = onNext ? function(value) {
      try {
        onNext(value);
      } catch (err) {
        destination.error(err);
      }
    } : _super.prototype._next;
    _this._error = onError ? function(err) {
      try {
        onError(err);
      } catch (err2) {
        destination.error(err2);
      } finally {
        this.unsubscribe();
      }
    } : _super.prototype._error;
    _this._complete = onComplete ? function() {
      try {
        onComplete();
      } catch (err) {
        destination.error(err);
      } finally {
        this.unsubscribe();
      }
    } : _super.prototype._complete;
    return _this;
  }
  OperatorSubscriber2.prototype.unsubscribe = function() {
    var _a;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      var closed_1 = this.closed;
      _super.prototype.unsubscribe.call(this);
      !closed_1 && ((_a = this.onFinalize) === null || _a === undefined || _a.call(this));
    }
  };
  return OperatorSubscriber2;
}(Subscriber);

// node_modules/rxjs/dist/esm5/internal/util/ObjectUnsubscribedError.js
var ObjectUnsubscribedError = createErrorClass(function(_super) {
  return function ObjectUnsubscribedErrorImpl() {
    _super(this);
    this.name = "ObjectUnsubscribedError";
    this.message = "object unsubscribed";
  };
});

// node_modules/rxjs/dist/esm5/internal/Subject.js
var Subject = function(_super) {
  __extends(Subject2, _super);
  function Subject2() {
    var _this = _super.call(this) || this;
    _this.closed = false;
    _this.currentObservers = null;
    _this.observers = [];
    _this.isStopped = false;
    _this.hasError = false;
    _this.thrownError = null;
    return _this;
  }
  Subject2.prototype.lift = function(operator) {
    var subject = new AnonymousSubject(this, this);
    subject.operator = operator;
    return subject;
  };
  Subject2.prototype._throwIfClosed = function() {
    if (this.closed) {
      throw new ObjectUnsubscribedError;
    }
  };
  Subject2.prototype.next = function(value) {
    var _this = this;
    errorContext(function() {
      var e_1, _a;
      _this._throwIfClosed();
      if (!_this.isStopped) {
        if (!_this.currentObservers) {
          _this.currentObservers = Array.from(_this.observers);
        }
        try {
          for (var _b = __values(_this.currentObservers), _c = _b.next();!_c.done; _c = _b.next()) {
            var observer = _c.value;
            observer.next(value);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return))
              _a.call(_b);
          } finally {
            if (e_1)
              throw e_1.error;
          }
        }
      }
    });
  };
  Subject2.prototype.error = function(err) {
    var _this = this;
    errorContext(function() {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.hasError = _this.isStopped = true;
        _this.thrownError = err;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().error(err);
        }
      }
    });
  };
  Subject2.prototype.complete = function() {
    var _this = this;
    errorContext(function() {
      _this._throwIfClosed();
      if (!_this.isStopped) {
        _this.isStopped = true;
        var observers = _this.observers;
        while (observers.length) {
          observers.shift().complete();
        }
      }
    });
  };
  Subject2.prototype.unsubscribe = function() {
    this.isStopped = this.closed = true;
    this.observers = this.currentObservers = null;
  };
  Object.defineProperty(Subject2.prototype, "observed", {
    get: function() {
      var _a;
      return ((_a = this.observers) === null || _a === undefined ? undefined : _a.length) > 0;
    },
    enumerable: false,
    configurable: true
  });
  Subject2.prototype._trySubscribe = function(subscriber) {
    this._throwIfClosed();
    return _super.prototype._trySubscribe.call(this, subscriber);
  };
  Subject2.prototype._subscribe = function(subscriber) {
    this._throwIfClosed();
    this._checkFinalizedStatuses(subscriber);
    return this._innerSubscribe(subscriber);
  };
  Subject2.prototype._innerSubscribe = function(subscriber) {
    var _this = this;
    var _a = this, hasError = _a.hasError, isStopped = _a.isStopped, observers = _a.observers;
    if (hasError || isStopped) {
      return EMPTY_SUBSCRIPTION;
    }
    this.currentObservers = null;
    observers.push(subscriber);
    return new Subscription(function() {
      _this.currentObservers = null;
      arrRemove(observers, subscriber);
    });
  };
  Subject2.prototype._checkFinalizedStatuses = function(subscriber) {
    var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, isStopped = _a.isStopped;
    if (hasError) {
      subscriber.error(thrownError);
    } else if (isStopped) {
      subscriber.complete();
    }
  };
  Subject2.prototype.asObservable = function() {
    var observable3 = new Observable;
    observable3.source = this;
    return observable3;
  };
  Subject2.create = function(destination, source) {
    return new AnonymousSubject(destination, source);
  };
  return Subject2;
}(Observable);
var AnonymousSubject = function(_super) {
  __extends(AnonymousSubject2, _super);
  function AnonymousSubject2(destination, source) {
    var _this = _super.call(this) || this;
    _this.destination = destination;
    _this.source = source;
    return _this;
  }
  AnonymousSubject2.prototype.next = function(value) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === undefined ? undefined : _a.next) === null || _b === undefined || _b.call(_a, value);
  };
  AnonymousSubject2.prototype.error = function(err) {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === undefined ? undefined : _a.error) === null || _b === undefined || _b.call(_a, err);
  };
  AnonymousSubject2.prototype.complete = function() {
    var _a, _b;
    (_b = (_a = this.destination) === null || _a === undefined ? undefined : _a.complete) === null || _b === undefined || _b.call(_a);
  };
  AnonymousSubject2.prototype._subscribe = function(subscriber) {
    var _a, _b;
    return (_b = (_a = this.source) === null || _a === undefined ? undefined : _a.subscribe(subscriber)) !== null && _b !== undefined ? _b : EMPTY_SUBSCRIPTION;
  };
  return AnonymousSubject2;
}(Subject);
// node_modules/rxjs/dist/esm5/internal/BehaviorSubject.js
var BehaviorSubject = function(_super) {
  __extends(BehaviorSubject2, _super);
  function BehaviorSubject2(_value) {
    var _this = _super.call(this) || this;
    _this._value = _value;
    return _this;
  }
  Object.defineProperty(BehaviorSubject2.prototype, "value", {
    get: function() {
      return this.getValue();
    },
    enumerable: false,
    configurable: true
  });
  BehaviorSubject2.prototype._subscribe = function(subscriber) {
    var subscription = _super.prototype._subscribe.call(this, subscriber);
    !subscription.closed && subscriber.next(this._value);
    return subscription;
  };
  BehaviorSubject2.prototype.getValue = function() {
    var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, _value = _a._value;
    if (hasError) {
      throw thrownError;
    }
    this._throwIfClosed();
    return _value;
  };
  BehaviorSubject2.prototype.next = function(value) {
    _super.prototype.next.call(this, this._value = value);
  };
  return BehaviorSubject2;
}(Subject);
// node_modules/rxjs/dist/esm5/internal/observable/empty.js
var EMPTY = new Observable(function(subscriber) {
  return subscriber.complete();
});

// node_modules/rxjs/dist/esm5/internal/util/isArrayLike.js
var isArrayLike = function(x) {
  return x && typeof x.length === "number" && typeof x !== "function";
};

// node_modules/rxjs/dist/esm5/internal/util/isPromise.js
function isPromise(value) {
  return isFunction(value === null || value === undefined ? undefined : value.then);
}

// node_modules/rxjs/dist/esm5/internal/util/isInteropObservable.js
function isInteropObservable(input) {
  return isFunction(input[observable]);
}

// node_modules/rxjs/dist/esm5/internal/util/isAsyncIterable.js
function isAsyncIterable(obj) {
  return Symbol.asyncIterator && isFunction(obj === null || obj === undefined ? undefined : obj[Symbol.asyncIterator]);
}

// node_modules/rxjs/dist/esm5/internal/util/throwUnobservableError.js
function createInvalidObservableTypeError(input) {
  return new TypeError("You provided " + (input !== null && typeof input === "object" ? "an invalid object" : "'" + input + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
}

// node_modules/rxjs/dist/esm5/internal/symbol/iterator.js
function getSymbolIterator() {
  if (typeof Symbol !== "function" || !Symbol.iterator) {
    return "@@iterator";
  }
  return Symbol.iterator;
}
var iterator = getSymbolIterator();

// node_modules/rxjs/dist/esm5/internal/util/isIterable.js
function isIterable(input) {
  return isFunction(input === null || input === undefined ? undefined : input[iterator]);
}

// node_modules/rxjs/dist/esm5/internal/util/isReadableStreamLike.js
function readableStreamLikeToAsyncGenerator(readableStream) {
  return __asyncGenerator(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
    var reader, _a, value, done;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          reader = readableStream.getReader();
          _b.label = 1;
        case 1:
          _b.trys.push([1, , 9, 10]);
          _b.label = 2;
        case 2:
          if (false)
            ;
          return [4, __await(reader.read())];
        case 3:
          _a = _b.sent(), value = _a.value, done = _a.done;
          if (!done)
            return [3, 5];
          return [4, __await(undefined)];
        case 4:
          return [2, _b.sent()];
        case 5:
          return [4, __await(value)];
        case 6:
          return [4, _b.sent()];
        case 7:
          _b.sent();
          return [3, 2];
        case 8:
          return [3, 10];
        case 9:
          reader.releaseLock();
          return [7];
        case 10:
          return [2];
      }
    });
  });
}
function isReadableStreamLike(obj) {
  return isFunction(obj === null || obj === undefined ? undefined : obj.getReader);
}

// node_modules/rxjs/dist/esm5/internal/observable/innerFrom.js
function innerFrom(input) {
  if (input instanceof Observable) {
    return input;
  }
  if (input != null) {
    if (isInteropObservable(input)) {
      return fromInteropObservable(input);
    }
    if (isArrayLike(input)) {
      return fromArrayLike(input);
    }
    if (isPromise(input)) {
      return fromPromise(input);
    }
    if (isAsyncIterable(input)) {
      return fromAsyncIterable(input);
    }
    if (isIterable(input)) {
      return fromIterable(input);
    }
    if (isReadableStreamLike(input)) {
      return fromReadableStreamLike(input);
    }
  }
  throw createInvalidObservableTypeError(input);
}
function fromInteropObservable(obj) {
  return new Observable(function(subscriber) {
    var obs = obj[observable]();
    if (isFunction(obs.subscribe)) {
      return obs.subscribe(subscriber);
    }
    throw new TypeError("Provided object does not correctly implement Symbol.observable");
  });
}
function fromArrayLike(array) {
  return new Observable(function(subscriber) {
    for (var i = 0;i < array.length && !subscriber.closed; i++) {
      subscriber.next(array[i]);
    }
    subscriber.complete();
  });
}
function fromPromise(promise) {
  return new Observable(function(subscriber) {
    promise.then(function(value) {
      if (!subscriber.closed) {
        subscriber.next(value);
        subscriber.complete();
      }
    }, function(err) {
      return subscriber.error(err);
    }).then(null, reportUnhandledError);
  });
}
function fromIterable(iterable) {
  return new Observable(function(subscriber) {
    var e_1, _a;
    try {
      for (var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next();!iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
        var value = iterable_1_1.value;
        subscriber.next(value);
        if (subscriber.closed) {
          return;
        }
      }
    } catch (e_1_1) {
      e_1 = { error: e_1_1 };
    } finally {
      try {
        if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return))
          _a.call(iterable_1);
      } finally {
        if (e_1)
          throw e_1.error;
      }
    }
    subscriber.complete();
  });
}
function fromAsyncIterable(asyncIterable) {
  return new Observable(function(subscriber) {
    process(asyncIterable, subscriber).catch(function(err) {
      return subscriber.error(err);
    });
  });
}
function fromReadableStreamLike(readableStream) {
  return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
}
var process = function(asyncIterable, subscriber) {
  var asyncIterable_1, asyncIterable_1_1;
  var e_2, _a;
  return __awaiter(this, undefined, undefined, function() {
    var value, e_2_1;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 5, 6, 11]);
          asyncIterable_1 = __asyncValues(asyncIterable);
          _b.label = 1;
        case 1:
          return [4, asyncIterable_1.next()];
        case 2:
          if (!(asyncIterable_1_1 = _b.sent(), !asyncIterable_1_1.done))
            return [3, 4];
          value = asyncIterable_1_1.value;
          subscriber.next(value);
          if (subscriber.closed) {
            return [2];
          }
          _b.label = 3;
        case 3:
          return [3, 1];
        case 4:
          return [3, 11];
        case 5:
          e_2_1 = _b.sent();
          e_2 = { error: e_2_1 };
          return [3, 11];
        case 6:
          _b.trys.push([6, , 9, 10]);
          if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return)))
            return [3, 8];
          return [4, _a.call(asyncIterable_1)];
        case 7:
          _b.sent();
          _b.label = 8;
        case 8:
          return [3, 10];
        case 9:
          if (e_2)
            throw e_2.error;
          return [7];
        case 10:
          return [7];
        case 11:
          subscriber.complete();
          return [2];
      }
    });
  });
};

// node_modules/rxjs/dist/esm5/internal/util/EmptyError.js
var EmptyError = createErrorClass(function(_super) {
  return function EmptyErrorImpl() {
    _super(this);
    this.name = "EmptyError";
    this.message = "no elements in sequence";
  };
});

// node_modules/rxjs/dist/esm5/internal/firstValueFrom.js
function firstValueFrom(source, config6) {
  var hasConfig = typeof config6 === "object";
  return new Promise(function(resolve, reject) {
    var subscriber = new SafeSubscriber({
      next: function(value) {
        resolve(value);
        subscriber.unsubscribe();
      },
      error: reject,
      complete: function() {
        if (hasConfig) {
          resolve(config6.defaultValue);
        } else {
          reject(new EmptyError);
        }
      }
    });
    source.subscribe(subscriber);
  });
}
// node_modules/rxjs/dist/esm5/internal/operators/filter.js
function filter(predicate, thisArg) {
  return operate(function(source, subscriber) {
    var index = 0;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      return predicate.call(thisArg, value, index++) && subscriber.next(value);
    }));
  });
}
// node_modules/rxjs/dist/esm5/internal/operators/defaultIfEmpty.js
function defaultIfEmpty(defaultValue) {
  return operate(function(source, subscriber) {
    var hasValue = false;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      hasValue = true;
      subscriber.next(value);
    }, function() {
      if (!hasValue) {
        subscriber.next(defaultValue);
      }
      subscriber.complete();
    }));
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/take.js
function take(count) {
  return count <= 0 ? function() {
    return EMPTY;
  } : operate(function(source, subscriber) {
    var seen = 0;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      if (++seen <= count) {
        subscriber.next(value);
        if (count <= seen) {
          subscriber.complete();
        }
      }
    }));
  });
}

// node_modules/rxjs/dist/esm5/internal/operators/throwIfEmpty.js
function throwIfEmpty(errorFactory) {
  if (errorFactory === undefined) {
    errorFactory = defaultErrorFactory;
  }
  return operate(function(source, subscriber) {
    var hasValue = false;
    source.subscribe(createOperatorSubscriber(subscriber, function(value) {
      hasValue = true;
      subscriber.next(value);
    }, function() {
      return hasValue ? subscriber.complete() : subscriber.error(errorFactory());
    }));
  });
}
var defaultErrorFactory = function() {
  return new EmptyError;
};
// node_modules/rxjs/dist/esm5/internal/operators/first.js
function first(predicate, defaultValue) {
  var hasDefaultValue = arguments.length >= 2;
  return function(source) {
    return source.pipe(predicate ? filter(function(v, i) {
      return predicate(v, i, source);
    }) : identity, take(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(function() {
      return new EmptyError;
    }));
  };
}
// node_modules/rxjs/dist/esm5/internal/operators/share.js
function share(options) {
  if (options === undefined) {
    options = {};
  }
  var _a = options.connector, connector = _a === undefined ? function() {
    return new Subject;
  } : _a, _b = options.resetOnError, resetOnError = _b === undefined ? true : _b, _c = options.resetOnComplete, resetOnComplete = _c === undefined ? true : _c, _d = options.resetOnRefCountZero, resetOnRefCountZero = _d === undefined ? true : _d;
  return function(wrapperSource) {
    var connection;
    var resetConnection;
    var subject;
    var refCount = 0;
    var hasCompleted = false;
    var hasErrored = false;
    var cancelReset = function() {
      resetConnection === null || resetConnection === undefined || resetConnection.unsubscribe();
      resetConnection = undefined;
    };
    var reset = function() {
      cancelReset();
      connection = subject = undefined;
      hasCompleted = hasErrored = false;
    };
    var resetAndUnsubscribe = function() {
      var conn = connection;
      reset();
      conn === null || conn === undefined || conn.unsubscribe();
    };
    return operate(function(source, subscriber) {
      refCount++;
      if (!hasErrored && !hasCompleted) {
        cancelReset();
      }
      var dest = subject = subject !== null && subject !== undefined ? subject : connector();
      subscriber.add(function() {
        refCount--;
        if (refCount === 0 && !hasErrored && !hasCompleted) {
          resetConnection = handleReset(resetAndUnsubscribe, resetOnRefCountZero);
        }
      });
      dest.subscribe(subscriber);
      if (!connection && refCount > 0) {
        connection = new SafeSubscriber({
          next: function(value) {
            return dest.next(value);
          },
          error: function(err) {
            hasErrored = true;
            cancelReset();
            resetConnection = handleReset(reset, resetOnError, err);
            dest.error(err);
          },
          complete: function() {
            hasCompleted = true;
            cancelReset();
            resetConnection = handleReset(reset, resetOnComplete);
            dest.complete();
          }
        });
        innerFrom(source).subscribe(connection);
      }
    })(wrapperSource);
  };
}
var handleReset = function(reset, on) {
  var args = [];
  for (var _i = 2;_i < arguments.length; _i++) {
    args[_i - 2] = arguments[_i];
  }
  if (on === true) {
    reset();
    return;
  }
  if (on === false) {
    return;
  }
  var onSubscriber = new SafeSubscriber({
    next: function() {
      onSubscriber.unsubscribe();
      reset();
    }
  });
  return innerFrom(on.apply(undefined, __spreadArray([], __read(args)))).subscribe(onSubscriber);
};
// node_modules/@stomp/stompjs/esm6/byte.js
var BYTE = {
  LF: `
`,
  NULL: "\0"
};

// node_modules/@stomp/stompjs/esm6/frame-impl.js
class FrameImpl {
  constructor(params) {
    const { command, headers, body, binaryBody, escapeHeaderValues, skipContentLengthHeader } = params;
    this.command = command;
    this.headers = Object.assign({}, headers || {});
    if (binaryBody) {
      this._binaryBody = binaryBody;
      this.isBinaryBody = true;
    } else {
      this._body = body || "";
      this.isBinaryBody = false;
    }
    this.escapeHeaderValues = escapeHeaderValues || false;
    this.skipContentLengthHeader = skipContentLengthHeader || false;
  }
  get body() {
    if (!this._body && this.isBinaryBody) {
      this._body = new TextDecoder().decode(this._binaryBody);
    }
    return this._body || "";
  }
  get binaryBody() {
    if (!this._binaryBody && !this.isBinaryBody) {
      this._binaryBody = new TextEncoder().encode(this._body);
    }
    return this._binaryBody;
  }
  static fromRawFrame(rawFrame, escapeHeaderValues) {
    const headers = {};
    const trim = (str) => str.replace(/^\s+|\s+$/g, "");
    for (const header of rawFrame.headers.reverse()) {
      const idx = header.indexOf(":");
      const key = trim(header[0]);
      let value = trim(header[1]);
      if (escapeHeaderValues && rawFrame.command !== "CONNECT" && rawFrame.command !== "CONNECTED") {
        value = FrameImpl.hdrValueUnEscape(value);
      }
      headers[key] = value;
    }
    return new FrameImpl({
      command: rawFrame.command,
      headers,
      binaryBody: rawFrame.binaryBody,
      escapeHeaderValues
    });
  }
  toString() {
    return this.serializeCmdAndHeaders();
  }
  serialize() {
    const cmdAndHeaders = this.serializeCmdAndHeaders();
    if (this.isBinaryBody) {
      return FrameImpl.toUnit8Array(cmdAndHeaders, this._binaryBody).buffer;
    } else {
      return cmdAndHeaders + this._body + BYTE.NULL;
    }
  }
  serializeCmdAndHeaders() {
    const lines = [this.command];
    if (this.skipContentLengthHeader) {
      delete this.headers["content-length"];
    }
    for (const name of Object.keys(this.headers || {})) {
      const value = this.headers[name];
      if (this.escapeHeaderValues && this.command !== "CONNECT" && this.command !== "CONNECTED") {
        lines.push(`${name}:${FrameImpl.hdrValueEscape(`${value}`)}`);
      } else {
        lines.push(`${name}:${value}`);
      }
    }
    if (this.isBinaryBody || !this.isBodyEmpty() && !this.skipContentLengthHeader) {
      lines.push(`content-length:${this.bodyLength()}`);
    }
    return lines.join(BYTE.LF) + BYTE.LF + BYTE.LF;
  }
  isBodyEmpty() {
    return this.bodyLength() === 0;
  }
  bodyLength() {
    const binaryBody = this.binaryBody;
    return binaryBody ? binaryBody.length : 0;
  }
  static sizeOfUTF8(s) {
    return s ? new TextEncoder().encode(s).length : 0;
  }
  static toUnit8Array(cmdAndHeaders, binaryBody) {
    const uint8CmdAndHeaders = new TextEncoder().encode(cmdAndHeaders);
    const nullTerminator = new Uint8Array([0]);
    const uint8Frame = new Uint8Array(uint8CmdAndHeaders.length + binaryBody.length + nullTerminator.length);
    uint8Frame.set(uint8CmdAndHeaders);
    uint8Frame.set(binaryBody, uint8CmdAndHeaders.length);
    uint8Frame.set(nullTerminator, uint8CmdAndHeaders.length + binaryBody.length);
    return uint8Frame;
  }
  static marshall(params) {
    const frame = new FrameImpl(params);
    return frame.serialize();
  }
  static hdrValueEscape(str) {
    return str.replace(/\\/g, "\\\\").replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/:/g, "\\c");
  }
  static hdrValueUnEscape(str) {
    return str.replace(/\\r/g, "\r").replace(/\\n/g, "\n").replace(/\\c/g, ":").replace(/\\\\/g, "\\");
  }
}

// node_modules/@stomp/stompjs/esm6/parser.js
var NULL = 0;
var LF = 10;
var CR = 13;
var COLON = 58;

class Parser {
  constructor(onFrame, onIncomingPing) {
    this.onFrame = onFrame;
    this.onIncomingPing = onIncomingPing;
    this._encoder = new TextEncoder;
    this._decoder = new TextDecoder;
    this._token = [];
    this._initState();
  }
  parseChunk(segment, appendMissingNULLonIncoming = false) {
    let chunk;
    if (typeof segment === "string") {
      chunk = this._encoder.encode(segment);
    } else {
      chunk = new Uint8Array(segment);
    }
    if (appendMissingNULLonIncoming && chunk[chunk.length - 1] !== 0) {
      const chunkWithNull = new Uint8Array(chunk.length + 1);
      chunkWithNull.set(chunk, 0);
      chunkWithNull[chunk.length] = 0;
      chunk = chunkWithNull;
    }
    for (let i = 0;i < chunk.length; i++) {
      const byte2 = chunk[i];
      this._onByte(byte2);
    }
  }
  _collectFrame(byte2) {
    if (byte2 === NULL) {
      return;
    }
    if (byte2 === CR) {
      return;
    }
    if (byte2 === LF) {
      this.onIncomingPing();
      return;
    }
    this._onByte = this._collectCommand;
    this._reinjectByte(byte2);
  }
  _collectCommand(byte2) {
    if (byte2 === CR) {
      return;
    }
    if (byte2 === LF) {
      this._results.command = this._consumeTokenAsUTF8();
      this._onByte = this._collectHeaders;
      return;
    }
    this._consumeByte(byte2);
  }
  _collectHeaders(byte2) {
    if (byte2 === CR) {
      return;
    }
    if (byte2 === LF) {
      this._setupCollectBody();
      return;
    }
    this._onByte = this._collectHeaderKey;
    this._reinjectByte(byte2);
  }
  _reinjectByte(byte2) {
    this._onByte(byte2);
  }
  _collectHeaderKey(byte2) {
    if (byte2 === COLON) {
      this._headerKey = this._consumeTokenAsUTF8();
      this._onByte = this._collectHeaderValue;
      return;
    }
    this._consumeByte(byte2);
  }
  _collectHeaderValue(byte2) {
    if (byte2 === CR) {
      return;
    }
    if (byte2 === LF) {
      this._results.headers.push([
        this._headerKey,
        this._consumeTokenAsUTF8()
      ]);
      this._headerKey = undefined;
      this._onByte = this._collectHeaders;
      return;
    }
    this._consumeByte(byte2);
  }
  _setupCollectBody() {
    const contentLengthHeader = this._results.headers.filter((header) => {
      return header[0] === "content-length";
    })[0];
    if (contentLengthHeader) {
      this._bodyBytesRemaining = parseInt(contentLengthHeader[1], 10);
      this._onByte = this._collectBodyFixedSize;
    } else {
      this._onByte = this._collectBodyNullTerminated;
    }
  }
  _collectBodyNullTerminated(byte2) {
    if (byte2 === NULL) {
      this._retrievedBody();
      return;
    }
    this._consumeByte(byte2);
  }
  _collectBodyFixedSize(byte2) {
    if (this._bodyBytesRemaining-- === 0) {
      this._retrievedBody();
      return;
    }
    this._consumeByte(byte2);
  }
  _retrievedBody() {
    this._results.binaryBody = this._consumeTokenAsRaw();
    try {
      this.onFrame(this._results);
    } catch (e) {
      console.log(`Ignoring an exception thrown by a frame handler. Original exception: `, e);
    }
    this._initState();
  }
  _consumeByte(byte2) {
    this._token.push(byte2);
  }
  _consumeTokenAsUTF8() {
    return this._decoder.decode(this._consumeTokenAsRaw());
  }
  _consumeTokenAsRaw() {
    const rawResult = new Uint8Array(this._token);
    this._token = [];
    return rawResult;
  }
  _initState() {
    this._results = {
      command: undefined,
      headers: [],
      binaryBody: undefined
    };
    this._token = [];
    this._headerKey = undefined;
    this._onByte = this._collectFrame;
  }
}

// node_modules/@stomp/stompjs/esm6/types.js
var StompSocketState;
(function(StompSocketState2) {
  StompSocketState2[StompSocketState2["CONNECTING"] = 0] = "CONNECTING";
  StompSocketState2[StompSocketState2["OPEN"] = 1] = "OPEN";
  StompSocketState2[StompSocketState2["CLOSING"] = 2] = "CLOSING";
  StompSocketState2[StompSocketState2["CLOSED"] = 3] = "CLOSED";
})(StompSocketState = StompSocketState || (StompSocketState = {}));
var ActivationState;
(function(ActivationState2) {
  ActivationState2[ActivationState2["ACTIVE"] = 0] = "ACTIVE";
  ActivationState2[ActivationState2["DEACTIVATING"] = 1] = "DEACTIVATING";
  ActivationState2[ActivationState2["INACTIVE"] = 2] = "INACTIVE";
})(ActivationState = ActivationState || (ActivationState = {}));

// node_modules/@stomp/stompjs/esm6/versions.js
class Versions {
  constructor(versions) {
    this.versions = versions;
  }
  supportedVersions() {
    return this.versions.join(",");
  }
  protocolVersions() {
    return this.versions.map((x) => `v${x.replace(".", "")}.stomp`);
  }
}
Versions.V1_0 = "1.0";
Versions.V1_1 = "1.1";
Versions.V1_2 = "1.2";
Versions.default = new Versions([
  Versions.V1_2,
  Versions.V1_1,
  Versions.V1_0
]);

// node_modules/@stomp/stompjs/esm6/augment-websocket.js
function augmentWebsocket(webSocket, debug) {
  webSocket.terminate = function() {
    const noOp = () => {
    };
    this.onerror = noOp;
    this.onmessage = noOp;
    this.onopen = noOp;
    const ts = new Date;
    const id = Math.random().toString().substring(2, 8);
    const origOnClose = this.onclose;
    this.onclose = (closeEvent) => {
      const delay = new Date().getTime() - ts.getTime();
      debug(`Discarded socket (#${id})  closed after ${delay}ms, with code/reason: ${closeEvent.code}/${closeEvent.reason}`);
    };
    this.close();
    origOnClose?.call(webSocket, {
      code: 4001,
      reason: `Quick discarding socket (#${id}) without waiting for the shutdown sequence.`,
      wasClean: false
    });
  };
}

// node_modules/@stomp/stompjs/esm6/stomp-handler.js
class StompHandler {
  constructor(_client, _webSocket, config6) {
    this._client = _client;
    this._webSocket = _webSocket;
    this._connected = false;
    this._serverFrameHandlers = {
      CONNECTED: (frame) => {
        this.debug(`connected to server ${frame.headers.server}`);
        this._connected = true;
        this._connectedVersion = frame.headers.version;
        if (this._connectedVersion === Versions.V1_2) {
          this._escapeHeaderValues = true;
        }
        this._setupHeartbeat(frame.headers);
        this.onConnect(frame);
      },
      MESSAGE: (frame) => {
        const subscription = frame.headers.subscription;
        const onReceive = this._subscriptions[subscription] || this.onUnhandledMessage;
        const message = frame;
        const client = this;
        const messageId = this._connectedVersion === Versions.V1_2 ? message.headers.ack : message.headers["message-id"];
        message.ack = (headers = {}) => {
          return client.ack(messageId, subscription, headers);
        };
        message.nack = (headers = {}) => {
          return client.nack(messageId, subscription, headers);
        };
        onReceive(message);
      },
      RECEIPT: (frame) => {
        const callback = this._receiptWatchers[frame.headers["receipt-id"]];
        if (callback) {
          callback(frame);
          delete this._receiptWatchers[frame.headers["receipt-id"]];
        } else {
          this.onUnhandledReceipt(frame);
        }
      },
      ERROR: (frame) => {
        this.onStompError(frame);
      }
    };
    this._counter = 0;
    this._subscriptions = {};
    this._receiptWatchers = {};
    this._partialData = "";
    this._escapeHeaderValues = false;
    this._lastServerActivityTS = Date.now();
    this.debug = config6.debug;
    this.stompVersions = config6.stompVersions;
    this.connectHeaders = config6.connectHeaders;
    this.disconnectHeaders = config6.disconnectHeaders;
    this.heartbeatIncoming = config6.heartbeatIncoming;
    this.heartbeatOutgoing = config6.heartbeatOutgoing;
    this.splitLargeFrames = config6.splitLargeFrames;
    this.maxWebSocketChunkSize = config6.maxWebSocketChunkSize;
    this.forceBinaryWSFrames = config6.forceBinaryWSFrames;
    this.logRawCommunication = config6.logRawCommunication;
    this.appendMissingNULLonIncoming = config6.appendMissingNULLonIncoming;
    this.discardWebsocketOnCommFailure = config6.discardWebsocketOnCommFailure;
    this.onConnect = config6.onConnect;
    this.onDisconnect = config6.onDisconnect;
    this.onStompError = config6.onStompError;
    this.onWebSocketClose = config6.onWebSocketClose;
    this.onWebSocketError = config6.onWebSocketError;
    this.onUnhandledMessage = config6.onUnhandledMessage;
    this.onUnhandledReceipt = config6.onUnhandledReceipt;
    this.onUnhandledFrame = config6.onUnhandledFrame;
  }
  get connectedVersion() {
    return this._connectedVersion;
  }
  get connected() {
    return this._connected;
  }
  start() {
    const parser2 = new Parser((rawFrame) => {
      const frame = FrameImpl.fromRawFrame(rawFrame, this._escapeHeaderValues);
      if (!this.logRawCommunication) {
        this.debug(`<<< ${frame}`);
      }
      const serverFrameHandler = this._serverFrameHandlers[frame.command] || this.onUnhandledFrame;
      serverFrameHandler(frame);
    }, () => {
      this.debug("<<< PONG");
    });
    this._webSocket.onmessage = (evt) => {
      this.debug("Received data");
      this._lastServerActivityTS = Date.now();
      if (this.logRawCommunication) {
        const rawChunkAsString = evt.data instanceof ArrayBuffer ? new TextDecoder().decode(evt.data) : evt.data;
        this.debug(`<<< ${rawChunkAsString}`);
      }
      parser2.parseChunk(evt.data, this.appendMissingNULLonIncoming);
    };
    this._webSocket.onclose = (closeEvent) => {
      this.debug(`Connection closed to ${this._webSocket.url}`);
      this._cleanUp();
      this.onWebSocketClose(closeEvent);
    };
    this._webSocket.onerror = (errorEvent) => {
      this.onWebSocketError(errorEvent);
    };
    this._webSocket.onopen = () => {
      const connectHeaders = Object.assign({}, this.connectHeaders);
      this.debug("Web Socket Opened...");
      connectHeaders["accept-version"] = this.stompVersions.supportedVersions();
      connectHeaders["heart-beat"] = [
        this.heartbeatOutgoing,
        this.heartbeatIncoming
      ].join(",");
      this._transmit({ command: "CONNECT", headers: connectHeaders });
    };
  }
  _setupHeartbeat(headers) {
    if (headers.version !== Versions.V1_1 && headers.version !== Versions.V1_2) {
      return;
    }
    if (!headers["heart-beat"]) {
      return;
    }
    const [serverOutgoing, serverIncoming] = headers["heart-beat"].split(",").map((v) => parseInt(v, 10));
    if (this.heartbeatOutgoing !== 0 && serverIncoming !== 0) {
      const ttl = Math.max(this.heartbeatOutgoing, serverIncoming);
      this.debug(`send PING every ${ttl}ms`);
      this._pinger = setInterval(() => {
        if (this._webSocket.readyState === StompSocketState.OPEN) {
          this._webSocket.send(BYTE.LF);
          this.debug(">>> PING");
        }
      }, ttl);
    }
    if (this.heartbeatIncoming !== 0 && serverOutgoing !== 0) {
      const ttl = Math.max(this.heartbeatIncoming, serverOutgoing);
      this.debug(`check PONG every ${ttl}ms`);
      this._ponger = setInterval(() => {
        const delta = Date.now() - this._lastServerActivityTS;
        if (delta > ttl * 2) {
          this.debug(`did not receive server activity for the last ${delta}ms`);
          this._closeOrDiscardWebsocket();
        }
      }, ttl);
    }
  }
  _closeOrDiscardWebsocket() {
    if (this.discardWebsocketOnCommFailure) {
      this.debug("Discarding websocket, the underlying socket may linger for a while");
      this.discardWebsocket();
    } else {
      this.debug("Issuing close on the websocket");
      this._closeWebsocket();
    }
  }
  forceDisconnect() {
    if (this._webSocket) {
      if (this._webSocket.readyState === StompSocketState.CONNECTING || this._webSocket.readyState === StompSocketState.OPEN) {
        this._closeOrDiscardWebsocket();
      }
    }
  }
  _closeWebsocket() {
    this._webSocket.onmessage = () => {
    };
    this._webSocket.close();
  }
  discardWebsocket() {
    if (typeof this._webSocket.terminate !== "function") {
      augmentWebsocket(this._webSocket, (msg) => this.debug(msg));
    }
    this._webSocket.terminate();
  }
  _transmit(params) {
    const { command, headers, body, binaryBody, skipContentLengthHeader } = params;
    const frame = new FrameImpl({
      command,
      headers,
      body,
      binaryBody,
      escapeHeaderValues: this._escapeHeaderValues,
      skipContentLengthHeader
    });
    let rawChunk = frame.serialize();
    if (this.logRawCommunication) {
      this.debug(`>>> ${rawChunk}`);
    } else {
      this.debug(`>>> ${frame}`);
    }
    if (this.forceBinaryWSFrames && typeof rawChunk === "string") {
      rawChunk = new TextEncoder().encode(rawChunk);
    }
    if (typeof rawChunk !== "string" || !this.splitLargeFrames) {
      this._webSocket.send(rawChunk);
    } else {
      let out = rawChunk;
      while (out.length > 0) {
        const chunk = out.substring(0, this.maxWebSocketChunkSize);
        out = out.substring(this.maxWebSocketChunkSize);
        this._webSocket.send(chunk);
        this.debug(`chunk sent = ${chunk.length}, remaining = ${out.length}`);
      }
    }
  }
  dispose() {
    if (this.connected) {
      try {
        const disconnectHeaders = Object.assign({}, this.disconnectHeaders);
        if (!disconnectHeaders.receipt) {
          disconnectHeaders.receipt = `close-${this._counter++}`;
        }
        this.watchForReceipt(disconnectHeaders.receipt, (frame) => {
          this._closeWebsocket();
          this._cleanUp();
          this.onDisconnect(frame);
        });
        this._transmit({ command: "DISCONNECT", headers: disconnectHeaders });
      } catch (error) {
        this.debug(`Ignoring error during disconnect ${error}`);
      }
    } else {
      if (this._webSocket.readyState === StompSocketState.CONNECTING || this._webSocket.readyState === StompSocketState.OPEN) {
        this._closeWebsocket();
      }
    }
  }
  _cleanUp() {
    this._connected = false;
    if (this._pinger) {
      clearInterval(this._pinger);
      this._pinger = undefined;
    }
    if (this._ponger) {
      clearInterval(this._ponger);
      this._ponger = undefined;
    }
  }
  publish(params) {
    const { destination, headers, body, binaryBody, skipContentLengthHeader } = params;
    const hdrs = Object.assign({ destination }, headers);
    this._transmit({
      command: "SEND",
      headers: hdrs,
      body,
      binaryBody,
      skipContentLengthHeader
    });
  }
  watchForReceipt(receiptId, callback) {
    this._receiptWatchers[receiptId] = callback;
  }
  subscribe(destination, callback, headers = {}) {
    headers = Object.assign({}, headers);
    if (!headers.id) {
      headers.id = `sub-${this._counter++}`;
    }
    headers.destination = destination;
    this._subscriptions[headers.id] = callback;
    this._transmit({ command: "SUBSCRIBE", headers });
    const client = this;
    return {
      id: headers.id,
      unsubscribe(hdrs) {
        return client.unsubscribe(headers.id, hdrs);
      }
    };
  }
  unsubscribe(id, headers = {}) {
    headers = Object.assign({}, headers);
    delete this._subscriptions[id];
    headers.id = id;
    this._transmit({ command: "UNSUBSCRIBE", headers });
  }
  begin(transactionId) {
    const txId = transactionId || `tx-${this._counter++}`;
    this._transmit({
      command: "BEGIN",
      headers: {
        transaction: txId
      }
    });
    const client = this;
    return {
      id: txId,
      commit() {
        client.commit(txId);
      },
      abort() {
        client.abort(txId);
      }
    };
  }
  commit(transactionId) {
    this._transmit({
      command: "COMMIT",
      headers: {
        transaction: transactionId
      }
    });
  }
  abort(transactionId) {
    this._transmit({
      command: "ABORT",
      headers: {
        transaction: transactionId
      }
    });
  }
  ack(messageId, subscriptionId, headers = {}) {
    headers = Object.assign({}, headers);
    if (this._connectedVersion === Versions.V1_2) {
      headers.id = messageId;
    } else {
      headers["message-id"] = messageId;
    }
    headers.subscription = subscriptionId;
    this._transmit({ command: "ACK", headers });
  }
  nack(messageId, subscriptionId, headers = {}) {
    headers = Object.assign({}, headers);
    if (this._connectedVersion === Versions.V1_2) {
      headers.id = messageId;
    } else {
      headers["message-id"] = messageId;
    }
    headers.subscription = subscriptionId;
    return this._transmit({ command: "NACK", headers });
  }
}

// node_modules/@stomp/stompjs/esm6/client.js
class Client {
  constructor(conf = {}) {
    this.stompVersions = Versions.default;
    this.connectionTimeout = 0;
    this.reconnectDelay = 5000;
    this.heartbeatIncoming = 1e4;
    this.heartbeatOutgoing = 1e4;
    this.splitLargeFrames = false;
    this.maxWebSocketChunkSize = 8 * 1024;
    this.forceBinaryWSFrames = false;
    this.appendMissingNULLonIncoming = false;
    this.discardWebsocketOnCommFailure = false;
    this.state = ActivationState.INACTIVE;
    const noOp = () => {
    };
    this.debug = noOp;
    this.beforeConnect = noOp;
    this.onConnect = noOp;
    this.onDisconnect = noOp;
    this.onUnhandledMessage = noOp;
    this.onUnhandledReceipt = noOp;
    this.onUnhandledFrame = noOp;
    this.onStompError = noOp;
    this.onWebSocketClose = noOp;
    this.onWebSocketError = noOp;
    this.logRawCommunication = false;
    this.onChangeState = noOp;
    this.connectHeaders = {};
    this._disconnectHeaders = {};
    this.configure(conf);
  }
  get webSocket() {
    return this._stompHandler?._webSocket;
  }
  get disconnectHeaders() {
    return this._disconnectHeaders;
  }
  set disconnectHeaders(value) {
    this._disconnectHeaders = value;
    if (this._stompHandler) {
      this._stompHandler.disconnectHeaders = this._disconnectHeaders;
    }
  }
  get connected() {
    return !!this._stompHandler && this._stompHandler.connected;
  }
  get connectedVersion() {
    return this._stompHandler ? this._stompHandler.connectedVersion : undefined;
  }
  get active() {
    return this.state === ActivationState.ACTIVE;
  }
  _changeState(state) {
    this.state = state;
    this.onChangeState(state);
  }
  configure(conf) {
    Object.assign(this, conf);
  }
  activate() {
    const _activate = () => {
      if (this.active) {
        this.debug("Already ACTIVE, ignoring request to activate");
        return;
      }
      this._changeState(ActivationState.ACTIVE);
      this._connect();
    };
    if (this.state === ActivationState.DEACTIVATING) {
      this.debug("Waiting for deactivation to finish before activating");
      this.deactivate().then(() => {
        _activate();
      });
    } else {
      _activate();
    }
  }
  async _connect() {
    await this.beforeConnect();
    if (this._stompHandler) {
      this.debug("There is already a stompHandler, skipping the call to connect");
      return;
    }
    if (!this.active) {
      this.debug("Client has been marked inactive, will not attempt to connect");
      return;
    }
    if (this.connectionTimeout > 0) {
      if (this._connectionWatcher) {
        clearTimeout(this._connectionWatcher);
      }
      this._connectionWatcher = setTimeout(() => {
        if (this.connected) {
          return;
        }
        this.debug(`Connection not established in ${this.connectionTimeout}ms, closing socket`);
        this.forceDisconnect();
      }, this.connectionTimeout);
    }
    this.debug("Opening Web Socket...");
    const webSocket = this._createWebSocket();
    this._stompHandler = new StompHandler(this, webSocket, {
      debug: this.debug,
      stompVersions: this.stompVersions,
      connectHeaders: this.connectHeaders,
      disconnectHeaders: this._disconnectHeaders,
      heartbeatIncoming: this.heartbeatIncoming,
      heartbeatOutgoing: this.heartbeatOutgoing,
      splitLargeFrames: this.splitLargeFrames,
      maxWebSocketChunkSize: this.maxWebSocketChunkSize,
      forceBinaryWSFrames: this.forceBinaryWSFrames,
      logRawCommunication: this.logRawCommunication,
      appendMissingNULLonIncoming: this.appendMissingNULLonIncoming,
      discardWebsocketOnCommFailure: this.discardWebsocketOnCommFailure,
      onConnect: (frame) => {
        if (this._connectionWatcher) {
          clearTimeout(this._connectionWatcher);
          this._connectionWatcher = undefined;
        }
        if (!this.active) {
          this.debug("STOMP got connected while deactivate was issued, will disconnect now");
          this._disposeStompHandler();
          return;
        }
        this.onConnect(frame);
      },
      onDisconnect: (frame) => {
        this.onDisconnect(frame);
      },
      onStompError: (frame) => {
        this.onStompError(frame);
      },
      onWebSocketClose: (evt) => {
        this._stompHandler = undefined;
        if (this.state === ActivationState.DEACTIVATING) {
          this._changeState(ActivationState.INACTIVE);
        }
        this.onWebSocketClose(evt);
        if (this.active) {
          this._schedule_reconnect();
        }
      },
      onWebSocketError: (evt) => {
        this.onWebSocketError(evt);
      },
      onUnhandledMessage: (message) => {
        this.onUnhandledMessage(message);
      },
      onUnhandledReceipt: (frame) => {
        this.onUnhandledReceipt(frame);
      },
      onUnhandledFrame: (frame) => {
        this.onUnhandledFrame(frame);
      }
    });
    this._stompHandler.start();
  }
  _createWebSocket() {
    let webSocket;
    if (this.webSocketFactory) {
      webSocket = this.webSocketFactory();
    } else if (this.brokerURL) {
      webSocket = new WebSocket(this.brokerURL, this.stompVersions.protocolVersions());
    } else {
      throw new Error("Either brokerURL or webSocketFactory must be provided");
    }
    webSocket.binaryType = "arraybuffer";
    return webSocket;
  }
  _schedule_reconnect() {
    if (this.reconnectDelay > 0) {
      this.debug(`STOMP: scheduling reconnection in ${this.reconnectDelay}ms`);
      this._reconnector = setTimeout(() => {
        this._connect();
      }, this.reconnectDelay);
    }
  }
  async deactivate(options = {}) {
    const force = options.force || false;
    const needToDispose = this.active;
    let retPromise;
    if (this.state === ActivationState.INACTIVE) {
      this.debug(`Already INACTIVE, nothing more to do`);
      return Promise.resolve();
    }
    this._changeState(ActivationState.DEACTIVATING);
    if (this._reconnector) {
      clearTimeout(this._reconnector);
      this._reconnector = undefined;
    }
    if (this._stompHandler && this.webSocket.readyState !== StompSocketState.CLOSED) {
      const origOnWebSocketClose = this._stompHandler.onWebSocketClose;
      retPromise = new Promise((resolve, reject) => {
        this._stompHandler.onWebSocketClose = (evt) => {
          origOnWebSocketClose(evt);
          resolve();
        };
      });
    } else {
      this._changeState(ActivationState.INACTIVE);
      return Promise.resolve();
    }
    if (force) {
      this._stompHandler?.discardWebsocket();
    } else if (needToDispose) {
      this._disposeStompHandler();
    }
    return retPromise;
  }
  forceDisconnect() {
    if (this._stompHandler) {
      this._stompHandler.forceDisconnect();
    }
  }
  _disposeStompHandler() {
    if (this._stompHandler) {
      this._stompHandler.dispose();
    }
  }
  publish(params) {
    this._checkConnection();
    this._stompHandler.publish(params);
  }
  _checkConnection() {
    if (!this.connected) {
      throw new TypeError("There is no underlying STOMP connection");
    }
  }
  watchForReceipt(receiptId, callback) {
    this._checkConnection();
    this._stompHandler.watchForReceipt(receiptId, callback);
  }
  subscribe(destination, callback, headers = {}) {
    this._checkConnection();
    return this._stompHandler.subscribe(destination, callback, headers);
  }
  unsubscribe(id, headers = {}) {
    this._checkConnection();
    this._stompHandler.unsubscribe(id, headers);
  }
  begin(transactionId) {
    this._checkConnection();
    return this._stompHandler.begin(transactionId);
  }
  commit(transactionId) {
    this._checkConnection();
    this._stompHandler.commit(transactionId);
  }
  abort(transactionId) {
    this._checkConnection();
    this._stompHandler.abort(transactionId);
  }
  ack(messageId, subscriptionId, headers = {}) {
    this._checkConnection();
    this._stompHandler.ack(messageId, subscriptionId, headers);
  }
  nack(messageId, subscriptionId, headers = {}) {
    this._checkConnection();
    this._stompHandler.nack(messageId, subscriptionId, headers);
  }
}

// node_modules/@stomp/rx-stomp/esm6/rx-stomp-state.js
var RxStompState;
(function(RxStompState2) {
  RxStompState2[RxStompState2["CONNECTING"] = 0] = "CONNECTING";
  RxStompState2[RxStompState2["OPEN"] = 1] = "OPEN";
  RxStompState2[RxStompState2["CLOSING"] = 2] = "CLOSING";
  RxStompState2[RxStompState2["CLOSED"] = 3] = "CLOSED";
})(RxStompState = RxStompState || (RxStompState = {}));

// node_modules/@stomp/rx-stomp/esm6/rx-stomp.js
class RxStomp {
  get stompClient() {
    return this._stompClient;
  }
  constructor(stompClient) {
    this._queuedMessages = [];
    const client = stompClient ? stompClient : new Client;
    this._stompClient = client;
    const noOp = () => {
    };
    this._beforeConnect = noOp;
    this._correlateErrors = () => {
      return;
    };
    this._debug = noOp;
    this._connectionStatePre$ = new BehaviorSubject(RxStompState.CLOSED);
    this._connectedPre$ = this._connectionStatePre$.pipe(filter((currentState) => {
      return currentState === RxStompState.OPEN;
    }));
    this.connectionState$ = new BehaviorSubject(RxStompState.CLOSED);
    this.connected$ = this.connectionState$.pipe(filter((currentState) => {
      return currentState === RxStompState.OPEN;
    }));
    this.connected$.subscribe(() => {
      this._sendQueuedMessages();
    });
    this._serverHeadersBehaviourSubject$ = new BehaviorSubject(null);
    this.serverHeaders$ = this._serverHeadersBehaviourSubject$.pipe(filter((headers) => {
      return headers !== null;
    }));
    this.stompErrors$ = new Subject;
    this.unhandledMessage$ = new Subject;
    this.unhandledReceipts$ = new Subject;
    this.unhandledFrame$ = new Subject;
    this.webSocketErrors$ = new Subject;
  }
  configure(rxStompConfig) {
    const stompConfig = Object.assign({}, rxStompConfig);
    if (stompConfig.beforeConnect) {
      this._beforeConnect = stompConfig.beforeConnect;
      delete stompConfig.beforeConnect;
    }
    if (stompConfig.correlateErrors) {
      this._correlateErrors = stompConfig.correlateErrors;
      delete stompConfig.correlateErrors;
    }
    this._stompClient.configure(stompConfig);
    if (stompConfig.debug) {
      this._debug = stompConfig.debug;
    }
  }
  activate() {
    this._stompClient.configure({
      beforeConnect: async () => {
        this._changeState(RxStompState.CONNECTING);
        await this._beforeConnect(this);
      },
      onConnect: (frame) => {
        this._serverHeadersBehaviourSubject$.next(frame.headers);
        this._changeState(RxStompState.OPEN);
      },
      onStompError: (frame) => {
        this.stompErrors$.next(frame);
      },
      onWebSocketClose: () => {
        this._changeState(RxStompState.CLOSED);
      },
      onUnhandledMessage: (message) => {
        this.unhandledMessage$.next(message);
      },
      onUnhandledReceipt: (frame) => {
        this.unhandledReceipts$.next(frame);
      },
      onUnhandledFrame: (frame) => {
        this.unhandledFrame$.next(frame);
      },
      onWebSocketError: (evt) => {
        this.webSocketErrors$.next(evt);
      }
    });
    this._stompClient.activate();
  }
  async deactivate(options = {}) {
    this._changeState(RxStompState.CLOSING);
    await this._stompClient.deactivate(options);
    this._changeState(RxStompState.CLOSED);
  }
  connected() {
    return this.connectionState$.getValue() === RxStompState.OPEN;
  }
  get active() {
    return this.stompClient.active;
  }
  publish(parameters) {
    const shouldRetry = parameters.retryIfDisconnected == null ? true : parameters.retryIfDisconnected;
    if (this.connected()) {
      this._stompClient.publish(parameters);
    } else if (shouldRetry) {
      this._debug(`Not connected, queueing`);
      this._queuedMessages.push(parameters);
    } else {
      throw new Error("Cannot publish while broker is not connected");
    }
  }
  _sendQueuedMessages() {
    const queuedMessages = this._queuedMessages;
    this._queuedMessages = [];
    if (queuedMessages.length === 0) {
      return;
    }
    this._debug(`Will try sending  ${queuedMessages.length} queued message(s)`);
    for (const queuedMessage of queuedMessages) {
      this._debug(`Attempting to send ${queuedMessage}`);
      this.publish(queuedMessage);
    }
  }
  watch(opts, headers = {}) {
    const defaults = {
      subHeaders: {},
      unsubHeaders: {},
      subscribeOnlyOnce: false
    };
    let params;
    if (typeof opts === "string") {
      params = Object.assign({}, defaults, {
        destination: opts,
        subHeaders: headers
      });
    } else {
      params = Object.assign({}, defaults, opts);
    }
    this._debug(`Request to subscribe ${params.destination}`);
    const coldObservable = Observable.create((messages) => {
      let stompSubscription;
      let stompConnectedSubscription;
      let connectedPre$ = this._connectedPre$;
      if (params.subscribeOnlyOnce) {
        connectedPre$ = connectedPre$.pipe(take(1));
      }
      const stompErrorsSubscription = this.stompErrors$.subscribe((error) => {
        const correlatedDestination = this._correlateErrors(error);
        if (correlatedDestination === params.destination) {
          messages.error(error);
        }
      });
      stompConnectedSubscription = connectedPre$.subscribe(() => {
        this._debug(`Will subscribe to ${params.destination}`);
        let subHeaders = params.subHeaders;
        if (typeof subHeaders === "function") {
          subHeaders = subHeaders();
        }
        stompSubscription = this._stompClient.subscribe(params.destination, (message) => {
          messages.next(message);
        }, subHeaders);
      });
      return () => {
        this._debug(`Stop watching connection state (for ${params.destination})`);
        stompConnectedSubscription.unsubscribe();
        stompErrorsSubscription.unsubscribe();
        if (this.connected()) {
          this._debug(`Will unsubscribe from ${params.destination} at Stomp`);
          let unsubHeaders = params.unsubHeaders;
          if (typeof unsubHeaders === "function") {
            unsubHeaders = unsubHeaders();
          }
          stompSubscription.unsubscribe(unsubHeaders);
        } else {
          this._debug(`Stomp not connected, no need to unsubscribe from ${params.destination} at Stomp`);
        }
      };
    });
    return coldObservable.pipe(share());
  }
  watchForReceipt(receiptId, callback) {
    this._stompClient.watchForReceipt(receiptId, callback);
  }
  asyncReceipt(receiptId) {
    return firstValueFrom(this.unhandledReceipts$.pipe(filter((frame) => frame.headers["receipt-id"] === receiptId)));
  }
  _changeState(state) {
    this._connectionStatePre$.next(state);
    this.connectionState$.next(state);
  }
}

// node_modules/@stomp/rx-stomp/esm6/rx-stomp-rpc.js
class RxStompRPC {
  constructor(rxStomp, stompRPCConfig) {
    this.rxStomp = rxStomp;
    this.stompRPCConfig = stompRPCConfig;
    this._replyQueueName = "/temp-queue/rpc-replies";
    this._setupReplyQueue = () => {
      return this.rxStomp.unhandledMessage$;
    };
    this._customReplyQueue = false;
    if (stompRPCConfig) {
      if (stompRPCConfig.replyQueueName) {
        this._replyQueueName = stompRPCConfig.replyQueueName;
      }
      if (stompRPCConfig.setupReplyQueue) {
        this._customReplyQueue = true;
        this._setupReplyQueue = stompRPCConfig.setupReplyQueue;
      }
    }
  }
  rpc(params) {
    return this.stream(params).pipe(first());
  }
  stream(params) {
    const headers = { ...params.headers || {} };
    if (!this._repliesObservable) {
      const repliesObservable = this._setupReplyQueue(this._replyQueueName, this.rxStomp);
      if (this._customReplyQueue) {
        this._dummySubscription = repliesObservable.subscribe(() => {
        });
      }
      this._repliesObservable = repliesObservable;
    }
    return Observable.create((rpcObserver) => {
      let defaultMessagesSubscription;
      const correlationId = headers["correlation-id"] || v4_default();
      defaultMessagesSubscription = this._repliesObservable.pipe(filter((message) => {
        return message.headers["correlation-id"] === correlationId;
      })).subscribe((message) => {
        rpcObserver.next(message);
      });
      headers["reply-to"] = this._replyQueueName;
      headers["correlation-id"] = correlationId;
      this.rxStomp.publish({ ...params, headers });
      return () => {
        defaultMessagesSubscription.unsubscribe();
      };
    });
  }
}

// src/socket.ts
class BoardSocket {
  _rxStomp;
  _rxStompRPC;
  _wsCallback;
  constructor(brokerUrl, wscallback) {
    this._wsCallback = wscallback;
    this._rxStomp = new RxStomp;
    this._rxStomp.configure({
      brokerURL: brokerUrl,
      reconnectDelay: 1000
    });
    const queueName = v4_default();
    this._rxStompRPC = new RxStompRPC(this._rxStomp, {
      replyQueueName: `/queue/replies-${queueName}`,
      setupReplyQueue: (replyQueueName, rxStomp) => {
        return rxStomp.watch(replyQueueName, {
          "auto-delete": "true",
          durable: "false",
          exclusive: "false"
        });
      }
    });
  }
  connect() {
    this._rxStomp.activate();
    this._rxStomp.watch({ destination: "/topic/outgoing" }).subscribe((message) => {
      console.log(message.body);
      this._wsCallback(JSON.parse(message.body));
    });
    this._rxStomp.stompClient.onDisconnect = () => {
      console.log("Socket disconnected");
    };
  }
  sendMessage(message) {
    this._rxStomp.publish({
      destination: "/app/incoming",
      body: JSON.stringify({ message: JSON.stringify(message) })
    });
  }
  callMethod(callback, methodName, ...args) {
    this._rxStompRPC.rpc({
      destination: "/app/api/request",
      body: JSON.stringify({ method: methodName, args })
    }).subscribe((response) => {
      callback(JSON.parse(response.body));
    });
  }
}

// src/app.ts
class BoardApp extends Engine {
  _socket;
  _scene;
  boardName;
  userName;
  constructor(canvasId, brokerUrl) {
    super(canvasId, new Renderer(canvasId));
    this._socket = new BoardSocket(brokerUrl, this.wsMessage);
    this._socket.connect();
    this.boardName = "default";
    this._scene = new BoardScene(this);
  }
  get socket() {
    return this._socket;
  }
  setup(boardName, username) {
    this.boardName = boardName;
    this.userName = username;
  }
  update(dt) {
    this._scene.update(dt);
  }
  draw(ctx) {
    ctx.clearRect(0, 0, this.displayWidth, this.displayHeight);
    this._scene.draw(ctx);
  }
  command(cmd, ...args) {
    console.log(`Executing cmd: ${cmd}, args: ${args}`);
    return this._scene.command(cmd, args);
  }
  wsMessage = (message) => {
    this._scene.wsMessage(message);
  };
}

// src/main.ts
var CANVAS_ID = "canvas";
var BROKER_URL = "ws://192.168.7.3:8081/websocket";
var $board = new BoardApp(CANVAS_ID, BROKER_URL);
$board.run();
