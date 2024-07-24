import { RouteHandler } from 'fastify';
import { IAnimalsParams, IPostAnimalBody } from '../types/animals';

import logger from '../logger';

export const getAnimalsHandler: RouteHandler = async (req, reply) => {
  const animalsColRef = req.server.mongo.db?.collection('animals');

  try {
    const data = await animalsColRef?.find().toArray();
    reply.send(data);
  } catch (err) {
    logger.error('getAnimalsHandler err:', err);
    reply.send({ message: 'wa lgee' });
  }
};

export const getAnimalHandler: RouteHandler<{
  Params: IAnimalsParams;
}> = async (req, reply) => {
  const animalsColRef = req.server.mongo.db?.collection('animals');

  const { id } = req.params;

  try {
    const data = await animalsColRef?.findOne({
      _id: req.server.parseToObjectId(req.server, {}, id),
    });

    reply.send(data);
  } catch (err: any) {
    logger.error('getAnimalHandler err:', err);
    reply.send({ message: 'wa lgee' });
  }
};

export const createAnimalHandler: RouteHandler<{
  Body: IPostAnimalBody;
}> = async (req, reply) => {
  const animalsColRef = req.server.mongo.db?.collection('animals');
  const { name } = req.body;
  try {
    await animalsColRef?.insertOne({ name: name });
    reply.status(201);
    return { message: 'Created' };
  } catch (err) {
    logger.error('Create animal Err:', err);
    reply.send(err);
  }
};

export const deleteAnimalHandler: RouteHandler<{
  Params: IAnimalsParams;
}> = async (req, reply) => {
  const animalsColRef = req.server.mongo.db?.collection('animals');
  const { id } = req.params;

  try {
    const animal = await animalsColRef?.findOne({
      _id: req.server.parseToObjectId(req.server, {}, id),
    });
    if (!animal) {
      reply.status(404);
      return { message: "Record doesn't exist" };
    }

    await animalsColRef?.deleteOne({
      _id: req.server.parseToObjectId(req.server, {}, id),
    });
    reply.status(200);
    return { message: 'Deleted' };
  } catch (err) {
    logger.error('deleteAnimalHandler err:', err);
    return err;
  }
};
