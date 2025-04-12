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

// In production, trust the proxy so that secure cookies work behind the Render proxy.
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

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
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60, // 1 day
    autoRemove: 'native'
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true in production
    httpOnly: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000,
    domain: process.env.NODE_ENV === 'production'
      ? 'cse341-crud-project2-u5wz.onrender.com'
      : 'localhost'
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
  origin: [
    'https://cse341-crud-project2-u5wz.onrender.com',
    'http://localhost:3000'
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
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
    res.cookie('session_verified', 'true', {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      domain: 'cse341-crud-project2-u5wz.onrender.com'
    });
    req.session.save(() => res.redirect('/docs'));
  }
);

app.get('/auth/status', (req, res) => {
  res.json({
    authenticated: req.isAuthenticated(),
    user: req.user || null
  });
});

// Logout route
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

// Root redirect
app.get('/', (req, res) => res.redirect('/docs'));

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Session Store: ${sessionConfig.store.constructor.name}`);
});
