# Real-time collaboration board demo with Spring Boot 3, MongoDB, Eureka, Spring-Cloud-Gateway and Websocket

## Preface

The project demonstrates real-time collaboration platform where the users are able to place basic shapes on the board and move them, all in real-time. That means the other users will see the changes on the board immediatelly. The project also demonstrates a simple on-site chat which can be used for conversations between the users.

## The architecture

[figure]

## Implementation

You can start "unlimited" number of websocket servers to serve large number of users.

Implemented features:

* Multi board real-time collaboation canvas that manages basic shapes on board
* Simple on-site chat per board
* RPC API calls (with RxJs and RxStomp) as replacement for REST endpoints

