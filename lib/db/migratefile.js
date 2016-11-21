var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', exposeSchemas);

function exposeSchemas() {
  var trackSchema = new mongoose.Schema({
    title: String,
    artist: String,
    genre: String,
    src: String,
    track_id: String,
    artwork_url: String,
    uploaded: String,
    permalink_url: String,
    purchase_url: String,
    blog_id: Number,
    created_at: Date,
    updated_at: Date,
    playcount: Number
  });

  module.exports.trackModel = mongoose.model('Track', trackSchema);

}
