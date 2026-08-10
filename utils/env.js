// tiny wrapper with default env vars
module.exports = {
  BUILD_TPYE: process.env.BUILD_TPYE || 'app',
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  BABEL_ENV: process.env.BABEL_ENV || 'test'
};
