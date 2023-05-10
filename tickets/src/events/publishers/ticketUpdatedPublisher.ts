import { Publisher, Subjects, TicketUpdatedEvent } from '@unlimited-js/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
