import mongoose from 'mongoose';

const cardSchema = mongoose.Schema({
	name: String,
	imgurl: String,
});
// here cards is the name of the collection(table)
//rows and col are known as documents and table is know as collection
export default mongoose.model('cards', cardSchema);
