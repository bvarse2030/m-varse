import mongoose, { Schema } from 'mongoose'

const aboutSchema = new Schema(
    {
        title: { type: String },
        description: { type: String },
        images: [{ type: String }],
        title1: { type: String },
        description1: { type: String },
        title2: { type: String },
        description2: { type: String },
        title3: { type: String },
        description3: { type: String },
    },
    { timestamps: true }
)

export default mongoose.models.About || mongoose.model('About', aboutSchema)
