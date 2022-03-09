import { currentUser, NotFoundError, requireAuth, validateRequest, OrderStatus, BadRequestError } from "@aneebell/common-module";
import express, { Request, Response } from "express";
import { Order } from "../../models/order";
import { Product, ProductStatus } from "../../models/product";
import { OrderCreatedPublisher } from '../../events/publishers/order-created-publisher';
import { rabbitmqWrapper } from '../../rabbitmq-wrapper';
import { param } from "express-validator";

const router = express.Router();

router.post('/api/orders/:productId', requireAuth,
  [
    param('productId')
    .isMongoId()
    .withMessage('Provide a valid Id')
  ], 
  validateRequest,
  async (req: Request, res: Response) => {

    const product = await Product.findById(req.params.productId);

    if(!product) {
      throw new Error('Product not found');
    }
   
    if(product.userId === req.currentUser!.id) {
      throw new BadRequestError('Order cannot be fulfilled');
    }

    if(product.status !== ProductStatus.Available) {
      throw new BadRequestError('Order is reserved');
    }

    const order = Order.build({
      productId: req.params.productId,
      userId: req.currentUser!.id,
      price: product.price,
      status: OrderStatus.AwaitingPayment
    });

    await order.save();

    await new OrderCreatedPublisher(rabbitmqWrapper.client).publish({
      id: order.id,
      userId: order.userId,
      price: order.price,
      status: order.status
    });

    product.set({
        status: ProductStatus.Reserved
      });

    await product.save();

    res.status(201).send(order);

  }
);

export { router as createOrderRouter };