require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const cors = require('cors');
const path = require('path');
const MongoStore = require('connect-mongo');
const contactsRoutes = require('./routes/contacts');
const productsRoutes = require('./routes/products');
const swaggerRoutes = require('./routes/swagger');
const mongodb = require('./data/database');

const app = express();
const port = process.env.PORT || 3000;

// Database connection
mongodb.initDb((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
});

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? 'https://cse341-crud-project2-u5wz.onrender.com'
    : 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/contacts', contactsRoutes);
app.use('/api/products', productsRoutes);
app.use('/docs', swaggerRoutes);

// Authentication routes
app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/docs' }),
  (req, res) => {
    req.session.save(() => res.redirect('/docs'));
  }
);

app.get('/auth/status', (req, res) => {
  res.json({
    authenticated: req.isAuthenticated(),
    user: req.user || null
  });
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.redirect('/');
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Server start
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Root redirect
app.get('/', (req, res) => res.redirect('/docs'));