const { default: mongoose } = require("mongoose");

const tourDestinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    bestTimeToVisit: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    location: {
      type: String,
      required: true,
    },
    entryInfo: {
      fee: {
        type: Number,
        required: true,
        trim: true,
      },
      timings: {
        type: String,
        required: true,
        trim: true,
      },
    },
    images: [
      {
        url: {
          type: String,
          required: true,
          trim: true,
        },
        altText: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const TourDestination = mongoose.model(
  "TourDestination",
  tourDestinationSchema,
);
module.exports = TourDestination;
