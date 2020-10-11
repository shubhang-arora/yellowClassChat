"use strict";

var _dotenv = require("dotenv");

var _dotenv2 = _interopRequireDefault(_dotenv);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _apolloServerExpress = require("apollo-server-express");

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

require("./utils/db");

var _schema = require("./schema");

var _schema2 = _interopRequireDefault(_schema);

var _auth = require("./utils/auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

const app = (0, _express2.default)();
const server = new _apolloServerExpress.ApolloServer({
  schema: _schema2.default,
  context: ({
    req
  }) => {
    if (req) {
      const token = req.headers.authorization || '';

      let _id = (0, _auth.verifyToken)(token);

      return {
        token,
        _id
      };
    }
  },
  subscriptions: {
    onConnect: () => console.log('Connected to websocket')
  },
  cors: true,
  playground: true,
  introspection: true,
  tracing: true,
  path: '/'
});
server.applyMiddleware({
  app,
  path: '/',
  cors: true,
  onHealthCheck: () => // eslint-disable-next-line no-undef
  new Promise((resolve, reject) => {
    if (_mongoose2.default.connection.readyState > 0) {
      resolve();
    } else {
      reject();
    }
  })
});

const httpServer = _http2.default.createServer(app);

server.installSubscriptionHandlers(httpServer);
httpServer.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT || 3000}`);
  console.log(`Subscriptions ready at ws://localhost:${process.env.PORT || 3000}${server.subscriptionsPath}`);
  console.log(`Health checks available at ${process.env.HEALTH_ENDPOINT}`);
});