const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const errObj = err => ({
    error: {
        [err.name]: err.message
    }
});
function userLogin(user, password) {
    return new Promise((resolve, reject) => {
        if (!user) {
            reject(new Error(`No such user or bad request format`))
        } else {
            bcrypt.compare(password, user.password)
                .then(function createJWT(res) {
                    if (res) {
                        const token = jwt.sign({ user_id: user._id, username: user.username }, process.env.JWT_KEY, { expiresIn: `1h` });
                        // sending id to client will enable frontend to send id back to server to edit tracks
                        resolve({
                            status: `success`,
                            message: `Logged in`,
                            data: { user_id: user.id, username: user.username, token: token }
                        });
                    } else {
                        reject(new Error(`Incorrect password`));
                    }
                })
                .catch(reject);
        }
    })
}
// Middleware function to verify the user using JWT authentification
// Frontend must include valid JWT token on the header
// Control is passed to the next function(whichever route that included this)
// The decoded user_id is also passed to next in the request body
function authJWT(req, res, next) {
    const token = req.headers[`x-access-token`];
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
    userLogin,
    authJWT,
    authDev
}