'use strict';
module.exports = function(app) {
  var recast = require('../controllers/recastController');

  // todoList Routes
  app.route('/chat')
    .get(recast.getConversation)
    .post(recast.postConversation);

};