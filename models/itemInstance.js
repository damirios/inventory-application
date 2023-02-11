const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemInstanceSchema = new Schema({
    item: {type: Schema.Types.ObjectId, ref:"Item", required: true},
    status: {type: String, enum: ['Available', 'Not available'], required: true},
    color: {type: Schema.Types.ObjectId, ref: "Color", required: true}
});

ItemInstanceSchema.virtual('url').get(function() {
    return `/catalog/iteminstance/${this._id}`;
});

module.exports = mongoose.model("ItemInstance", ItemInstanceSchema);