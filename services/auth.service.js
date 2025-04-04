const User = require('../models/user.model');

class  AuthService {
    async googleAuthCallback(request, accessToken, refreshToken, profile, done) {
        try {
            let user = await User.findOne({ email: profile.emails[0].value });
            if (!user) {
                user = new User({
                    fullname: profile.displayName,
                    oauthId: profile.id,
                    oauthProvider: profile.provider, 
                    email: profile.emails[0].value,
                    profile: { profilePhoto: profile.photos[0]?.value || '' }
                });
                await user.save();
            }
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }

    async facebookAuthCallback(accessToken, refreshToken, profile, done) {
        try {
            // let identifier;
            let email = profile.emails?.[0]?.value;
            let phone = profile.phone;
    
            if (!email && !phone) {
                return done(new Error('Facebook account must have either email or phone number'), null);
            }
    
            let user = await User.findOne({
                $or: [
                    { email },
                    { phone },
                    { oauthId: profile.id }
                ].filter(Boolean)
            });
    
            if (!user) {
                user = new User({
                    fullname: profile.displayName,
                    ...(email && { email }),
                    ...(phone && { phone }),
                    oauthId: profile.id,
                    oauthProvider: profile.provider,
                    profile: { profilePhoto: profile.photos[0]?.value || '' }
                });
                await user.save();
            } else {
                if (email && !user.email) user.email = email;
                if (phone && !user.phone) user.phone = phone;
                if (profile.photos[0]?.value && !user.profile?.profilePhoto) {
                    user.profile.profilePhoto = profile.photos[0].value;
                }
                await user.save();
            }
            
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }

    async deserializeUser(id, done) {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    }
};
module.exports = new AuthService();