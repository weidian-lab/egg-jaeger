'use strict';

const cacheJaeger = Symbol('jaeger_client_tracer');
const { initTracer, opentracing } = require('jaeger-client');
const als = require('async-local-storage');

module.exports = {
  get als() {
    return als;
  },
  get jaeger() {
    if (!this[cacheJaeger]) {
      this[cacheJaeger] = initTracer(this.config.jaeger);
    }
    return this[cacheJaeger];
  },
  get opentracing() {
    return opentracing;
  },
  startSpan(name, tags = {}) {
    const childOf = als.get('span');
    const span = this.jaeger.startSpan(name, childOf ? { childOf, tags } : { tags });
    als.set('span', span);
    return span;
  },
};
