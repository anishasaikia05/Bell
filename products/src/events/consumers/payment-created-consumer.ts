import { Queues, PaymentCreatedEvent, Consumer, NotFoundError, OrderStatus } from "@aneebell/common-module";
import { Channel } from "amqplib";
import { Order } from "../../models/order";
import { Product, ProductStatus } from "../../models/product";

export class PaymentCreatedConsumer extends Consumer<PaymentCreatedEvent> {
  queue: Queues.PaymentCreated = Queues.PaymentCreated;

  async onMessage(data: PaymentCreatedEvent['data'], channel: Channel) {
      const order = await Order.findById(data.orderId);

      if(!order) {
        throw new Error('Order not found');
      }
 
      order.set({ status: OrderStatus.Complete });
      await order.save();

      const product = await Product.findById(order.productId);

      if(product) {
        product.set({ status: ProductStatus.Sold });
        await product.save();
      }

  }
}