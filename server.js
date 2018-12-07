const envVars = require('./env-vars');
for (let v in envVars) {
    process.env[v] = envVars[v];
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
            immutable && this.isModified(path) && !(this.isNew && immutable.allowOnInit)
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

app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
});