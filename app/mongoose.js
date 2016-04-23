var mongoose = require('mongoose');


//mongoose.main_conn = mongoose.createConnection('mongodb://localhost:27017/project_alpha');
//mongoose.event_conn = mongoose.createConnection('mongodb://localhost:27017/eventbrite_database');
//mongoose.event_conn = mongoose.createConnection('mongodb://yinghang:yinghang1234@olympia.modulusmongo.net:27017/iNapiw9a');
mongoose.main_conn = mongoose.createConnection('mongodb://yinghang:yinghang1234@olympia.modulusmongo.net:27017/iNapiw9a');
mongoose.event_conn = mongoose.createConnection('mongodb://yinghang:yinghang1234@olympia.modulusmongo.net:27017/iNapiw9a');

module.exports = mongoose;