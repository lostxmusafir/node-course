import mongoose from 'mongoose';

export type Restaurant = {
  name: string;
  image: string;
  location: {
    type: string;
    coordinates: number[];
  };
  address: string;
  city_id: mongoose.Types.ObjectId;
  category_id: mongoose.Types.ObjectId;
  status: string;
};

const restaurantSchema = new mongoose.Schema<Restaurant>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    address: {
      type: String,
      required: true,
    },
    city_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
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

restaurantSchema.index({ location: '2dsphere' });

export const RestaurantModel = mongoose.model<Restaurant>('Restaurant', restaurantSchema);
