const { User, Track } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require(`jsonwebtoken`);

// Middleware for authenticating json web token
function authenticateJWT(req, res, next) {
    next();
}

const milliseconds = {
    hour: 3.6e6,
    day: 8.64e7,
    week: 6.048e8,
    month: 2.628e9,
    year: 3.154e10
}
function minimumDate(period) { // period: string -- {unit},{quantity}
    const [unit, quantity] = period.split(',');
    if (unit) {
        const date = new Date(Date.now() - milliseconds[unit] * (quantity || 1));
        return date;
    } else {
        return null;
    }
}

/*
    period: string -- time period to filter tracks
        {unit of time},{quantity} (e.g. "week,3")
            default quantity is 1
            if period is falsy, tracks are not filtered based on Track._postedAt
                (i.e. period is 'All' or 'All Time')

    users: string[] -- array of user ids to filter tracks
*/
function getFeed(period, users) {
    return new Promise((resolve, reject) => {
        const conditions = {};
        try {
            if (period) {
                conditions._postedAt = { $gte: minimumDate(period) }
            }
            if (users) {
                conditions.user = { $in: users }
            }
            Track.find(conditions).populate('user')
                .then(resolve).catch(reject)
        } catch (err) {
            reject(err);
        }
    })
}

const errObj = err => ({
    error: {
        [err.name]: err.message
    }
})
module.exports = function (app) {
    app.get(`/api/users`, (req, res) => {
        User.find({})
            .populate('following')
            .then(data => res.json(data))
            .catch(err => res.json(errObj(err)));
    });
    //---------need to limit response later for production
    app.post('/api/users', (req, res) => {
        User.create(req.body)
            .then(data => res.json(data))
            .catch(err => res.json(errObj(err)));
    })
    app.route('/api/tracks')
        .post(authenticateJWT, (req, res) => {
            Track.create(req.body)
                .then(data => res.json(data))
                .catch(err => res.json(errObj(err)));
        })
        .get((req, res) => {
            const { period, u } = req.query;
            getFeed(period, u ? u.split(',') : null)
                .then(tracks => res.json(tracks))
                .catch(err => res.json(errObj(err)));
        })
    app.get('/api/tracks/following', authenticateJWT, (req, res) => {
        User.findById(req.body.user_id)
            .then(user => {
                return getFeed(req.query.period, user.following);
            })
            .then(tracks => res.json(tracks))
            .catch(err => res.json(errObj(err)));
    })

    app.route('/api/tracks/:id')
        .put((req, res) => {
            Track.findById(req.params.id)
                .then(doc => {
                    doc.set(req.body);
                    return doc.save();
                })
                .then(data => res.json(data))
                .catch(err => res.json(errObj(err)));
        })
        .get((req, res) => {
            Track.find({ _id: req.params.id })
                .populate('user')
                .then(data => res.json(data))
                .catch(err => res.json(errObj(err)));
        })
        .delete((req, res) => {
            Track.findByIdAndDelete(req.params.id)
                .then(data => res.json(data))
                .catch(err => res.json(errObj(err)));
        })

    // Login the user
    // Request will contest username and password
    // After comparing with database using bcrypt decryption, response with jwt token
    // If error, response with error object
    app.post(`/api/login`, (req, res) => {
        User.findOne({ username: req.body.username })
            .then(function (data) {
                if (!data) {
                    throw new Error("No such user or bad request format")
                } else {
                    bcrypt.compare(req.body.password, data.password)
                        .then(function (bcryptRes) {
                            if (bcryptRes) {
                                const token = jwt.sign({ username: data.username }, app.get("JWTKey"), { expiresIn: "1h" });
                                res.json({ status: "success", message: "Logged in", data: { username: data.username, token: token } });
                            } else {
                                throw new Error("Wrong password");
                            }
                        })
                        .catch(function (err) {
                            res.json(errObj(err));
                        });
                }
            })
            .catch(function (err) {
                res.json(errObj(err));
            });
    });

    // Authentification route
    // All routes starting with below route will be authentificated
    // Decoded id passed to next function call
    app.use("/api/auth", function (req, res, next) {
        const token = req.headers["x-access-token"];
        try {
            if (token) {
                jwt.verify(token, app.get('JWTKey'), function (err, decoded) {
                    if (err) {
                        throw err.message;
                    } else {
                        req.body.username = decoded.username;
                        next();
                    }
                });
            } else {
                throw "No token provided";
            }
        } catch (err) {
            res.json({ status: "error", message: err });
        }
    });

}