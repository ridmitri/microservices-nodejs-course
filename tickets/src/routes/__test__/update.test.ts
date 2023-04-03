import testapi, { objectId } from '@/test/setup';
import { it, expect } from 'vitest';

it('returns 404 if the provided id does not exist', async () => {
  const id = objectId();
  await testapi
    .put(`/api/tickets/${id}`)
    .send({
      title: 'Valid',
      price: 20,
    })
    .expect(404);
});

it('returns 401 if the user is not autheniticated', async () => {
  const id = objectId();
  await testapi.anonymized
    .put(`/api/tickets/${id}`)
    .send({
      title: 'Valid',
      price: 20,
    })
    .expect(401);
});

it('returns 401 if the user does not own the ticket', async () => {
  const title = 'x';
  const price = 20;
  const response = await testapi.post('/api/tickets').send({ title, price });

  // reset the user created the ticket
  testapi.signout();

  await testapi
    .put(`/api/tickets/${response.body.id}`)
    .send({
      title: 'y',
      price: 10,
    })
    .expect(401);

  const unchangedTicket = await testapi
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(unchangedTicket.body.title).toEqual(title);
  expect(unchangedTicket.body.price).toEqual(price);
});

it('returns 400 if the user provides invalid title or price', async () => {
  const response = await testapi.post('/api/tickets').send({
    title: 'x',
    price: 20,
  });

  await testapi
    .put(`/api/tickets/${response.body.id}`)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  await testapi
    .put(`/api/tickets/${response.body.id}`)
    .send({
      title: 'Ok',
      price: -20,
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const title = 'y';
  const price = 10;
  const response = await testapi.post('/api/tickets').send({
    title: 'x',
    price: 20,
  });

  await testapi
    .put(`/api/tickets/${response.body.id}`)
    .send({
      title,
      price,
    })
    .expect(200);

  const updatedTicket = await testapi
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(updatedTicket.body.title).toEqual(title);
  expect(updatedTicket.body.price).toEqual(price);
});
