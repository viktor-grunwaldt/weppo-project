# tic-tac-toe

base of the tic-tac-toe project.

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
