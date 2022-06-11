import redis from 'redis';
import JWTR from 'jwt-redis';

import User from '../models/user.js';
import { getQueryByField, OPERATORS } from '../utils/query.js';

const jwtr = new JWTR.default(
    redis.createClient({
        port: '15530',
        username: 'default',
        password: '0DExjB3pqX6PI962oHGdppLGnn8cFiSp',
        host: 'redis-15530.c9.us-east-1-4.ec2.cloud.redislabs.com',
    })
);

export const getUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        let user = await User.findOne({ _id: id }).exec();

        if (!user) res.status(422).json({ message: 'User not found' });

        user = user.toObject();
        delete user.password;

        res.json({ user });
    } catch (e) {
        next(e);
    }
};

export const loginUser = (req, res, next) => {
    const { email, password } = req.body;

    User.findOne({ email }, (err, user) => {
        if (err) return next(err);

        if (!user) return res.status(422).json({ message: 'Email or password is not correct!' });

        user.comparePassword(password, (err, isMatch) => {
            if (err)
                return res.status(500).json({ message: 'Something went wrong, please try again' });

            if (!isMatch)
                return res.status(422).json({ message: 'Email or password is not correct!' });

            jwtr.sign({ email, wallet: user.wallet }, 'secret_key', {
                expiresIn: 60 * 120,
            })
                .then((token) => {
                    user = user.toObject();
                    delete user.password;

                    return res.json({
                        message: 'Login success',
                        user,
                        token,
                    });
                })
                .catch(() => {
                    return res
                        .status(500)
                        .json({ message: 'Something went wrong, please try again' });
                });
        });
    });
};

export const deleteUser = async (req, res, next) => {
    try {
        const { wallet } = req.params;

        const user = await User.findOne({ wallet }).exec();

        if (!user) return res.status(422).json({ message: 'User not found' });

        await User.deleteOne({ wallet }).exec();

        res.json({ user });
    } catch (e) {
        next(e);
    }
};

export const logoutUser = (req, res) => {
    if (req.headers.authorization) {
        jwtr.destroy(req.headers.authorization.replace('JWT ', '')).finally(() => {
            req.logout();
            res.json({ message: 'Success' });
        });
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const user = req.body;

        if (!user._id) return res.status(400).send({ message: 'User ID is missed.' });

        if (user.name) {
            const existingUser = await User.findOne({ name: user.name });
            if (user._id !== existingUser._id) {
                res.status(400).send({
                    message: 'This username is already in use. Please try another one.',
                });
            }
        }

        delete user.email;
        delete user.wallet;
        delete user.password;

        const filter = { _id: getQueryByField(OPERATORS.EQ, user._id) };

        await User.findOneAndUpdate(filter, user);

        let newUser = await User.findOne(filter);

        newUser = newUser.toObject();
        delete newUser.password;

        res.json({ message: 'User updated successfully!', user: newUser });
    } catch (e) {
        next(e);
    }
};

export const registerUser = (req, res, next) => {
    try {
        const {
            name,
            email,
            avatar,
            banner,
            wallet,
            twitter,
            password,
            instagram,
            portfolio,
            description,
        } = req.body;

        if (!name || !email || !wallet) {
            return res.status(422).send({
                message: 'The name, e-mail and wallet address should be valid.',
            });
        }

        User.findOne({ email }, (emailErr, existingEmailUser) => {
            if (emailErr) return next(emailErr);

            if (existingEmailUser) {
                return res.status(422).send({ message: 'This email is already in use.' });
            }

            User.findOne({ wallet }, (walletErr, existingWalletUser) => {
                if (walletErr) return next(walletErr);

                if (existingWalletUser) {
                    return res
                        .status(422)
                        .send({ message: 'This wallet address is already in use.' });
                }

                User.findOne({ name }, (nameErr, existingNameUser) => {
                    if (nameErr) return next(nameErr);

                    if (existingNameUser) {
                        return res
                            .status(422)
                            .send({ message: 'This user name is already in use.' });
                    }

                    const user = new User({
                        name,
                        email,
                        wallet,
                        password,
                        avatar: avatar ?? '',
                        banner: banner ?? '',
                        twitter: twitter ?? '',
                        portfolio: portfolio ?? '',
                        instagram: instagram ?? '',
                        description: description ?? '',
                    });

                    user.save((err) => {
                        if (err) return next(err);

                        const userInfo = {
                            name,
                            email,
                            avatar,
                            banner,
                            wallet,
                            twitter,
                            instagram,
                            portfolio,
                            description,
                        };
                        res.json({ message: 'Register success!', user: userInfo });
                    });
                });
            });
        });
    } catch (error) {
        console.error(error);
    }
};
