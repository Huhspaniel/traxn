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
                    const token = jwt.sign({
                        sub: user._id,
                        name: user.username,
                        iss: 'Traxn ©'
                    }, process.env.JWT_KEY, { expiresIn: `2d` });
                    res.cookie('jwt', token);
                    user.password = undefined;
                    res.json({
                        success: true,
                        user: user
                    });
                } else {
                    res.status(401);
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
            const { sub, name, iss, exp } = decoded;
            req.body.user_id = sub;
            if (exp - Date.now() < 4.324e7) { // if token will expire in less than 12 hours
                res.cookie('jwt', jwt.sign({ // renew token
                    sub, name, iss
                }, process.env.JWT_KEY, { expiresIn: '2d' }));
            }
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