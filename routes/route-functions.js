const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function loginUser(req, res, next) {
    const { user, password } = req.body;
    if (!user) {
        next(new Error(`Invalid Login`))
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
                    next(new Error(`Invalid Login`))
                }
            })
            .catch(next);
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
            req.body.user_id = null;
            res.status(401);
            next(new Error('Invalid token'));
        } else {
            req.body.user_id = decoded.user_id;
            next();
        }
    });
}

function authDev(req, res, next) {
    let token = req.header('Authorization');
    let err;
    if (token) {
        token = token.split(' ');
        if (token[0] === 'Bearer') {
            if (token[1] === process.env.DEV_KEY) {
                return next();
            } else {
                err = new Error('Invalid token')
            }
        } else {
            err = new Error('Authorization header does not follow Bearer scheme')
        }
    } else {
        err = new Error('No authorization provided');
    }
    res.status(401);
    next(err);
}
module.exports = {
    loginUser,
    authJWT,
    authDev
}