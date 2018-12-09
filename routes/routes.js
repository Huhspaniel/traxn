const {
    User,
    Track,
    ƒ: { getFeed }
} = require('../models');
const { loginUser, authJWT, authDev } = require('./route-functions.js');

module.exports = function (app) {
    app.get('/csrf', (req, res) => {
        res.json({ csrfToken: req.csrfToken() })
    })
    app.route(`/api/users`)
        .get((req, res, next) => { //---------need to limit response later for production
            User.find({})
                .populate('following')
                .then(data => res.json(data))
                .catch(next);
        })
        .post((req, res, next) => {
            User.create(req.body)
                .then(data => res.json(data))
                .catch(next);
        });

    app.route('/api/users/:id')
        .get(authJWT, (req, res, next) => {
            User.findOne({ _id: req.params.id })
                .then(data => {
                    if (data) {
                        data.password = undefined;
                        req.body.user = data;
                    } else {
                        return next(new Error('User not found'));
                    }

                    if (req.body.userId !== data._id) {
                        return next(new Error('Invalid token'));
                    }
                    res.json(data);
                })
                .catch(next);
        }, (err, req, res, next) => {
            const { user } = req.body;
            if (err.message === 'Invalid token' && user) {
                user.email = user.following = undefined;
                return res.json(user);
            }
            next(err);
        })
        .put(authJWT, (req, res, next) => {
            const action = req.query.action;
            User.findOne({ _id: req.body.userId })
                .then(user => {
                    if (!user) next(new Error('User not found'));
                    switch (action) {
                        case 'follow': {
                            const followId = req.body.userId;
                            if (followId instanceof Array) {

                            }
                            const following = user.following;
                            let followingIndex;
                            followingIndex = following.indexOf(followingId);
                            if (followingIndex === -1) {
                                following.splice(followingIndex, 1);
                            } else {
                                following.push(followId);
                            }
                            user.following = following;
                            break;
                        } default: {
                            user.set(req.body);
                        }
                    }
                    return user.save();
                })
                .then(data => res.json(data))
                .catch(next)
        })

    app.route('/api/tracks')
        .post(authJWT, (req, res, next) => {
            req.body.user = req.body.userId;
            Track.create(req.body)
                .then(data => res.json(data))
                .catch(next);
        })
        .get((req, res) => {
            const { period, u } = req.query;
            getFeed(period, u ? u.split(',') : null)
                .then(tracks => res.json(tracks))
                .catch(next);
        })

    app.get('/api/tracks/following', authJWT, (req, res, next) => {
        User.findById(req.body.userId)
            .then(user => getFeed(req.query.period, user.following))
            .then(tracks => res.json(tracks))
            .catch(next);
    })

    app.route('/api/tracks/:id')
        .put(authJWT, (req, res, next) => {
            Track.findOne({ _id: req.params.id, user: req.body.userId })
                .then(
                    doc => {
                        doc.set(req.body);
                        return doc.save();
                    })
                .then(data => res.json(data))
                .catch(next);
        })
        .get((req, res) => {
            Track.find({ _id: req.params.id })
                .populate('user', `-password -email -following`)
                .then(data => res.json(data))
                .catch(next);
        })
        .delete(authJWT, (req, res) => {
            Track.findOneAndDelete({ _id: req.params.id, user: req.body.userId })
                .then(data => res.json(data))
                .catch(next);
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
            .catch(next);
    }, loginUser);

    app.post('/repost/:id', authJWT, (req, res, next) => {
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
            .catch(next);
    });
}