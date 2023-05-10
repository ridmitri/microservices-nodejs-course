import { it, expect } from 'vitest';
import { Ticket } from '@/models/ticket';
import testapi from '@/test/setup';
import { natsWrapper } from '@/nats-wrapper';

it('has a route handler listening to /api/tickets/ for post requests', async () => {
  const response = await testapi.anonymized.post('/api/tickets').send({});
  expect(response.status).not.toBe(404);
});

it('can only be accessed if the user is logged in', async () => {
  return testapi.anonymized.post('/api/tickets').send({}).expect(401);
});

it('returns a status other than 401 if the user is logged in', async () => {
  const response = await testapi.post('/api/tickets').send({});

  expect(response.status).not.toBe(401);
});

it('returns an error if invalid title is provided ', async () => {
  await testapi
    .post('/api/tickets')
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await testapi
    .post('/api/tickets')
    .send({
      price: 10,
    })
    .expect(400);
});

it('returns an error if invalid price is provided ', async () => {
  await testapi
    .post('/api/tickets')
    .send({
      title: 'Valid title',
      price: -10,
    })
    .expect(400);

  await testapi
    .post('/api/tickets')
    .send({
      title: 'Valid title',
    })
    .expect(400);
});

it('creates a ticket for valid inputs', async () => {
  let tickets = await Ticket.find({});

  expect(tickets.length).toEqual(0);

  const title = 'Valid title';
  const price = 20;

  const { body } = await testapi
    .post('/api/tickets')
    .send({
      title,
      price,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);

  expect(body.title).toEqual(title);
  expect(body.price).toEqual(price);
});

it('published an event', async () => {
  const title = 'Valid title';
  const price = 20;

  await testapi
    .post('/api/tickets')
    .send({
      title,
      price,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
