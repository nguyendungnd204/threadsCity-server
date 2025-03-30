const passport = require('passport');

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleAuthCallback = passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/'
});

exports.facebookAuth = passport.authenticate('facebook', { scope: ['email'] });

exports.facebookAuthCallback = passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/'
});

exports.logout = (req, res) => {
    req.logout(err => {
        if (err) { 
            return res.status(500).json({ message: "Logout failed" }); 
        }
        res.redirect('/');
    });
};