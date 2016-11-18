import router from 'koa-router';

let Router = router();
Router.get('/', function *(next) {
  this.body = 'router body';
});

export default Router.routes();
