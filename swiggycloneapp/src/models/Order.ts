import mongoose from 'mongoose';

export type Order = {
  user_id: mongoose.Types.ObjectId;
  restaurant_id: mongoose.Types.ObjectId;
  items: Array<{
    item_id: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }>;
  total: number;
  address: string;
  status: string;
};

const orderSchema = new mongoose.Schema<Order>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    items: [
      {
        item_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Item',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'placed', // placed, confirmed, delivered, cancelled
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export const OrderModel = mongoose.model<Order>('Order', orderSchema);
