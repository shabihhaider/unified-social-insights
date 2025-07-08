const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const UserModel = require('../../models/UserModel');
const jwt = require('jsonwebtoken');
const generateToken = require('../../utils/generateToken'); // ✅

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const providerId = profile.id;

        let user = await UserModel.findUserByProviderId('google', providerId);

        if (!user) {
          user = await UserModel.createUser({
            email,
            name,
            password: null,
            provider: 'google',
            providerId,
          });
        }

        // ✅ Attach JWT to user object
        const token = generateToken(user); // ✅ Includes role, full_name, etc.

        user.token = token;
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
