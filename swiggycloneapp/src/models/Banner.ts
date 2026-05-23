import mongoose from 'mongoose';

export type Banner = {
  banner: string;
  status: boolean;
};

const bannerSchema = new mongoose.Schema<Banner>(
  {
    banner: {
      type: String,
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

export const BannerModel = mongoose.model<Banner>('Banner', bannerSchema);
