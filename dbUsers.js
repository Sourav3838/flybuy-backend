import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  password: Number,
  username: String,
});
// here users is the name of the collection(table)
//rows and col are known as documents and table is know as collection
export default mongoose.model("users", userSchema);
