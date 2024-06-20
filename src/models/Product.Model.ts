import mongoose, { Schema } from "mongoose";


interface ProductSchema extends Document{
    id: number,
    title: string,
    price: number,
    description: string,
    category: string,
    image: string,
    sold: boolean,
    dateOfSale: string
}


const productSchema: Schema<ProductSchema> = new Schema<ProductSchema>({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    sold: { type: Boolean, default: false },
    dateOfSale: { type: String, required: true },
});


export default mongoose.models.PRODUCT || mongoose.model<ProductSchema>("Product", productSchema);