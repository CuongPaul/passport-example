import { Strategy, ExtractJwt } from 'passport-jwt';

import User from '../models/user.js';

const jwtOptions = {
    secretOrKey: 'secret_key',
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

export default new Strategy(jwtOptions, async (jwt_payload, done) => {
    const user = await User.findOne({ email: jwt_payload.email });

    if (user) {
        done(null, user);
    } else {
        done(null, false);
    }
});
