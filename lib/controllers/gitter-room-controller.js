module.exports = handler
module.exports.$config = {
    category : 'controller'
  , route    : '/gitter/:user/:repo/?'
}

const validName = require('../valid-name')

function handler (context, callback) {
  var room = context.params.user.replace(/\/$/, '') + '/'
           + context.params.repo.replace(/\/$/, '')

  if (!validName(room)) {
    context.model.message = 'Invalid gitter room name (' + room + ')'
    return callback(null, 'error')
  }

  context.response.writeHead(303, {
    'location': 'https://gitter.im/' + room
  })
  context.response.end()
}
