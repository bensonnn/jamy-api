let request = require('request');
let queue = require('queue');
let _ = require('lodash');
let url = require('url');

let trackIdq = queue({concurrency: 4}); // Track IDs

let mongoUrl = 'mongodb://localhost:27017/test';
let Mongo = require('mongodb').MongoClient;

// entry
let tracks = [];

Mongo.connect(mongoUrl, (err, db) => {

  let blogs = db.collection('blogs');

  blogs.find({}).toArray((err, docs) => {
    if (err) console.error('error finding blogs', err);
    docs.forEach((doc) => {
      trackIdq.push(function(cb) {
        fetchTrackIds(doc).then(cb);
      });
    });
    trackIdq.start((err) => {
      if (err) console.error('Track ID queue error: ', err);
      console.log('Track ID queue finished');
      // console.log(tracks)
    });
  });

  db.close();
});


// returns Promise
// Will call callback with each track id
function fetchTrackIds(doc) {
  return promise = new Promise(res => {
    // Mini crawler action
    let urls = doc.url;
    if (_.isArray(doc.url)) {
      let original = url.parse(doc.url[0]);
      requestPage(doc.url.shift()).then((page) => {
        let regex = '#{}/[^#?\"]+'.replace(/#{}/, doc.url[0]);
        let links = page.match(new RegExp(regex, 'g'));
        let crawler = Promise.all(_.uniq(links).map(link => {
          return soundCloudLinkSearch(original.protocol + '//' + original.host + link);
        }));

        crawler.then(() => {
          res();
        });

      });
    } else {
      soundCloudLinkSearch(urls).then(res);
    }
  });
}

function soundCloudLinkSearch(urls) {
  return new Promise(res => {
    return requestPage(urls).then(data => {
      console.log(urls, 'successfully fetched');
      data = data
      .match(/api.soundcloud.com(?:%2F|\/)tracks(?:%2F|\/)(\d{9,10})/g);
      if (data) data = data.map(string => string.match(/\d{9,10}/)[0]);
      if (data) {
        tracks.push(...data);
      }
      res();

    });
  });
}

function requestPage(url) {
  return promise = new Promise((res, rej) => {
    request.get(
      { url,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:39.0) Gecko/20100101 Firefox/39.0'
        }
      },
      (err, response) => {
        if (err) {
          console.error('fetch page error:', err);
          rej();
        } else res(response.body);
      });
  });
}
