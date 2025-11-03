import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import { PLAN_TYPES } from '../constants/plans.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    plan: {
      type: String,
      enum: Object.values(PLAN_TYPES),
      default: PLAN_TYPES.FREE,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      transform: (_, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
