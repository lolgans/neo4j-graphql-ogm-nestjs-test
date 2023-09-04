# Startup

- npm i
- Set neo4j url, user and pw in environment.ts
- Start server with `run npm serve`
- Go to localhost:3333/graphql to use the playground

- To test ogm type generation, go to `app.module.ts` and comment in one of the following lines.
- `await generateTypesFromGQLSchema();`
- `await ogm.init()`