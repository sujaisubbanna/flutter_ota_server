import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { init } from '../utils/git';

export default async function indexController(fastify: FastifyInstance) {
  // GET /
  fastify.get("/", async function (
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const latestCommit = await init('main');
      console.log(latestCommit);
      reply.send('OK');
    }catch(err) {
      console.log(err);
      reply.status(500).send('Internal Server Error');
    }
  });
}
