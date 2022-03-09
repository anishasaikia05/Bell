import { requireAuth } from "@aneebell/common-module";
import express, { Request, Response } from "express";
import { Order } from "../../models/order";

const router = express.Router();

router.get('/api/orders', requireAuth,
  async(req: Request, res: Response) => {
    const orders = await Order.find({'userId': {$in: [req.currentUser!.id]}});

    res.status(200).send(orders);
  })

  export { router as getAllOrdersRouter };