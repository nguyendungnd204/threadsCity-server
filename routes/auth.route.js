const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/', failureMessage: true }),
    (req, res) => res.redirect('/profile')
);

//router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// //router.get('/facebook/callback',
//     passport.authenticate('facebook', { failureRedirect: '/login' }),
//     (req, res) => res.redirect('/profile')
// );

// Logout
router.get('/logout', (req, res) => {
    req.logout(() => res.redirect('/'));
});

module.exports = router;