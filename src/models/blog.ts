/**
 * node modules
 */
import { Schema, model, Types } from 'mongoose';

/**
 * custom modules
 */
import { genSlug } from '@/utils';
export interface IBlog {
  title: string;
  slug: string;
  content: string;
  banner: {
    publicId: string;
    url: string;
    width: number;
    height: number;
  };
  author: Types.ObjectId;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  status: 'draft' | 'published';
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      maxlength: [180, 'Title must be less than 180 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: [true, 'Slug must be unique'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    banner: {
      publicId: {
        type: String,
        required: [true, 'PublicId is required'],
      },
      url: {
        type: String,
        required: [true, 'Url is required'],
      },
      width: {
        type: Number,
        required: [true, 'Width is required'],
      },
      height: {
        type: Number,
        required: [true, 'Height is required'],
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published'],
        message: '{VALUE} is not supported',
      },
      default: 'draft',
    },
  },
  {
    timestamps: {
      createdAt: 'publishedAt',
    },
  },
);

blogSchema.pre('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = genSlug(this.title);
  }
  next();
});

export default model<IBlog>('Blog', blogSchema);
