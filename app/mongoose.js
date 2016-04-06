var mongoose = require('mongoose');

mongoose.main_conn = mongoose.createConnection('mongodb://localhost:27017/project_alpha');
mongoose.event_conn = mongoose.createConnection('mongodb://localhost:27017/eventbrite_database');

module.exports = mongoose;