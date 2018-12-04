const { User } = require('../models');
const bcrypt = require('bcryptjs');

module.exports = function (app) {
    app.get(`/api/users`, (req, res) => {
        User.find({})
        .then(data => res.json(data))
        .catch(err => res.json(err));
    });


    //---------need to limit response later for production
    app.post('/api/users', (req, res) => {
        User.create(req.body)
            .then(data => res.json(data))
            .catch(err => res.json(err));
    });

    // Login the user
    // Request will contest username and password
    // After comparing with database using bcrypt decryption, response with jwt token
    // If error, response with error object
    app.post(`/api/login`, (req, res) => {
        User.findOne({username: req.body.username})
        .then(function(data) {
            if (!data) {
                throw "No such user or bad request format"
            } else {
                bcrypt.compare(req.body.password, data.password).then(function(res) {
                    if (res) {
                        console.log(req.body.password);
                        console.log(": " + data.password);
                        /*
                        const token = jwt.sign({id: data.id}, appRef.get("secretKey"), { expiresIn: "1h" });
                        res.json({status: "success", message: "Logged in", data: {username: data.username, token: token}});   
                        */  
                    } else {
                        throw "Wrong password";
                    }
                })
            }              
        })
        .catch(function(err) {
            res.json({status: "error", message: err});
        });
    });
	
}