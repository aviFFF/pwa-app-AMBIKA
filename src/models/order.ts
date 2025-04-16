import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product_id: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  discount?: number;
  total: number;
}

export interface IOrder extends Document {
  order_number: string;
  customer_name?: string;
  customer_contact?: string;
  vendor_id?: mongoose.Types.ObjectId;
  status: string;
  items: IOrderItem[];
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  notes?: string;
  created_by: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at?: Date;
}

const OrderItemSchema: Schema = new Schema({
  product_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product',
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  discount: { 
    type: Number, 
    default: 0 
  },
  total: { 
    type: Number, 
    required: true 
  }
});

const OrderSchema: Schema = new Schema({
  order_number: { 
    type: String, 
    required: true,
    unique: true 
  },
  customer_name: { 
    type: String 
  },
  customer_contact: { 
    type: String 
  },
  vendor_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'Vendor' 
  },
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'completed', 'cancelled']
  },
  items: [OrderItemSchema],
  subtotal: { 
    type: Number, 
    required: true 
  },
  tax: { 
    type: Number, 
    default: 0 
  },
  discount: { 
    type: Number, 
    default: 0 
  },
  total: { 
    type: Number, 
    required: true 
  },
  notes: { 
    type: String 
  },
  created_by: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date 
  }
});

// Create index on order number for faster searches
OrderSchema.index({ order_number: 1 });

// Avoid duplicate model compilation in development
const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order; 