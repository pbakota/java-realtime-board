OUT_DIR=../websocket-server/src/main/resources/static
.PHONY: build
all: build

build:
	bun build --target browser --outfile $(OUT_DIR)/app.js --watch src/main.ts

serve:
	php -S [::]:8000 -t $(OUT_DIR)

