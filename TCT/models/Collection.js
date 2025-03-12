import { Schema, model } from 'mongoose';

const CollectionSchema = new Schema({
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    cards: [{
        _id: { type: Schema.Types.ObjectId, auto: true },
        id: { type: String, required: true },
        name: { type: String, required: true },
        set: { type: Object },
        images: { type: Object },
        cardmarket: { type: Object }
    }],
    createdAt: { type: Date, default: Date.now },
});


const Collection = model('Collection', CollectionSchema);

export default Collection;