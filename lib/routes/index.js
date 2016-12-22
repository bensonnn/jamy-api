import router from 'koa-router';
import { trackModel } from '../db/migratefile';
import sampleData from '../db/sampleTracks.json';
import config from '../../config';

let Mongo = require('mongodb').MongoClient;


let Router = router();
Router.get('/populateWithSampleData', function *(next) {
  trackModel.collection.insertMany(sampleData, (err) => {
    console.log(err, 'sucesss');
  });
});

Router.get('/latest', async ctx => {
  let db = await Mongo.connect(config.mongoUrl);
  let collection = await db.collection('tracks');
  try {
    const { count } = await collection.stats();
    const tracks = await collection.find()
      .sort({jamy_fetched: -1})
      .limit(20)
      .skip(((ctx.query.p || 1) - 1) * 20)
      .toArray();
    ctx.body = { total: count, tracks};
  } catch (e) {
    console.error(e);
  }
});

Router.get('/latest-uploads', async ctx => {
    let db = await Mongo.connect(config.mongoUrl);
    let collection = await db.collection('tracks');
    try {
      const { count } = await collection.stats().count;
      const tracks = await collection.find()
        .sort({created_at: -1})
        .limit(20)
        .skip(((ctx.query.p || 1) - 1) * 20)
        .toArray();
      ctx.body = { total: count, tracks};
    } catch (e) {
      console.error(e);
    }
  });

Router.get('/popular', async ctx => {
  let db = await Mongo.connect(config.mongoUrl);
  let collection = await db.collection('tracks');
  try {
    const { count } = await collection.stats().count;
    const tracks = await collection.find()
      .sort({playcount: -1})
      .limit(20)
      .skip(((ctx.query.p || 1) - 1) * 20)
      .toArray();
    ctx.body = { total: count, tracks};
  } catch (e) {
    console.error(e);
  }
});

export default Router.routes();
