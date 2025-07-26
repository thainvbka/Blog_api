/**
 * node modules
 */
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  firstName?: string;
  lastName?: string;
  socialLink?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: String;
    x?: string;
    youtube?: string;
  };
}

/**
 * user schema
 */
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      maxlength: [20, 'Username must be less than 20 characters'],
      unique: [true, 'Username must be unique'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      maxlength: [50, 'Email must be less than 50 characters'],
      unique: [true, 'Email must be unique'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, //khi truy vấn User, sẽ không lấy password ra trừ khi dùng .select('+password')
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['admin', 'user'],
        message: '{VALUE} is not supported',
      },
      default: 'user',
    },
    firstName: {
      type: String,
      maxlength: [20, 'Firstname must be less than 20 charectors'],
    },
    lastName: {
      type: String,
      maxlength: [20, 'Lastname must be less than 20 charectors'],
    },
    socialLink: {
      website: {
        type: String,
        maxlength: [100, 'Website address must be less than 100 charectors'],
      },
      facebook: {
        type: String,
        maxlength: [
          100,
          'Facebook profile url must be less than 100 charectors',
        ],
      },
      instagram: {
        type: String,
        maxlength: [
          100,
          'Instagram profile url must be less than 100 charectors',
        ],
      },
      linkedin: {
        type: String,
        maxlength: [
          100,
          'Linkedin profile url must be less than 100 charectors',
        ],
      },
      x: {
        type: String,
        maxlength: [100, 'X profile url must be less than 100 charectors'],
      },
      youtube: {
        type: String,
        maxlength: [100, 'Youtube must be less than 100 charectors'],
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  // Nếu mật khẩu không đổi thì bỏ qua
  if (!this.isModified('password')) {
    next();
    return;
  }

  //hass password
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default model<IUser>('User', userSchema);
