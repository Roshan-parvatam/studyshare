import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content?: string;
  subject?: string;
  isPublic: boolean;
  sharedWith: mongoose.Types.ObjectId[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    trim: true,
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },
  subject: {
    type: String,
    trim: true,
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }]
}, {
  timestamps: true
});

NoteSchema.index({ userId: 1, isPublic: 1 });
NoteSchema.index({ sharedWith: 1 });
NoteSchema.index({ subject: 1 });
NoteSchema.index({ tags: 1 });

export default mongoose.model<INote>('Note', NoteSchema);

