let env = process.env.NODE_ENV || 'development';

console.log(env, 'environment config loaded');

const config = {
  development: {
    mongoUrl: 'mongodb://localhost:27017/test'
  },
  production: {
    mongoUrl: 'mongodb://localhost:27017/test'
  }
};

module.exports = config[env];
