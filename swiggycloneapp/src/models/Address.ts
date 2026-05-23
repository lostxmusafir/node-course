import mongoose from 'mongoose';

export type Address = {
  user_id: mongoose.Types.ObjectId;
  title: string;
  address: string;
  landmark: string;
  house_no: string;
  lat: number;
  lng: number;
  status: string;
};

const addressSchema = new mongoose.Schema<Address>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    landmark: {
      type: String,
      required: true,
    },
    house_no: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
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

export const AddressModel = mongoose.model<Address>('Address', addressSchema);
