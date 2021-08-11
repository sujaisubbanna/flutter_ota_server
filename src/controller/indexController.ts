import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { init, diff, cleanUp, getFirstCommit } from '../utils/git';

export default async function indexController(fastify: FastifyInstance) {
  const REPO_URL = process.env.REPO_URL ?? '';

  fastify.get("/", async function (
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { branch, commit } = _request.query as any;
      const path = await init(branch, REPO_URL);
      const filesDiff = await diff(path, commit);
      await cleanUp(path);
      reply.send(filesDiff);
    } catch (err) {
      console.log(err);
      reply.status(500).send('Internal Server Error');
    }
  });

  fastify.get("/first-commit", async function (
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { branch } = _request.query as any;
      const path = await init(branch, REPO_URL);
      const commit = await getFirstCommit(path);
      await cleanUp(path);
      reply.send(commit);
    } catch (err) {
      console.log(err);
      reply.status(500).send('Internal Server Error');
    }
  });
}
