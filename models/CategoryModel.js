import mongoose from "mongoose";

const {Schema} = mongoose

const CategorySchema = new Schema({
  name: {type: String, required: true, unique: true},
})

const Category = mongoose.model("Category", CategorySchema)


export default Category