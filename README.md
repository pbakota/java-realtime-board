# Real-time collaboration board demo with Spring Boot 3, MongoDB, RabbitMQ, Eureka, Spring-Cloud-Gateway and Websocket

## Preface

The project demonstrates a real-time collaboration platform where the users are able to place basic shapes on the board and move them, all in real-time. That means the other users will see the changes on the board immediately. The project also demonstrates a simple on-site chat that can be used for conversations between participants.

## The architecture

![alt](http://127.0.0.1:8000/figures/figure-1.svg)

The architecture consists of three major parts. The part named "gateway" is the main entry point for future users. It serves two purposes, the first is to be the front door for the service including optional authentication and authorization (not implemented in this demo project). But it serves also as a load balancer for the web socket server cluster. The part named "web socket server cluster" is used for clustering web socket servers which are the main backbone for the whole project. The web socket server also serves two purposes. The first is to be a relay for message broker, and the second is to serve web socket requests and RCP calls. The project also contains a "service discovery" service used to discover new instances of the web socket server for the load balancer and allow us to start up and shut down the socket servers freely. The last part of the project is the storage service (MongoDB), which stores all the data from the board as well as the conversations between the users.

The service is scalable horizontally and vertically. It can be scaled horizontally by adding new instances of the web socket server, and it can scale vertically by implementing async execution of the web socket endpoints.
The project supports an "unlimited" number of web socket servers to serve a large number of users.

## Implementation

Implemented features:

* Multi board real-time collaboation canvas that manages basic shapes on board
* Simple on-site chat per board
* RPC API calls as replacement for REST endpoints

The solution assume that you already have installed the required core services and those are:

* MongoDB
* RabbitMQ (with STOMP plugin)

### The comminication

The project uses STOMP over a web socket for communication. Java Spring boot 3 is used for the backend implementation and TypeScript for the frontend. MongoDB is used to store all the information from the system, including data about boards and board items, as well as to store user conversations. The project also has a very simple RPC implementation which can be used as a replacement for REST endpoints. All the communications between the client and the server were done through a web socket. The communication was implemented with a publish/subscribe pattern. The RCP has been implemented with JavaScript Promises for better usability.

### The board

The board is implemented with HTML5 canvas.

Accepts following simple commands:

* **ObjectCreateMessage**
    This message will create a new shape on the board
* **ObjectMovedMessage**
    This message will set the new position of the item on the board
* **ObjectRemovedMessage**
    With this message the board item can be removed
* **UserMessage**
    The participants of the board can send messages.

Also implemented two RCP calls:

* **get-board-items**
    To retrive board items
* **get-board-messages**
    To retrive latest board messages

The board implemented double-buffering to not have any tearing on the screen and to have a much smoother experience.
The demo project also contains a small HTML page with a basic chat component. The HTML page uses jQuery but that is used only for help with HTML manipulations and it has not been involved in any other procedures.

## Configuration

There are a couple of configuration files which need update/change before you can run the project. And those are:

The environment variables:

```text
EUREKA_URI          - Contains URI for eureka (eg: http://localhost:8761/eureka)
MONGODB_URI         - Contains URI for MongoDB (eg: mongodb://root:example@localhost:27017)
MONGODB_DATABASE    - The name of the MongoDB database
MIN_PORT            - The start of the port range for websocket-server (eg: 10000)
MAX_PORT            - The end of the port range for websocket-server (eg: 11000)
BROKER_HOST         - The hostname of the message broker (eg: localhost)
```

Most probably you can keep MIN_PORT and MAX_PORT unaltered. But you have to change the values for other environment variables.

## Build & run

The project used GNU make files to build and package the services. There are a couple of targets that can be used from "source" folder:

```text
make                  - This will build everything
make run-eureka       - This will run the eureka discovery service
make run-gateway      - This will run the gateway service
make run-websocket    - This will run a single instance of the websocket service
```

To test the whole demo project you have to have all the services up and running.

## Frontend build

The project implements frontend in plain TypeScript using excellent **bun** (https://bun.sh/) all-in-one toolkit for JavaScript and TypeScript.

To build the project go to 'app' folder and there again you can find a Makefile

There are a couple of targets defined:

```text
make build  - To build the app in watch mode
              (automatically will comipled to JavaScript on save)
make serve  - To run the HTTP server for testing (PHP)
```

## Deploying in Docker container

You have to build the whole project and then copy the services JAR file into their matching folder under the 'docker' folder.

Run the stack with the command

```text
make start-stack
```

To stop the stack

```text
make stop-stack
```

NOTE: Do not forget to update your application.properties file under 'docker' container.
