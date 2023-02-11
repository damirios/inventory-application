const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ColorSchema = new Schema({
    title: {type: String, required: true}
});

ColorSchema.virtual("url").get(function() {
    return `/catalog/color/${this._id}`;
});

module.exports = mongoose.model("Color", ColorSchema);