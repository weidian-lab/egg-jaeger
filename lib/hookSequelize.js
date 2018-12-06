'use strict';

const util = require('./util');

function hookSequelize(Sequelize, app) {
  app.logger.info('[egg-jaeger] setup Sequelize hooks');
  util.wrap(Sequelize.prototype, 'query', original => function query(sql, options) {
    const span = app.startSpan(`SQL ${options.type}`, {
      'db.instance': this.config.database,
      'db.statement': sql,
      'db.type': 'sql',
      'db.user': this.config.username,
      'span.kind': 'client',
    });
    return original.apply(this, arguments).then(
      (result) => {
        span.finish();
        return result;
      },
      (err) => {
        span.finish(err);
        throw err;
      },
    );
  });
}

module.exports = (app) => {
  const { Sequelize } = app;
  if (Sequelize) {
    hookSequelize(Sequelize, app);
  }
};
