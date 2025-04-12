const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

// Check that required env variables are provided.
if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET || !process.env.CALLBACK_URL) {
  throw new Error('Missing required OAuth environment variables. Please check GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and CALLBACK_URL.');
}

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL, // This should be set to the production callback (https://.../auth/github/callback) on Render
  scope: ['user:email'],
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  req.session.authProfile = profile;
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  done(null, { id });
});

module.exports = passport;
