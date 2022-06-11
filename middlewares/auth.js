import passport from 'passport';

const auth = passport.authenticate('jwt', { session: false, failWithError: true });

export default auth;
