import express, { Request, Response} from 'express';
import { Product, ProductStatus } from '../../models/product';

const router = express.Router();

router.get('/api/products', async (req: Request, res: Response) => {
  console.log('Hello from product service');
  const products = await Product.find({});
  // console.log('Products from server here: ', products);
  // { status: ProductStatus.Available }

  res.send(products); 
});

export { router as getAllProductRouter };  