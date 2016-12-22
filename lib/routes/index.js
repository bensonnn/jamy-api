import router from 'koa-router';

import { trackModel } from '../db/migratefile';

import sampleData from '../db/sampleTracks.json';

let Router = router();
Router.get('/populateWithSampleData', function *(next) {
  trackModel.collection.insertMany(sampleData, (err) => {
    console.log(err, 'sucesss');
  });
});

Router.get('/latest', async ctx => {
  let collection = trackModel.find()
  try {
    const tracks = await collection.find()
      .sort({jamy_fetched: -1});
      .limit(20)
    ctx.body = tracks;
  } catch (e) {
    console.error(e);
  }
});

Router.get('/latest-uploads', async ctx => {
  let collection = trackModel.find()
  try {
    const tracks = await collection.find()
      .sort({created_at: -1});
      .limit(20)
    ctx.body = tracks;
  } catch (e) {
    console.error(e);
  }
});

Router.get('/popular', async ctx => {
  let collection = trackModel.find();
  try {
    const tracks = await collection.find()
      .sort({ playcount: -1 })
      .limit(20)
    ctx.body = tracks;
  } catch (e) {
    console.error(e);
  }
});

export default Router.routes();
