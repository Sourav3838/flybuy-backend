import mongoose from 'mongoose';
const OrderSchema = new mongoose.Schema({
	userId: String,
	paymentId: String,
	productsList: Array,
	amount: Number,
	status: String,
	admin_status_comment: String,
	category: String,
	category_comment: String,
	category_success_rate: String,
	location: String,
	latitude: String,
	longitude: String,
	is_delivered: String,
	user_comment: String,
	action_by_admin: {
		type: Date,
		default: Date.now,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model('order', OrderSchema);
