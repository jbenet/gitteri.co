const hyperquest     = require('hyperquest')
    , bl             = require('bl')
    , qs             = require('querystring')
    , moment         = require('moment')
    , after          = require('after')
    , db             = require('./db')
    , _              = require('underscore')
    , Gitter         = require('node-gitter')

    , ttl            = 1000 * 60      // 1 minute

var gitter = new Gitter('c481c276a11e94a962595e0838607f0c81dce8f2')
var roomCache

db.createCache({
        name          : 'rooms'
      , ttl           : ttl
      , load          : loadRoom
      , valueEncoding : 'json'
    }
  , function (err, cache) { roomCache = cache }
)

function loadRoom (room, callback) {

  gitter.currentUser().then(function(user) {
    user.rooms().then(function(rooms) {

      roomInfo = _.find(rooms, function(r) {
        return r.name == room;
      });

      console.log(roomInfo);

      callback(null, {
        'name': roomInfo.name,
        'users': roomInfo.userCount,
        'updated': new Date(roomInfo.lastAccessTime),
      })

    }).fail(function(err) { callback(err) });
  }).fail(function(err) { callback(err) });

}

function roominfo (room, options, callback) {
  roomCache.get(room, callback);
}

module.exports = roominfo
