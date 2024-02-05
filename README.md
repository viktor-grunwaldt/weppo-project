# tic-tac-toe

## Origin

Project was created as final assignment for web dev, which focused on using sockets (with [socket.io](https://socket.io)).
Goal was to implement a multiplayer game (or a game platform) which would then communicate with players through sockets.

## Technologies used

 * [pnpm](https://pnpm.io) For disk efficiency (used for the whole course!)
 * [VS Code](https://code.visualstudio.com/) Out of the box js/ts/tsx/html/css support is a killer feature, used it despite using [Helix](https://helix-editor.com/) as primary text editor.
 * [Typescript](https://www.typescriptlang.org/) as both the front and backend language.
 * [socket.io](https://socket.io) 4.7.4 

### backend

 * expressjs as web framework.
 * ts-node + nodemon for automatic reloads

### frontend

 * vite to init and build frontend (allows me to bundle socket.io-client)
 * react since I'm building a game, I'd want to implement interactivity in a ~~well~~ structured manner.

## Running in dev

In order to run:

```bash
cd ./frontend
pnpm install
pnpm dev
# second tmux/terminal window
cd ./backend
pnpm install
pnpm dev
```

## Running in local network

Swap line in `./backend/src/app.ts`\
from `const origin = ""localhost:${PORT};`
to `const origin = '*';` \
and in `./frontend/src/services/socket_service.ts`\
from `const address = "http://localhost";`
to `const address = "http://192.168.1.200";`

then, to start:

```bash
cd ./frontend
pnpx vite --host
# second instance
cd ./backend
pnpx dev
```
