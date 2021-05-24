import mongoose from 'mongoose';
const QuerySchema = new mongoose.Schema({
	userId: String,
	query: Object,
	status: String,
	admin_comment: String,
});

export default mongoose.model('query', QuerySchema);
