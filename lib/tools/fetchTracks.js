let request = require('request')
let queue = require('queue');
let co = require('co');
let trackIdq = queue(); // Track IDs
let config = require('../../config');
let Mongo = require('mongodb').MongoClient;
let key = require('../../donotcommit').soundCloudAPIKey;
let parseJson = require('parse-json');

function getTrackInfo(trackId) {
  return new Promise((res, rej) => {
    request
    .get(`http://api.soundcloud.com/tracks/${trackId}?client_id=${key}`,
      (err, data) => {
        if (err || data.errors) {
          console.error('error fetching track', trackId, err);
          rej(err);
        }
        res(data.body);
      });
  })
}

function getTracksInfo(tracks) {
  Mongo.connect(config.mongoUrl, (err, db) => {
    let collection = db.collection('tracks');
    tracks.forEach((trackId) => {
      trackIdq.push(function(cb) {
        let data;
        co(function *() {
          data = yield getTrackInfo(trackId);
          if (!data) return Promise.reject();
          data = parseJson(data);
          let doc = yield collection.findOne({id: data.id});
          if (!doc) {
            console.log('new track being inserted ', data.id);
            return yield collection.insertOne(
              Object.assign(data, {
                id: data.id,
                jamy_fetched: new Date().toISOString()
              })
            )
          }
          cb();
        }).then(() => {
          cb();
        }, (err) => {
          console.error('error fetching track ')
          cb();
        })
      });
    });

    trackIdq.start((err) => {
      if (err) console.error('Track ID queue error: ', err);
      console.log('Track ID queue finished');
      db.close();
    });
  })
}

module.exports = getTrackInfo
module.exports = getTracksInfo
