const templateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    exercises: [
      {
        name: String,
        sets: [
          {
            reps: Number,
            weight: Number,
          },
        ],
      },
    ],
  },
  { timestamps: true },
)
