import mongoose from 'mongoose';

export type Category = {
  name: string;
  image: string;
  status: string;
};

const categorySchema = new mongoose.Schema<Category>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'active',
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

export const CategoryModel = mongoose.model<Category>('Category', categorySchema);
