const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
//const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
}, async (accessToken, refreshToken, profile, done) => {
    // try {
    //     let user = await User.findOne({ googleId: profile.id });
        
    //     if (!user) {
    //         user = new User({
    //             googleId: profile.id,
    //             displayName: profile.displayName,
    //             email: profile.emails[0].value
    //         });
    //         await user.save();
    //     }
    //     done(null, user);
    // } catch (err) {
    //     done(err);
    // }
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user); 
});
passport.deserializeUser( (user, done) => {
    // try {
    //     const user = await User.findById(id);
    //     done(null, user);
    // } catch (err) {
    //     done(err);
    // }
    done(null, user);
});

module.exports = passport;