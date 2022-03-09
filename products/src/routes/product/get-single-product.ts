import { NotFoundError, validateRequest } from '@aneebell/common-module';
import express, { Request, Response} from 'express';
import { Product } from '../../models/product';
import { param } from 'express-validator';

const router = express.Router();

router.get('/api/products/:id', 
  param('id')
    .isMongoId()
    .withMessage('Provide a valid Id'),
  validateRequest,
  async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new NotFoundError();
  }

  res.send(product);
});

export { router as getProductRouter };