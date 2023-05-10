import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@unlimited-js/common';
import { body } from 'express-validator';
// import { Ticket } from '@/models/ticket';

const router = express.Router();

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => {
        // WARN: couple with implementation of the tickets DB
        return mongoose.Types.ObjectId.isValid(input);
      })
      .withMessage('TicketId should be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // const tickets = await Ticket.find({});
    res.send({});
  }
);

export { router as createOrderRouter };
