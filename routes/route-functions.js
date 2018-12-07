const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const errObj = err => ({
    error: {
        [err.name]: err.message
    }
});
function loginUser(req, res, next) {
    const { user, password } = req.body;
    if (!user) {
        res.json(errObj(new Error(`Invalid Login`)))
    } else {
        bcrypt.compare(password, user.password)
            .then(function createJWT(valid) {
                if (valid) {
                    const token = jwt.sign({ user_id: user._id, username: user.username }, process.env.JWT_KEY, { expiresIn: `1h` });
                    res.cookie('jwt', token);
                    res.json({
                        success: true,
                        user_id: user._id
                    });
                } else {
                    res.json(errObj(new Error(`Invalid Login`)))
                }
            })
            .catch(err => res.json(errObj(err)));
    }
}
// Middleware function to verify the user using JWT authentification
// Frontend must include valid JWT token on the header
// Control is passed to the next function(whichever route that included this)
// The decoded user_id is also passed to next in the request body
function authJWT(req, res, next) {
    const token = req.cookies.jwt;
    jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
        if (err) {
            req.body.user = null;
            res.status(401).json(errObj(new Error('Invalid token')));
        } else {
            req.body.user = decoded.user_id;
            next();
        }
    });
}
function authDev(req, res, next) {

}
module.exports = {
    errObj,
    loginUser,
    authJWT,
    authDev
}