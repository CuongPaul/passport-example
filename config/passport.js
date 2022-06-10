import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';

import User from '../models/user.js';

const jwtOptions = {
    secretOrKey: 'secret_key',
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
};

export default new JWTStrategy(jwtOptions, (payload, next) => {
    User.findOne({ email: payload.email }, (err, user) => {
        if (err) {
            return next(err, false);
        }

        if (user) {
            return next(null, user);
        } else {
            return next(null, false);
        }
    });
});
