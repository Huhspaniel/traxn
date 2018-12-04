const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 8080;
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/traxn', {
    useNewUrlParser: true
});
const db = mongoose.connection;

const app = express();
// key for JWT authentification
app.set("JWTKey", "afsloagno4p93ednm");
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'production')
    app.use(express.static(path.join(__dirname, './client/build')));
app.use(express.json());

require('./routes')(app);

app.listen(PORT, () => {
    console.log(`App listening on http://localhost:${PORT}`);
});