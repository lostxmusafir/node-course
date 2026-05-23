import mongoose from 'mongoose';

export type City = {
  name: string;
  status: string;
};

const citySchema = new mongoose.Schema<City>(
  {
    name: {
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

export const CityModel = mongoose.model<City>('City', citySchema);
