import { beforeAll, beforeEach, afterAll, afterEach, vi } from 'vitest';
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

vi.mock('../nats-wrapper');

beforeEach(async () => {
  vi.clearAllMocks();
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

class Testapi {
  private cookie: string[] = [];

  private signin(): string[] {
    if (this.cookie.length) {
      return this.cookie;
    }

    const payload = {
      email: 'john@test.com',
      id: new mongoose.Types.ObjectId().toHexString(),
    };

    const session = {
      jwt: jwt.sign(payload, process.env.JWT_KEY!),
    };
    const sessionJSON = JSON.stringify(session);
    const base64 = Buffer.from(sessionJSON).toString('base64');

    this.cookie = [`session=${base64}`];
    return this.cookie;
  }

  signout(): void {
    this.cookie = [];
  }

  get(url: string) {
    return request(app).get(url).set('Cookie', this.signin());
  }

  post(url: string) {
    return request(app).post(url).set('Cookie', this.signin());
  }

  delete(url: string) {
    return request(app).delete(url).set('Cookie', this.signin());
  }

  put(url: string) {
    return request(app).put(url).set('Cookie', this.signin());
  }

  anonymized = {
    get: (url: string) => {
      return request(app).get(url).set('Cookie', []);
    },
    post: (url: string) => {
      return request(app).post(url).set('Cookie', []);
    },
    put: (url: string) => {
      return request(app).put(url).set('Cookie', []);
    },
  };
}

const testapi = new Testapi();

export default testapi;

afterEach(() => {
  testapi.signout();
});

export const objectId = () => {
  return new mongoose.Types.ObjectId().toHexString();
};
