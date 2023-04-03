import { it, expect } from 'vitest';
import testapi from '@/test/setup';
import mongoose from 'mongoose';

it('returns 404 is the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await testapi.get(`/api/tickets/${id}`).send({}).expect(404);
});

it('returns the ticket is the ticket is found', async () => {
  const title = 'Concert';
  const price = 20;

  const response = await testapi
    .post('/api/tickets')
    .send({
      title,
      price,
    })
    .expect(201);

  const { body } = await testapi
    .get(`/api/tickets/${response.body.id}/`)
    .send({})
    .expect(200);

  expect(body.title).toEqual(title);
  expect(body.price).toEqual(price);
});
