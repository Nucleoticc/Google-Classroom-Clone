import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const assignmentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    class: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Classroom'
    },
    attachmentUrls: [
        {
            type: String,
            required: false
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    dueDate: {
        type: Date,
        required: false
    }
}, { timestamps: true });

export default mongoose.model('Assignment', assignmentSchema);