var path   = require('path'),
    config = require('config-store');

try {
  exports = module.exports = config(path.join(__dirname, '../config.json'));
} catch (e) {
  exports = module.exports = config();
}