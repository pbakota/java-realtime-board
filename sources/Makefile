.PHONY: build
all: build

build:
	./mvnw compile install

clean:
	./mvnw clean

run-eureka:
	cd eureka && ../mvnw spring-boot:run

run-gw:
	cd gateway && ../mvnw spring-boot:run

run-websocket:
	cd websocket-server && ../mvnw spring-boot:run

build-app:
	cd  && bun build --target browser --outfile websocket-server/src/main/resources/static/app.js --watch app/main.ts

