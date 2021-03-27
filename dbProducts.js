import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
	product_category: Array,
	product_description: String,
	product_name: String,
	product_price: String,
	product_rating: String,
	ImageURLOne: Object,
	ImageURLTwo: Object,
	ImageURLThree: Object,
	ImageURLFour: Object,
	ImageURLFive: Object,
	status: String,
});

export default mongoose.model('products', productSchema);
