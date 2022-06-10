import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/passport-example', {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('DB is connected');
    } catch (error) {
        console.error(error);
    }
};

export default connectDB;
