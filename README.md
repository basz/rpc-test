An EmberJS application consuming a library that depends on rpc-websockets

The rpc-websockets 7.10.0 works, but with 7.11.0 an error occures in the console due to webpack packaging.

I have stripped the original application away leaving only the essentials.

have a look at apps/frontend/ember-cli-build.js the webpack options might have something to do with this.

Run with

```
pnpm i
pnpm run start:dev
open http://localhost:4208/
```
