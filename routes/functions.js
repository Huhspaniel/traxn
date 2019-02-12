const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { AES, enc } = require('crypto-js');

function signJWT(res, { sub, name }) {
    const token = jwt.sign({
        sub, name,
        iss: 'Traxn ©'
    }, process.env.JWT_KEY, { expiresIn: '2d' });
    res.cookie(
        'jwt',
        AES.encrypt(token, process.env.SECRET_KEY).toString(),
        { signed: true }
    );
    return res;
}

async function loginUser(req, res, next) {
    const { user, password } = req.body;
    if (!user) {
        next(new Error(`Invalid Login`))
    } else {
        try {
            const isValid = await bcrypt.compare(password, user.password);

            if (isValid) {
                res = signJWT(res, {
                    sub: user._id,
                    name: user.username
                });
                user.password = undefined;
                res.json({
                    success: true,
                    user: user
                });
            } else {
                res.status(401);
                next(new Error(`Invalid Login`))
            }
        } catch (err) {
            next(err);
        }
    }
}
// Middleware function to verify the user using JWT authentification
// Frontend must include valid JWT token on the header
// Control is passed to the next function(whichever route that included this)
// The decoded user_id is also passed to next in the request body

function authJWT(req, res, next) {
    if (!req.signedCookies.jwt) return next(new Error('Invalid token'));
    const token = AES.decrypt(
        req.signedCookies.jwt,
        process.env.SECRET_KEY
    ).toString(enc.Utf8);
    jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
        if (err || decoded.iss !== 'Traxn ©') {
            req.body.user_id = null;
            res.status(401);
            next(new Error('Invalid token'));
        } else {
            const { sub, name, exp } = decoded;
            req.body.user_id = sub;
            if (exp * 1000 - Date.now() < 4.32e7) { // if token will expire in less than 12 hours
                res = signJWT(res, { sub, name }); // refresh token
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