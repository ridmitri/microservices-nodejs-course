import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@unlimited-js/common';
import { createTicketRouter } from './routes/new';
import { showTicketsRouter } from './routes/show';
import { indexTickesRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketsRouter);
app.use(indexTickesRouter);
app.use(updateTicketRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
