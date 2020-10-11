import dotenv from 'dotenv';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import http from 'http';

import './utils/db';
import schema from './schema';
import { verifyToken } from './utils/auth';

dotenv.config();

const app = express();

const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    if (req) {
      const token = req.headers.authorization || '';
      let _id = verifyToken(token);

      return { token, _id };
    }
  },
  subscriptions: {
    onConnect: () => console.log('Connected to websocket'),
  },
  cors: true,
  playground: true,
  introspection: true,
  tracing: true,
  path: '/',
});

server.applyMiddleware({
  app,
  path: '/',
  cors: true,
  onHealthCheck: () =>
    // eslint-disable-next-line no-undef
    new Promise((resolve, reject) => {
      if (mongoose.connection.readyState > 0) {
        resolve();
      } else {
        reject();
      }
    }),
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT || 3000}`);
  console.log(
    `Subscriptions ready at ws://localhost:${process.env.PORT || 3000}${
      server.subscriptionsPath
    }`,
  );
  console.log(`Health checks available at ${process.env.HEALTH_ENDPOINT}`);
});
