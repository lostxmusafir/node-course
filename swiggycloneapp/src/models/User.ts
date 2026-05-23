import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export type User = {
  name: string;
  email: string;
  phone: string;
  password: string;
  type: string;
  status: string;
  verification_token: number;
  verification_token_time: Date;
  email_verified: boolean;
  reset_password_token?: string;
  reset_password_token_time?: Date;
};

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    verification_token: {
      type: Number,
      required: true,
    },
    verification_token_time: {
      type: Date,
      required: true,
    },
    email_verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    reset_password_token: {
      type: String,
      required: false,
    },
    reset_password_token_time: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  // Check if it's already a bcrypt hash
  const isHashed = /^\$2[aby]\$.{56}$/.test(this.password);
  if (isHashed) {
    return;
  }

  this.password = await bcrypt.hash(
    this.password,
    10
  );
});

export const UserModel = mongoose.model<User>('User', userSchema);
