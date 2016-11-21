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
  let collection = trackModel.find();
  const tracks = await collection.find()
    .sort({ uploaded: -1 })
    .limit(20)
  ctx.body = tracks;
});

export default Router.routes();
