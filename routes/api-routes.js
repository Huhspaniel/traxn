const { User, Track } = require('../models');

module.exports = function (app) {
    app.post('/api/users', (req, res) => {
        User.create(req.body)
            .then(data => res.json(data))
            .catch(err => res.json(err));
    })
    app.route('/api/tracks')
        .post((req, res) => {
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
                res.status(404).send('404 Not Found');
            }
        })
}