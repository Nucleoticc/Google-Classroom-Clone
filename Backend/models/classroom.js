import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const classroomSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    teachers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    assignments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Assignment'
      }
    ],
    announcements: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Announcement'
      }
    ],
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    refcode: {
      type: String,
      required: true,
      unique: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Classroom', classroomSchema);
