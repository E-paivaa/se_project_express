const mongoose = require('mongoose');
const validator = require('validator');

const clothingItemSchema = mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Name Input Required'],
      minlength: 2,
      maxlength: 30,
    },
    weather: {
        type: String,
        required: [true, 'Weather Input Required'],
        enum: ["hot", "warm", "cold"],
      },
    imageUrl: {
      type: String,
      required: [true, 'ImageUrl Input Required'],
      validate: {
        validator(value) {
          return validator.isURL(value);
        },
        message: 'You must enter a valid URL',
      },},
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      likes: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
        default: [],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
  });

module.exports = mongoose.model('clothingItem', clothingItemSchema);
