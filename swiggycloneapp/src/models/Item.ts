import mongoose from 'mongoose';

export type Item = {
  restaurant_id: mongoose.Types.ObjectId;
  category_id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  image: string;
  price: number;
  veg: boolean;
  status: boolean;
};

const itemSchema = new mongoose.Schema<Item>(
  {
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    veg: {
      type: Boolean,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export const ItemModel = mongoose.model<Item>('Item', itemSchema);
