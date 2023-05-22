import { it, expect } from 'vitest';
import testapi from '@/test/setup';
import { Ticket } from '@/models/ticket';
import { Order, OrderStatus } from '@/models/order';

it('marks an order as cancelled', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });

  await ticket.save();

  const { body: order } = await testapi
    .post('/api/orders')
    .send({ ticketId: ticket.id })
    .expect(201);

  await testapi.delete(`/api/orders/${order.id}`).expect(204);
  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});
