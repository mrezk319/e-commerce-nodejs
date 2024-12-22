import mongoose, { Schema, Document } from "mongoose"

export interface userModelDocument extends Document {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}


const userSchema = new Schema<userModelDocument>({
    firstName: { type: String, },
    lastName: { type: String },
    email: { type: String },
    password: { type: String },
});


const userModel = mongoose.model<userModelDocument>('User',userSchema);
export default userModel;