module.exports = handler
module.exports.$config = {
    category : 'controller'
  , route    : '/gitter/:user/:repo.json'
  , viewProcessor : 'jsonViewProcessor'
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

  var room = context.params.user + '/' + context.params.repo
  if (!validName(room))
    return callback(null, { error: 'Invalid gitter room name' })

  optionKeys.forEach(function (o) {
    options[o] = optionOn(context.request, o)
  })

  if (options.downloads)
    options.downloads = 1 // months

  roominfo(room, options, function (err, roominfo) {
    if (err)
      return callback(null, { error: 'Error fetching room info: ' + err.message })

    return callback(null, roominfo)
  })
}
