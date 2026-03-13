const { default: mongoose } = require("mongoose");

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: trusted,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const City = mongoose.model("City", citySchema);
module.exports = City;
