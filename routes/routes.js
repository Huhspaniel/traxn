const {
    User,
    Track,
    ƒ: { getFeed }
} = require('../models');
const { errObj, loginUser, authJWT } = require('./route-functions.js');

module.exports = function (app) {
    app.get('/csrf', (req, res) => {
        res.json({ csrfToken: req.csrfToken() })
    })
    app.route(`/api/users`)
        .get((req, res) => { //---------need to limit response later for production
            User.find({})
                .populate('following')
                .then(data => res.json(data))
                .catch(err => res.json(errObj(err)));
        })
        .post((req, res) => {
            User.create(req.body)
                .then(data => res.json(data))
                .catch(err => res.json(errObj(err)));
        });

    app.route('/api/tracks')
        .post(authJWT, (req, res) => {
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
    app.get('/api/tracks/following', authJWT, (req, res) => {
        User.findById(req.body.user)
            .then(user => getFeed(req.query.period, user.following))
            .then(tracks => res.json(tracks))
            .catch(err => res.json(errObj(err)));
    })

    app.route('/api/tracks/:id')
        .put(authJWT, (req, res) => {
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
                .populate('user').populate('taggedUsers')
                .then(data => res.json(data))
                .catch(err => res.json(errObj(err)));
        })
        .delete(authJWT, (req, res) => { // must refactor so user can only delete his own posts
            Track.findByIdAndDelete(req.params.id)
                .then(data => res.json(data))
                .catch(err => res.json(errObj(err)));
            // Track.findById(req.params.id)
            //     .then(track => {
            //         if (track.user._id === req.body.user)
            //     })
        })

    // Login the user
    // Request will contest username and password
    // After comparing with database using bcrypt decryption, response with jwt token
    // If error, response with error object
    app.post(`/login`, function getUser(req, res, next) {
        User.findOne({ username: req.body.username })
            .then(user => {
                req.body.user = user;
                next();
            })
            .catch(err => res.json(errObj(err)));
    }, loginUser);

    app.post('/repost/:id', authJWT, (req, res) => {
        Track.findOne({ _id: req.params.id })
            .then(track => {
                let update;
                if (track.repostedBy.find(user => user == req.body.user)) {
                    update = {
                        $pull: {
                            repostedBy: req.body.user
                        }
                    }
                } else {
                    update = {
                        $push: {
                            repostedBy: req.body.user
                        }
                    }
                }
                return Track.findOneAndUpdate({ _id: req.params.id }, update, { new: true });
            })
            .then(data => res.json(data))
            .catch(err => res.json(errObj(err)));
    })


    // Alternate method of JWT authentication, using routes rather than middleware function
    /*    
        // Authentication route
        // All routes starting with below route will be authenticated
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
                    throw new Error(`No token provided`);
                }
            } catch (err) {
                res.json(errObj(err));
            }
        });
    */
}