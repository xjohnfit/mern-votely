import { Schema, Types, model } from 'mongoose';

const electionSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    voters: [{ type: Types.ObjectId, ref: 'Voter', default: [] }],
}, { timestamps: true });

const ElectionModel = model('Election', electionSchema);

export default ElectionModel;
