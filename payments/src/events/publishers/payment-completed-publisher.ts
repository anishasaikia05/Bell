import { Queues, PaymentCreatedEvent, Publisher } from "@aneebell/common-module";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  queue: Queues.PaymentCreated = Queues.PaymentCreated;
}