const {
    User,
    Track,
    _functions: { getFeed }
} = require('../db');
const { errObj, loginUser, authJWT } = require('./functions.js');

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

    app.post(`/login`, function getUserByUsername(req, res, next) {
        User.findOne({ username: req.body.username })
            .then(user => {
                if (!user) return next(new Error('User not found'))
                req.body.user = user;
                next();
            })
            .catch(next);
    }, loginUser);


    app.get('/api/tracks', (req, res, next) => {
        const { filter, period, u } = req.query;
        switch (filter) {
            case 'following': {
                return next();
            }
            default: {
                getFeed(period, u ? u.split(',') : null)
                    .then(tracks => res.json(tracks))
                    .catch(next);
            }
        }
    })

    app.get('/api/tracks/:id', (req, res, next) => {
        Track.find({ _id: req.params.id })
            .populate('user', `-password -email -following`)
            .then(data => res.json(data))
            .catch(next);
    })

    app.delete('/api/users/:id', (req, res, next) => {
        User.findByIdAndDelete(req.params.id)
            .then(data => res.json(data))
            .catch(next)
    })

    /* ----- JWT secure routes ----- */

    function getUserByJWT(req, res, next) {
        User.findOne({ _id: req.body.user_id })
            .then(user => {
                if (!user) {
                    res.status(404);
                    return next(new Error('User not found'));
                }
                req.body.user = user;
                // req.body.user.password = null;
                next();
            })
            .catch(next)
    }

    function updateUser(req, res, next) {
        const {
            query: { action, id },
            body: { user }
        } = req;
        switch (action) {
            case 'follow': {
                const following = user.following;
                const idIndex = following.indexOf(id);
                if (idIndex >= 0) {
                    following.splice(idIndex, 1);
                } else {
                    following.push(id);
                }
                user.following = following;
                break;
            } default: {
                const update = {};
                for (let prop in req.body) {
                    update[prop] = req.body[prop];
                }
                user.set(update);
            }
        }
        user.save()
            .then(data => res.json(data))
            .catch(next);
    }

    app.route('/api/users/me')
        .all(authJWT, getUserByJWT)
        .get((req, res) => res.json(req.body.user))
        .put(updateUser)

    function getUserPublic(req, res, next) {
        User.findOne({ _id: req.params.id })
            .then(user => {
                if (user) {
                    user.password = user.email = user.following = undefined;
                    res.json(user);
                } else {
                    res.status(404);
                    next(new Error('User not found'));
                }
            })
            .catch(next);
    }

    app.route('/api/users/:id')
        .all(authJWT)
        .get((req, res, next) => {
            if (req.body.user_id === req.params.id) {
                getUserByJWT(req, res, next);
            } else {
                next(new Error('Invalid user'))
            }
        }, (req, res) => res.json(req.body.user),
            (err, req, res, next) => {
                if (err.message === 'Invalid token' || err.message === 'Invalid user') {
                    res.status(200);
                    getUserPublic(req, res, next);
                } else {
                    next(err);
                }
            })
        .put((req, res, next) => {
            if (req.params.id !== req.body.user_id) {
                res.status(401);
                next(new Error('Invalid user'));
            } else {
                getUserByJWT(req, res, next);
            }
        }, updateUser)

    app.route('/api/tracks')
        .post(authJWT, (req, res, next) => {
            req.body.user = req.body.user_id;
            Track.create(req.body)
                .then(data => res.json(data))
                .catch(next);
        })

    app.get('/api/tracks', authJWT, getUserByJWT, (req, res, next) => {
        getFeed(req.query.period, req.body.user.following)
            .then(tracks => res.json(tracks))
            .catch(next)
    })

    app.route('/api/tracks/:id')
        .all(authJWT)
        .put((req, res, next) => {
            Track.findOne({ _id: req.params.id })
                .then(track => {
                    const { action } = req.query;
                    console.log(req.body);
                    if (action === 'repost') {
                        let update;
                        if (track.repostedBy.find(user => user == req.body.user_id)) {
                            update = {
                                $pull: {
                                    repostedBy: req.body.user_id
                                }
                            }
                        } else {
                            update = {
                                $push: {
                                    repostedBy: req.body.user_id
                                }
                            }
                        }
                        return Track.findOneAndUpdate({ _id: req.params.id }, update, { new: true });
                    } else if (req.body.user_id != track.user) {
                        next(new Error('Cannot edit other users\' posts'))
                    } else {
                        const update = {};
                        for (let prop in req.body) {
                            update[prop] = req.body[prop];
                        }
                        track.set(update);
                        return track.save()
                    }
                })
                .then(data => res.json(data))
                .catch(next);
        })
        .delete((req, res) => {
            Track.findOneAndDelete({ _id: req.params.id, user: req.body.user_id })
                .then(data => res.json(data))
                .catch(next);
        })
}