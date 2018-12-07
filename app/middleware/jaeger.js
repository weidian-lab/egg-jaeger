'use strict';

const als = require('async-local-storage');

module.exports = (options, app) => async function jaegerMiddleware(ctx, next) {
  als.scope()
  const span = app.startSpan(ctx.path);
  span.setTag('requestMethod', ctx.method);
  als.set('span', span);
  try {
    await next();
    span.finish();
  } catch (err) {
    span.setTag(app.opentracing.Tags.ERROR, true);
    span.log({
      event: 'error',
      'error.object': err,
      message: err.message,
      stack: err.stack,
    });
    span.finish();
    throw err;
  }
};
