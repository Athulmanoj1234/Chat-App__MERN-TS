import mongoose, {Document} from "mongoose";

const { Schema, model } = mongoose;

interface Iuser extends Document  {
    username: string,
    email: string,
    password: string
}

const userSchema = new mongoose.Schema<Iuser>({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

const userModel = mongoose.model<Iuser>('users', userSchema);

export default userModel;