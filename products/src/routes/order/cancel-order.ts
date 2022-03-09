import { currentUser, NotAuthorizedError, NotFoundError, requireAuth, validateRequest, OrderStatus, BadRequestError } from "@aneebell/common-module";
import express, { Request, Response } from "express";
import { param } from "express-validator";
import { OrderCancelledPublisher } from "../../events/publishers/order-cancelled-publisher";
import { Order } from "../../models/order";
import { Product, ProductStatus } from "../../models/product";
import { rabbitmqWrapper } from "../../rabbitmq-wrapper";

const router = express.Router();

router.post('/api/orders/:id/cancelOrder', requireAuth,
  [
    param('id') 
    .isMongoId()
    .withMessage('Provide a valid Id')
  ], 
  validateRequest,
  async (req: Request, res: Response) => {

    const order = await Order.findById(req.params.id);

    if(!order) {
      throw new Error('Order not found');
    }
 
    if(req.currentUser!.id != order.userId) {
      throw new NotAuthorizedError();
    }

    if(order.status === OrderStatus.Complete) {
      throw new BadRequestError('Order is already paid for.');
    }

    if(order.status !== OrderStatus.AwaitingPayment) {
      throw new BadRequestError('Order is not currently active');
    }

    order.set({
        status: OrderStatus.Cancelled
    });
    
    await order.save();
    
    const product = await Product.findById(order.productId);

    if(product) {
      product!.set({
        status: ProductStatus.Available
      });

      await product.save();
    }
    
    await new OrderCancelledPublisher(rabbitmqWrapper.client).publish({
      id: order.id
    })

    res.status(200).send(order);

  }
);

export { router as cancelOrderRouter };

