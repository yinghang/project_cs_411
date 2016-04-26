var mongoose     = require('../mongoose');
var Schema       = mongoose.Schema;


// events schema 
var EventSchema   = new Schema({
	name: String,
	location: String,
	id: { type: String, index: { unique: true }},
	start: String,
	end : String,
	conflict : String
});

module.exports = mongoose.event_conn.model('Event', EventSchema);