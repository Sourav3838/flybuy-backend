import mongoose from 'mongoose';

const commentSchema = mongoose.Schema({
	prodId: String,
	userId: String,
	userInitials: String,
	rating: String,
	comments: String,
});

export default mongoose.model('comments', commentSchema);
