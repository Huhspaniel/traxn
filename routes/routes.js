const { 
    User, 
    Track,
    ƒ: { getFeed }
} = require('../models');
const { errObj, userLogin, authJWT } = require('./route-functions.js');

module.exports = function (app) {
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

    app.route(`/api/users/:id`)
        .put((req, res) => {
            if (req.params.id === req.body.user_id)
                User.findOne({id: req.body.user_id})
                .then(
                    doc => {
                        doc.set(req.body);
                    return doc.save();
                })
                .then(data => res.json(data))
                .catch(err => res.json(errObj(err)));
        });

    app.route('/api/tracks')
        .post(authJWT, (req, res) => {
            if (req.body.user_id === req.body.user) {
                Track.create(req.body)
                    .then(data => res.json(data))
                    .catch(err => res.json(errObj(err)));
            } else {
                res.json(errObj({name: "error", message: "Track.user does not match JWT"}));
            }
        })
        .get((req, res) => {
            const { period, u } = req.query;
            getFeed(period, u ? u.split(',') : null)
                .then(tracks => res.json(tracks))
                .catch(err => res.json(errObj(err)));
        })

    app.get('/api/tracks/following', authJWT, (req, res) => {
        User.findById(req.body.user_id)
            .then(user => getFeed(req.query.period, user.following))
            .then(tracks => res.json(tracks))
            .catch(err => res.json(errObj(err)));
    })

    app.route('/api/tracks/:id')
        .put(authJWT, (req, res) => {
            Track.findOne({_id: req.params.id, user: req.body.user_id})
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
                .populate('user', `-password -email -name`)
                .then(data => res.json(data))
                .catch(err => res.json(errObj(err)));
        })
        .delete(authJWT, (req, res) => {
            Track.findOneAndDelete({_id: req.params.id, user: req.body.user_id})
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
    app.post(`/login`, function (req, res) {
        User.findOne({ username: req.body.username }) //since the user only knows username and password
            .then(user => userLogin(user, req.body.password))
            .then(data => res.json(data))
            .catch(err => res.json(errObj(err)));
    });
}