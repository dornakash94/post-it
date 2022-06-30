import mongoose from "mongoose";

interface CounterDto {
  _id: string;
  seq: number;
}

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const counter = mongoose.model<CounterDto>("Counter", counterSchema);

export const generateId = (name: string): Promise<number> => {
  return counter
    .findByIdAndUpdate(
      { _id: name },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    )
    .then((res: CounterDto) => res.seq);
};
