module.exports = handler
module.exports.$config = {
    category : 'controller'
  , route    : [ '/gitter/:user/:repo.png', '/gitter/:user/:repo.svg' ]
}

const validName  = require('../valid-name')
    , roominfo   = require('../roominfo')
    , draw       = require('../draw-gitter-badge')

    , optionKeys = 'stars downloads compact mini'.split(' ')


function optionOn (request, option) {
  var o = request.query[option]
  if (o === '')
    return true
  if (!o)
    return false
  o = o.toLowerCase()
  return o != '0' && o != 'false' && o != 'no'
}

function handler (context, callback) {
  var options  = { }

  context.response.setHeader('cache-control', 'no-cache')

  var room = context.params.user +'/'+ context.params.repo;
  if (!validName(room)) {
    context.model.message = 'Invalid gitter room name'
    return callback(null, 'error')
  }

  optionKeys.forEach(function (o) {
    options[o] = optionOn(context.request, o)
  })

  if (options.downloads)
    options.downloads = 1 // months

  roominfo(room, options, function (err, roominfo) {
    if (err) {
      context.model.message = 'Error fetching room info: ' + err.message
      return callback(null, 'error')
    }

    console.log(roominfo);


    if (/\.svg$/.test(context.request.url)) { // svg

      context.model.options = options
      context.model.roominfo = roominfo
      context.model.params  = draw.calculateParams(options, roominfo)
      context.response.setHeader('content-type', 'image/svg+xml')
      callback(null, 'gitter-badge')

    } else { // png

      context.response.setHeader('content-type', 'image/png')
      draw(options, roominfo).pngStream().pipe(context.response)

    }
  })
}
