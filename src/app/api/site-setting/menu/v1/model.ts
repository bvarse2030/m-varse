import mongoose, { Schema } from 'mongoose'

const menuSchema = new Schema({
    "home": { type: String, },
    "about": { type: String, },
    "contact": { type: String, },
    "dashboard": { type: String, },
    "private": { type: String, },
    "public": { type: String, },
    "privacyPolicy": { type: String, },
    "termsAndCondition": { type: String, }
}, { timestamps: true })

export default mongoose.models.Menu || mongoose.model('Menu', menuSchema)
 
