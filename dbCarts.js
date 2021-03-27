import mongoose from 'mongoose';
const CartSchema = new mongoose.Schema({
	product: Object,
	productId: String,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users', //reference to user model
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export default mongoose.model('cart', CartSchema);
