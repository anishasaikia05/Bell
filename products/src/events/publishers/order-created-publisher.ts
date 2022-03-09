import { Publisher, Queues, OrderCreatedEvent } from '@aneebell/common-module';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  queue: Queues.OrderCreated = Queues.OrderCreated; 
}