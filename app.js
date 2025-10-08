import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import { engine } from 'express-handlebars';
import configRoutesFunction from './routes/index.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// View engine
app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

// Static
app.use(express.static(path.join(__dirname, '../public')));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions
app.use(
  session({
    name: 'AuthCookie',
    secret: process.env.SESSION_SECRET || 'ClashRoyale',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      dbName: process.env.DB_NAME || 'cr-deck-tracker',
      ttl: 24 * 60 * 60
    }),
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000
    }
  })
);


// Routes
configRoutesFunction(app);

// Start
app.listen(process.env.PORT || 3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
