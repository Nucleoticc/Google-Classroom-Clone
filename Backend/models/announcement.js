import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const announcementSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    class: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Classroom'
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    attachmentUrl: {
        type: Array,
        required: false
    }
}, { timestamps: true });

export default mongoose.model('Announcement', announcementSchema);