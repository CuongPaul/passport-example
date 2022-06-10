import cors from 'cors';
import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';

import useRouter from './routes/user.js';
import connectDB from './config/mongoose.js';
import jwtStrategy from './config/passport.js';

connectDB();
passport.use(jwtStrategy);

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use(useRouter);

app.listen(3000, () => console.log(`Server is running at port 3000`));
