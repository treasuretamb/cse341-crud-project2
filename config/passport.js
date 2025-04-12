const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

// Debugging check
console.log('GitHub Client ID:', process.env.GITHUB_CLIENT_ID ? '***' : 'MISSING');
console.log('Callback URL:', process.env.CALLBACK_URL || 'Not set');

// Throw error if missing
if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  throw new Error('GitHub OAuth credentials missing!');
}

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  try {
    if (req.query.state) profile.state = req.query.state;
    return done(null, profile);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;