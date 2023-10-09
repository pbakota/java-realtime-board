FROM eclipse-temurin:17-jre-alpine
RUN mkdir /app
COPY board.html /app/
COPY websocket-server-0.0.1-SNAPSHOT.jar /app/
WORKDIR /app
ENTRYPOINT ["java","-jar","websocket-server-0.0.1-SNAPSHOT.jar", "-Dspring.web.resources.static-locations","classpath:."]

