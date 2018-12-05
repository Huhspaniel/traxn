const { User, Track } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require(`jsonwebtoken`);

module.exports = function (app) {

    const authJWT = function (req, res, next) {
        try {
            const token = req.headers[`x-access-token`];
            if (token) {
                jwt.verify(token, app.get(`JWTKey`), function(err, decoded) { 
                    if (err) {
                        throw err.message; 
                    } else {
                        req.body.username = decoded.username; // not really necessary unless next function use it
                        next();
                    }
                });
            } else {
                throw `No token provided`;
            }
        } catch(err) {
            res.json({status: `error`, message: err});
        }
    }

    app.get(`/api/users`, (req, res) => {
        User.find({})
            .populate('following')
            .then(data => res.json(data))
            .catch(err => res.json(err));
    });
    //---------need to limit response later for production
    app.post('/api/users', (req, res) => {
        User.create(req.body)
            .then(data => res.json(data))
            .catch(err => res.json(err));
    })
    
    app.route('/api/tracks')
        .post(authJWT, (req, res) => {
            Track.create(req.body)
                .then(data => res.json(data))
                .catch(err => res.json(err));
        })
        .get((req, res) => {
            if (req.query.u) {
                Track.find({ user: req.query.u })
                    .populate('user')
                    .then(data => res.json(data))
                    .catch(err => res.json(err));
            } else {
                Track.find({}) // Will change/limit before deployment
                    .populate('user')
                    .then(data => res.json(data))
                    .catch(err => res.json(err));
            }
        })

    // Login the user
    // Request will contest username and password
    // After comparing with database using bcrypt decryption, response with jwt token
    // If error, response with error object
    app.post(`/api/login`, function (req, res) {
        User.findOne({username: req.body.username})
        .then(function(data) {
            if (!data) {
                throw `No such user or bad request format`
            } else {
                bcrypt.compare(req.body.password, data.password)
                .then(function(bcryptRes) {
                    if (bcryptRes) {
                        const token = jwt.sign({username: data.username}, app.get(`JWTKey`), { expiresIn: `1h` });
                        res.json({status: `success`, message: `Logged in`, data: {username: data.username, token: token}});   
                    } else {
                        throw `Wrong password`;
                    }
                })
                .catch(function(err) {
                    res.json({status: `error`, message: err});
                });
            }              
        })
        .catch(function(err) {
            res.json({status: `error`, message: err});
        });
    });


// Alternate method of JWT authentification, using routes rather than middleware function
/*    
    // Authentification route
    // All routes starting with below route will be authentificated
    // Checks if the JWT token is includeded in the header
    // Decoded username passed to next function call
    app.use(`/api/auth`, function (req, res, next) {
        const token = req.headers[`x-access-token`];
        try {
            if (token) {
                jwt.verify(token, app.get(`JWTKey`), function(err, decoded) { 
                    if (err) {
                        throw err.message;
                    } else {
                        req.body.username = decoded.username; // not really necessary unless next function use it
                        next();
                    }
                });
            } else {
                throw `No token provided`;
            }
        } catch(err) {
            res.json({status: `error`, message: err});
        }
    });
*/
    // testing auth example
    app.get(`/api/userss`, authJWT, function (req, res) {
        User.find({})
        .then(function(data) {
            res.json(data);
        })
        .catch(function(err) {
            res.json("err: " + err);
        });
    });

}