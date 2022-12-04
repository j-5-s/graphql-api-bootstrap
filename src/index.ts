import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createServer } from 'http';
import express from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import 'dotenv/config';
import bodyParser from 'body-parser';
import cors from 'cors';
import { typeDefs } from './schema/graph-schema';
import { resolvers } from './resolvers';
import { getConnection } from './mongo';
import { ContextValue } from './context';




const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const connection = await getConnection();


const server = new ApolloServer<ContextValue>({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();

const context = async ({ req }) => new ContextValue({ req, server, connection })
// eslint-disable-next-line react-hooks/rules-of-hooks
const serverCleanup = useServer({
  schema,
  context,
}, wsServer);

app.use('/graphql', cors<cors.CorsRequest>(), bodyParser.json(), expressMiddleware(server, {
  context,
}));

const PORT = 4000;
// Now that our HTTP server is fully set up, we can listen to it.
httpServer.listen(PORT, () => {
  console.log(`Server is now running on http://localhost:${PORT}/graphql`);
});

