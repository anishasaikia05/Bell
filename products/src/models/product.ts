import mongoose from "mongoose";

enum ProductStatus {
  Available = 'available',
  Reserved = 'reserved',
  Sold = 'sold',
  NotAvailable = 'not-available',
}

export { ProductStatus };

interface Image {
  avatar: string;
  cloudinary_id: string;
}

interface ProductAttrs {
  title: string;
  price: number;
  userId: string;
  image: Image;
  status: string;
}

interface ProductDoc extends mongoose.Document {
  title: string; 
  price: number;
  userId: string;
  image: Image;
  status: string;
}

interface ProductModel  extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

const imageSchema = new mongoose.Schema({
  avatar: {
    type: String,
    required: true
  },
  cloudinary_id: {
    type: String,
    required: true
  }
});

const productSchema = new mongoose.Schema({
  title: {
    type: String, 
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  image: imageSchema,
  status: {
    type: String,
    required: true,
    enum: Object.values(ProductStatus),
    default: ProductStatus.Available,
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs);
}

const Product = mongoose.model<ProductDoc, ProductModel>('Product', productSchema);

export { Product };