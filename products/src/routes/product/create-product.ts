import express, { Request, Response} from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@aneebell/common-module';
import { Product } from '../../models/product';
import { upload } from '../../utils/multer';
import { cloudinary } from '../../utils/cloudinary';

const router = express.Router();

router.post('/api/products', requireAuth, upload.single('image'), [
  body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0'),
  body('image')
    .custom((value, {req}) => {
            if(req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/jpg' || req.file.mimetype === 'image/png'){
                return req.file.mimetype;
            }
            return false; 
    })
    .withMessage('Please submit jpg/jpeg/png images.'), 
], validateRequest, 
async (req: Request, res: Response) => {
  const { title, price } = req.body;
  const img = await cloudinary.v2.uploader.upload(req.file!.path);  

  const product = Product.build({
    title,
    price,
    userId: req.currentUser!.id,
    image: {
      avatar: img.secure_url,
      cloudinary_id: img.public_id,
    },
    status: 'available'
  });
  await product.save();

  res.status(201).send(product);
});

export { router as createProductRouter };