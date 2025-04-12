const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
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