import { Schema, model, Document, Types } from "mongoose";
import { Role } from "../../shared/enums/Role.enum";

export interface IOtp {
  codeHash: string;
  expiresAt: Date;
  attempts: number;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: Role;
  googleId?: string;
  avatar?: string;
  isEmailVerified: boolean;
  otp?: IOtp;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
  },
  { _id: false },
);

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
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
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.PATIENT,
    },
    googleId: {
      type: String,
      select: false,
    },
    avatar: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: otpSchema,
      select: false,
    },
  },
  { timestamps: true },
);

export const UserModel = model<IUser>("User", userSchema);
