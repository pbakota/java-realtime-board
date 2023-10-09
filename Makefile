
.PHONY: copy-all copy-eureka copy-gateway copy-websocket-server
all:

copy-all:
	make copy-eureka && make copy-gateway && make copy-websocket-server

copy-eureka:
	rsync -a sources/eureka/target/eureka-0.0.1-SNAPSHOT.jar root@playbox:/root/java-microservices-grpc-docker/eureka/
copy-gateway:
	rsync -a sources/gateway/target/gateway-0.0.1-SNAPSHOT.jar root@playbox:/root/java-microservices-grpc-docker/gateway/
copy-websocket-server:
	rsync -a sources/websocket-server/target/websocket-server-0.0.1-SNAPSHOT.jar root@playbox:/root/java-microservices-grpc-docker/websocket-server/
