import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
    {
        avatar: { type: String },
        banner: { type: String },
        twitter: { type: String },
        password: { type: String },
        portfolio: { type: String },
        instagram: { type: String },
        description: { type: String },
        name: { type: String, unique: true, required: true },
        email: { type: String, unique: true, required: true },
        wallet: { type: String, unique: true, required: true },
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', function (next) {
    const user = this;
    const saltRounds = 10;

    if (!user.isModified('password')) {
        return next;
    } else {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
                return next(err);
            } else {
                bcrypt.hash(user.password, salt, (err, hash) => {
                    if (err) {
                        return next(err);
                    } else {
                        user.password = hash;
                        next();
                    }
                });
            }
        });
    }
});

userSchema.methods.comparePassword = function (loginPassword, cb) {
    bcrypt.compare(loginPassword, this.password, (err, isMatch) => {
        if (err) {
            return cb(err);
        } else {
            cb(null, isMatch);
        }
    });
};

export default mongoose.model('User', userSchema);
