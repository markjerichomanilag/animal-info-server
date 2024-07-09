import 'fastify';
import { FastifyReply } from 'fastify';
import { IJWTPayload } from './auth';
import { VerifyPayloadType } from '@fastify/jwt';

declare module 'fastify' {
  interface FastifyInstance {
    parseToObjectId: (
      fastify: FastifyInstance,
      options: FastifyPluginOptions,
      id: string,
    ) => fastify.mongo.ObjectId;
    verifyAuthorization: preHandlerHookHandler;
    signJwt: (fastify: FastifyInstance, payload: IJWTPayload) => string;
    verifyJwtToken: (
      fastify: FastifyInstance,
      token: string,
    ) => VerifyPayloadType & IJWTPayload;
  }
}
