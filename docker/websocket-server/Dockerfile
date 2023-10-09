FROM eclipse-temurin:17-jre-alpine
RUN mkdir -p /app/static
COPY board.html /app/public/
COPY app.js /app/public/
COPY websocket-server-0.0.1-SNAPSHOT.jar /app/
WORKDIR /app
ENTRYPOINT ["java","-jar","websocket-server-0.0.1-SNAPSHOT.jar", "--spring.web.resources.static-locations=file:/app/public"]

