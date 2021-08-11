require('dotenv').config();
import fastify from "fastify";
import router from "./router";
import {fastifyEnv} from 'fastify-env';

const server = fastify({
  // Logger only for production
  logger: !!(process.env.NODE_ENV !== "development"),
});

const schema = {
  type: 'object',
  required: [ 'REPO_URL' ],
  properties: {
    NODE_ENV: {
      type: 'string',
      default: 'development'
    },
    REPO_URL: {
      type: 'string'
    }
  }
}

const options = {
  schema: schema,
  dotenv: true
}

server.register(fastifyEnv, options);


// Middleware: Router
server.register(router);

export default server;
