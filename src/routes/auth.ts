import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fastifyBcrypt from 'fastify-bcrypt';
import { signInUserOpts, signUpUserOpts } from '../route-options/auth';
import { signInHandler, signUpHandler } from '../controllers/auth';

export default async function AuthRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: () => void,
) {
  fastify.register(fastifyBcrypt, {
    saltWorkFactor: 12,
  });

  fastify.addHook('preHandler', (req, reply, done) => {
    fastify.log.info('Middleware');
    done();
  });

  fastify.route({
    method: 'POST',
    url: '/signUp',
    schema: signUpUserOpts.schema,
    handler: signUpHandler,
  });

  fastify.route({
    method: 'POST',
    url: '/signIn',
    schema: signInUserOpts.schema,
    handler: signInHandler,
  });
}
