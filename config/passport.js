const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const authService = require('../services/auth.service');

passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID ,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
}, authService.googleAuthCallback));

passport.use('facebook', new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID ,
    clientSecret: process.env.FACEBOOK_APP_SECRET ,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'emails', 'photos'],
    scope: ['email', 'public_profile'],
    enableProof: true
}, authService.facebookAuthCallback));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(authService.deserializeUser);

module.exports = passport;