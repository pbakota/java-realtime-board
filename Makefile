
.PHONY: copy-all copy-eureka copy-gateway copy-websocket-server
all:

copy-all:
	make copy-eureka && make copy-gateway && make copy-websocket-server

copy-eureka:
	rsync -a sources/eureka/target/eureka-0.0.1-SNAPSHOT.jar root@playbox:/root/java-realtime-board-docker/eureka/

copy-gateway:
	rsync -a sources/gateway/target/gateway-0.0.1-SNAPSHOT.jar root@playbox:/root/java-realtime-board-docker/gateway/

copy-websocket-server:
	cp sources/websocket-server/target/websocket-server-0.0.1-SNAPSHOT.jar docker/websocket-server/ && \
	cp sources/app/public/app.js docker/websocket-server/ && \
	rsync -a docker/* root@playbox:/root/java-realtime-board-docker
