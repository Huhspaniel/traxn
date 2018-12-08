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

    app.route('/api/users/me')
        .get(authJWT, (req,res) => {
            User.findById(req.body.userId)
                .then(res.json)
                .catch(err => res.json(errObj(err)))
        })
        .put(authJWT, (req, res) => {
            User.findById(req.body.userId)
                .then(user => {
                    user.set(req.body);
                    return user.save();
                })
                .then(res.json)
                .catch(err => res.json(errObj(err)))
        })

    app.post('/follow/:userId', authJWT, (req, res) => {
        User.findByIdAndUpdate(req.body.userId, { 
            $push: { following: req.params.userId } 
        }, { new: true })
            .then(res.json)
            .catch(err => res.json(errObj(err)));
    })

    app.put('/:userId/change_password', authJWT, (req, res) => { // placeholder
        res.json('change password');
    })

    app.route('/api/tracks')
        .post(authJWT, (req, res) => {
            req.body.user = req.body.userId;
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
        User.findById(req.body.userId)
            .then(user => getFeed(req.query.period, user.following))
            .then(tracks => res.json(tracks))
            .catch(err => res.json(errObj(err)));
    })

    app.route('/api/tracks/:id')
        .put(authJWT, (req, res) => {
            Track.findOne({ _id: req.params.id, user: req.body.userId })
                .then(
                    doc => {
                        doc.set(req.body);
                        return doc.save();
                    })
                .then(data => res.json(data))
                .catch(err => res.json(errObj(err)));
        })
        .get((req, res) => {
            Track.find({ _id: req.params.id })
                .populate('user', `-password -email`)
                .then(data => res.json(data))
                .catch(err => res.json(errObj(err)));
        })
        .delete(authJWT, (req, res) => {
            Track.findOneAndDelete({ _id: req.params.id, user: req.body.userId })
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
    });
}