// import responseTime from 'koa-response-time';
// import ratelimit from 'koa-ratelimit';
import compress from 'koa-compress';
// import logger from 'koa-logger';
// import load from '/lib/load';
// import redis from 'redis';
import routes from './routes';
import koa from 'koa';
import helmet from 'koa-helmet';
import cors from 'koa-cors';

const env = process.env.NODE_ENV || 'development';

let app = new koa();

app.use(cors());

app.use(compress());

app.use(helmet());

app.use(routes);

app.listen(3000);

console.log('app listening on port 3000');
