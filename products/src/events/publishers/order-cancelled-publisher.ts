import { Publisher, Queues, OrderCancelledEvent } from '@aneebell/common-module';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  queue: Queues.OrderCancelled = Queues.OrderCancelled; 
}