'use strict';

const hookSequelize = require('./lib/hookSequelize');

module.exports = (app) => {
  app.beforeStart(async () => {
    app.als.enable();
    hookSequelize(app);
  });
  // put before other core middlewares
  app.config.coreMiddlewares.unshift('jaeger');
};
