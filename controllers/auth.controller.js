const passport = require('passport');
const jwt = require('jsonwebtoken');

// Lưu trữ redirect_uri khi bắt đầu quá trình xác thực
exports.googleAuth = (req, res, next) => {
  // Lưu redirect_uri vào session để sử dụng trong callback
  const redirectUri = req.query.redirect_uri;
  if (redirectUri) {
    req.session.redirectUri = redirectUri;
    console.log("Stored redirectUri in session:", redirectUri);
  } else {
    console.warn("No redirect_uri provided in Google auth request");
  }
  
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err || !user) {
      console.error('Google auth error:', err, info);
      // Cố gắng redirect về trang lỗi của client nếu có thể
      const errorRedirectUri = req.session.redirectUri ? `${req.session.redirectUri}?error=AuthenticationFailed` : '/login?error=AuthenticationFailed';
      delete req.session.redirectUri; // Xóa khỏi session
      return res.redirect(errorRedirectUri); 
    }
    
    try {
      // Tạo JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || 'your-jwt-secret',
        { expiresIn: '7d' }
      );
      
      // Lấy redirect_uri từ session
      const redirectUri = req.session.redirectUri;
      console.log("Retrieved redirectUri from session:", redirectUri);
      
      if (redirectUri) {
        // Xóa redirectUri khỏi session sau khi sử dụng
        delete req.session.redirectUri;
        
        // Redirect về app với token
        const separator = redirectUri.includes('?') ? '&' : '?';
        const finalRedirectUrl = `${redirectUri}${separator}token=${token}`;
        console.log("Redirecting to:", finalRedirectUrl);
        
        return res.redirect(finalRedirectUrl);
      } else {
        // Nếu không có redirect_uri, đây là trường hợp không mong muốn
        // Có thể trả về lỗi hoặc một trang mặc định
        console.error("Missing redirectUri in session during Google callback");
        return res.status(400).json({ success: false, message: "Missing redirect URI" });
      }
    } catch (error) {
      console.error('Error creating JWT or redirecting in Google callback:', error);
      const errorRedirectUri = req.session.redirectUri ? `${req.session.redirectUri}?error=ServerError` : '/login?error=ServerError';
      delete req.session.redirectUri; // Xóa khỏi session
      return res.redirect(errorRedirectUri);
    }
  })(req, res, next);
};

// Lưu trữ redirect_uri khi bắt đầu quá trình xác thực
exports.facebookAuth = (req, res, next) => {
  // Lưu redirect_uri vào session để sử dụng trong callback
  const redirectUri = req.query.redirect_uri;
  if (redirectUri) {
    req.session.redirectUri = redirectUri;
    console.log("Stored redirectUri in session:", redirectUri);
  } else {
    console.warn("No redirect_uri provided in Facebook auth request");
  }
  
  passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
};

exports.facebookAuthCallback = (req, res, next) => {
  passport.authenticate('facebook', { session: false }, (err, user, info) => {
    if (err || !user) {
      console.error('Facebook auth error:', err, info);
      const errorRedirectUri = req.session.redirectUri ? `${req.session.redirectUri}?error=AuthenticationFailed` : '/login?error=AuthenticationFailed';
      delete req.session.redirectUri;
      return res.redirect(errorRedirectUri);
    }
    
    try {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || 'your-jwt-secret',
        { expiresIn: '7d' }
      );
      
      const redirectUri = req.session.redirectUri;
      console.log("Retrieved redirectUri from session:", redirectUri);
      
      if (redirectUri) {
        delete req.session.redirectUri;
        const separator = redirectUri.includes('?') ? '&' : '?';
        const finalRedirectUrl = `${redirectUri}${separator}token=${token}`;
        console.log("Redirecting to:", finalRedirectUrl);
        
        return res.redirect(finalRedirectUrl);
      } else {
        console.error("Missing redirectUri in session during Facebook callback");
        return res.status(400).json({ success: false, message: "Missing redirect URI" });
      }
    } catch (error) {
      console.error('Error creating JWT or redirecting in Facebook callback:', error);
      const errorRedirectUri = req.session.redirectUri ? `${req.session.redirectUri}?error=ServerError` : '/login?error=ServerError';
      delete req.session.redirectUri;
      return res.redirect(errorRedirectUri);
    }
  })(req, res, next);
};

exports.authStatus = (req, res) => {
  if (req.user) {
    return res.json({ 
      isAuthenticated: true, 
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.fullname
      } 
    });
  }
  res.json({ isAuthenticated: false });
};

exports.logout = (req, res) => {
  req.logout(err => {
    if (err) { 
      return res.status(500).json({ message: "Logout failed" }); 
    }
    res.json({ success: true });
  });
};

// Các hàm mobile login không cần thiết nữa nếu dùng WebBrowser
// exports.mobileGoogleLogin = ...
// exports.mobileFacebookLogin = ...