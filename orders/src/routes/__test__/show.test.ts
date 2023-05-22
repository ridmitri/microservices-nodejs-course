import { it, expect } from 'vitest';
import testapi from '@/test/setup';
import { Ticket } from '@/models/ticket';

it('fetches the order', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  const { body: order } = await testapi
    .post('/api/orders')
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body } = await testapi.get(`/api/orders/${order.id}`).expect(200);

  expect(body.id).toEqual(order.id);
});

it('returns an error is one user tries to fetch another user`s order', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  const { body: order } = await testapi
    .post('/api/orders')
    .send({ ticketId: ticket.id })
    .expect(201);

  testapi.signout();
  await testapi.get(`/api/orders/${order.id}`).expect(401);
});
