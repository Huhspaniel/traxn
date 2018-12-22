if (process.env.NODE_ENV !== 'production') {
    var envVars = require('./env-vars');
    for (let v in envVars) {
        process.env[v] = envVars[v];
    }
}

const express = require('express');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const path = require('path');
const PORT = process.env.PORT || 3001;
const mongoose = require('mongoose');
mongoose.plugin(function immutableValidator(schema, options) {
    schema.pre('validate', function () {
        const isImmutable = ({ path, options: { immutable } }) => (
            immutable && this.isModified(path) && !(this.isNew && immutable.allowOnNew)
        );
        schema.eachPath((path, schemaType) => {
            if (isImmutable(schemaType)) {
                this.invalidate(path, new Error('Field is immutable'), this[path]);
            }
        });
    });
});
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/traxn', {
    useNewUrlParser: true
});

const app = express();
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'production')
    app.use(express.static(path.join(__dirname, './client/build')));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_KEY));
app.use(csrf({ cookie: true }));

require('./routes')(app);

function sendHTML(res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
}

app.get('*', (req, res) => {
    sendHTML(res);
});

app.use(function handleError(err, req, res, next) {
    console.error(err.stack);
    if (err.name === 'ForbiddenError') res.status(403);
    res.json({
        error: {
            name: err.name,
            message: err.message,
            stack: err.stack.split('\n')
        }
    })
});

app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
});