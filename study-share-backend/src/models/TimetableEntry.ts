import mongoose, { Schema, Document } from 'mongoose';

export interface ITimetableEntry extends Document {
  userId: mongoose.Types.ObjectId;
  subject: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string;
  endTime: string;
  location?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TimetableEntrySchema = new Schema<ITimetableEntry>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [100, 'Subject cannot exceed 100 characters']
  },
  day: {
    type: String,
    required: [true, 'Day is required'],
    enum: {
      values: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      message: 'Day must be a weekday (Monday-Friday)'
    }
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  color: {
    type: String,
    trim: true,
    default: 'bg-gradient-primary'
  }
}, {
  timestamps: true
});

TimetableEntrySchema.index({ userId: 1, day: 1 });

export default mongoose.model<ITimetableEntry>('TimetableEntry', TimetableEntrySchema);

