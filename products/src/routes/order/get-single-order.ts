import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from "@aneebell/common-module";
import express, { Request, Response } from "express";
import { param } from "express-validator";
import { Order } from "../../models/order";

const router = express.Router();

router.get('/api/orders/:id', requireAuth,
  [
    param('id')
    .isMongoId()
    .withMessage('Provide a valid Id')
  ], 
  validateRequest,
  async(req: Request, res: Response) => {

    const order = await Order.findById(req.params.id);

    if(!order) {
      throw new NotFoundError();
    }

    if(order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    
    res.status(200).send(order);
  })

  export { router as getOrderRouter };