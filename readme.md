## CLIENT - electron

**Run Client**

1. `cd client`
1. install packages `npm i`
1. rebuild electron `npx electron-rebuild`
1. run dev server in watch mode `npm run watch:dev`

**Change Port**

1. Go to `client/scripts/config.js`
2. Change com port ```js const COM_PORT="<your COM port>";```

## SERVER - node

**Run Server**

1. `cd server`
1. `npm i`
1. `node index.js`

**Endpoints**

- Get All Data / View Chart `/`
- Save New or Update Exercise `/exercise`
  > Method should be POST
