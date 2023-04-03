import { it, expect } from 'vitest';
import testapi from '@/test/setup';

const createTicket = (payload: { title: string; price: number }) => {
  return testapi.post('/api/tickets').send(payload);
};

it('can fetch a list of tickets', async () => {
  await createTicket({ title: 'one', price: 10 });
  await createTicket({ title: 'two', price: 20 });
  await createTicket({ title: 'three', price: 30 });

  const response = await testapi.get('/api/tickets').send().expect(200);
  expect(response.body.length).toEqual(3);
});
