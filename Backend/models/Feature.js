const mongoose = require('mongoose');

const FeatureSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,  // Ensure image field is required
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feature', FeatureSchema);
