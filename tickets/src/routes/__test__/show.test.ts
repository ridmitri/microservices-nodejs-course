import { it, expect } from 'vitest';
import testapi, { objectId } from '@/test/setup';

it('returns 404 is the ticket is not found', async () => {
  const id = objectId();
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
