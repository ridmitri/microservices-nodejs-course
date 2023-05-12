import mongoose from 'mongoose';
import { it, expect } from 'vitest';
import testapi from '@/test/setup';
import { Order, OrderStatus } from '@/models/order';
import { Ticket } from '@/models/ticket';

it('returns an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await testapi
    .post('/api/orders')
    .send({
      ticketId,
    })
    .expect(404);
});

it('returns an error if the ticket is reserved', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: 'test-user',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await order.save();

  await testapi
    .post('/api/orders')
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  const { body } = await testapi
    .post('/api/orders')
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  expect(body.ticket.id).toEqual(ticket.id);
  expect(body.ticket.title).toEqual(ticket.title);
  expect(body.ticket.price).toEqual(ticket.price);
});

it.todo('emits an order created event');
