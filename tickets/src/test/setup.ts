import { beforeAll, beforeEach, afterAll, afterEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt, { sign } from 'jsonwebtoken';
import request from 'supertest';
import { app } from '@/app';

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

let cookie: string[] = [];

const signin = () => {
  if (cookie.length) {
    return cookie;
  }
  // build a jwt payload
  const payload = {
    email: 'john@test.com',
    id: new mongoose.Types.ObjectId().toHexString(),
  };
  //Create the JWT
  const session = {
    jwt: jwt.sign(payload, process.env.JWT_KEY!),
  };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString('base64');

  cookie = [`session=${base64}`];
  return cookie;
};

afterEach(() => {
  cookie = [];
});

const testapi = {
  signout() {
    cookie = [];
  },
  get(url: string) {
    return request(app).get(url).set('Cookie', signin());
  },
  post(url: string) {
    return request(app).post(url).set('Cookie', signin());
  },
  put(url: string) {
    return request(app).put(url).set('Cookie', signin());
  },
  anonymized: {
    get(url: string) {
      return request(app).get(url).set('Cookie', []);
    },
    post(url: string) {
      return request(app).post(url).set('Cookie', []);
    },
    put(url: string) {
      return request(app).put(url).set('Cookie', []);
    },
  },
};

export default testapi;

export const objectId = () => {
  return new mongoose.Types.ObjectId().toHexString();
};
