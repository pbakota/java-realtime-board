# vim: ts=4 sw=4 sts=4 noet ai

all: build

build:
	make build-eureka && make build-gateway && make build-websocket-server

build-eureka:
	cd eureka && docker build --progress=plain --no-cache . --tag=rt-eureka:dev

build-gateway:
	cd gateway && docker build --progress=plain --no-cache . --tag=rt-gateway:dev

build-websocket-server:
	cd websocket-server && docker build --progress=plain --no-cache . --tag=rt-websocket-server:dev

start-stack:
	docker compose -f stack.yml up --scale rt-websocket-server=4 --remove-orphans -d

stop-stack:
	docker compose -f stack.yml down


