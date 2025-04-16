import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  code: string;
  name: string;
  size?: string;
  category?: string;
  price: number;
  cost?: number;
  description?: string;
  created_at: Date;
  updated_at?: Date;
}

const ProductSchema: Schema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  size: {
    type: String
  },
  category: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  cost: {
    type: Number
  },
  description: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }
});

// Add text index for searching
ProductSchema.index({ name: 'text', code: 'text', category: 'text' });

// Avoid duplicate model compilation in development
const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product; 