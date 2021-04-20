import mongoose from 'mongoose';
const QuerySchema = new mongoose.Schema({
	userId: String,
	query: Object,
});

export default mongoose.model('query', QuerySchema);
