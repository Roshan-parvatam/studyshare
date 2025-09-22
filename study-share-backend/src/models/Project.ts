import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description?: string;
  members: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  status: 'active' | 'completed' | 'archived';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [200, 'Project name cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Created by user is required'],
    index: true
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['active', 'completed', 'archived'],
      message: 'Status must be active, completed, or archived'
    },
    default: 'active'
  },
  dueDate: {
    type: Date,
  }
}, {
  timestamps: true
});

ProjectSchema.index({ createdBy: 1, status: 1 });
ProjectSchema.index({ members: 1, status: 1 });
ProjectSchema.index({ dueDate: 1 });

export default mongoose.model<IProject>('Project', ProjectSchema);

