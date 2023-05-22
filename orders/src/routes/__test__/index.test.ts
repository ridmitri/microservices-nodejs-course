import { it, expect } from 'vitest';
import testapi from '@/test/setup';
import { Ticket } from '@/models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });

  await ticket.save();
  return ticket;
};

it('fetches order for a particular user', async () => {
  // Create 3 tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  // Create 1 Order as User #1
  await testapi
    .post('/api/orders')
    .send({ ticketId: ticketOne.id })
    .expect(201);
  testapi.signout();
  // Create 2 Order as User #2
  const { body: orderOne } = await testapi
    .post('/api/orders')
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  const { body: orderTwo } = await testapi
    .post('/api/orders')
    .send({ ticketId: ticketThree.id })
    .expect(201);
  // Make request to get order for User #2
  const { body } = await testapi.get('/api/orders').expect(200);
  expect(body.length).toEqual(2);
  expect(body[0]).toEqual(orderOne);
  expect(body[1]).toEqual(orderTwo);
});
