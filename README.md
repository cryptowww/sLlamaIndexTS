# LlamaIndex Next.js

## Create Project

```shell
npx create-next-app next-llamaindex-1
```

## Install Dependencies

```shell
npm install llamaindex
```

## modify the next.config.js

```javascript
import withLlamaIndex from "llamaindex/next";

const nextConfig = {};

export default withLlamaIndex(nextConfig);
```

## execute Typescript code DIRECTLY

please refer to the folder app/agent/

in the folder ,there are 2 files:

1. .env for env variables, like OPENAI_API_KEY and OPENAI_BASE_URL
2. index.ts for the code that will be executed

execute Typescript code via command

```shell
npx tsx index.ts
```

so the code does not depend on other packages like nextjs and reactjs.
