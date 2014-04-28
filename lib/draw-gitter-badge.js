const Canvas      = require('canvas')
    , path        = require('path')
    , moment      = require('moment')
    , humanize    = require('humanize-number')
    , validName   = require('./valid-name')
    , fs          = require('fs')

var gitterLogo = new Canvas.Image
gitterLogo.src = fs.readFileSync(__dirname + '/../public/gitterim.png');


function fontPath (file) {
  return path.join(__dirname, '../fonts', file)
}

const Gubblebum   = fontPath('GUBBLO___.ttf')
    , UbuntuMonoB = fontPath('UbuntuMono-B.ttf')
    , UbuntuMonoR = fontPath('UbuntuMono-R.ttf')
    , Octicons    = fontPath('Octicons.ttf')
    , gubblebum   = new Canvas.Font('gubblebum', Gubblebum)
    , ubuntumonob = new Canvas.Font('ubuntu-b', UbuntuMonoB)
    , ubuntumonor = new Canvas.Font('ubuntu-r', UbuntuMonoR)
    , octicons    = new Canvas.Font('octicons', Octicons)
    , gitterColor       = 'rgb(30, 62, 70)'

    , INSET  = 2
    , MARGIN = 4

function drawInit (ctx) {
  ctx.addFont(gubblebum)
  ctx.addFont(ubuntumonob)
  ctx.addFont(ubuntumonor)
  ctx.antialias = 'subpixel'
}

function drawBox (ctx, margin, inset, height, width) {
  ctx.strokeStyle = gitterColor
  ctx.fillStyle = 'rgb(244, 244, 242)'
  ctx.lineCap = 'butt'
  ctx.lineJoin = 'round'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.lineTo(inset, inset)
  ctx.lineTo(width - inset, inset)
  ctx.lineTo(width - inset, height - inset)
  ctx.lineTo(inset, height - inset)
  ctx.lineTo(inset, inset)
  ctx.closePath()
  ctx.stroke()
  ctx.fill()
}

function drawLogo (ctx, height, margin, style) {
  var size = height - (margin + 5) * 2;

  ctx.strokeStyle = gitterColor
  ctx.fillStyle = gitterColor
  ctx.lineCap = 'butt'
  ctx.lineJoin = 'round'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.lineTo(0, 0)
  ctx.lineTo(height, 0)
  ctx.lineTo(height, height)
  ctx.lineTo(0, height)
  ctx.lineTo(0, 0)
  ctx.closePath()
  ctx.stroke()
  ctx.fill()

  ctx.drawImage(gitterLogo, margin + 5, margin + 5, size, size);
}

function drawRoomName (ctx, margin, offset, name, style) {
  ctx.font = '14px ubuntu-b'
  ctx.fillStyle = gitterColor
  ctx.textBaseline = 'top'
  ctx.fillText(name
    , margin + offset + (style == 'mini'
        ? 6
        : style == 'compact'
          ? 6
          : 12)
    , margin + 3
  )
}

function calculateParams (options, pkginfo) {
  var margin        = options.mini ? 1 : MARGIN
    , roomName      = 'gitter.im/' + pkginfo.name
    , usersText     = (pkginfo.dependents || 0) + ' user'
                        + (pkginfo.dependents === 1 ? '' : 's')
                        + ' now'
    , updatedText   = 'last message ' + moment(pkginfo.updated).fromNow()
    , compactText   = options.compact
                        && (usersText.replace(' now', '') +
                            ' - ' + updatedText.replace('last message ', ''))

    , height        = margin * 2 + (options.mini
                        ? 22
                        : options.compact
                            ? 37
                            : 48)
    , offsetLeft    = margin + height +
                        (options.mini || options.compact ? 6: 12)
    , width         = offsetLeft + margin + 6 + 7 * (options.mini
                        ? roomName.length
                        : Math.max.apply(null, options.compact
                            ? [ compactText.length, roomName.length ]
                            : [ updatedText.length, roomName.length ])
                          )

  return {
      margin        : margin
    , inset         : INSET
    , roomName      : roomName
    , usersText     : usersText
    , updatedText   : updatedText
    , compactText   : compactText
    , height        : height
    , width         : width
    , style         : options.mini
                        ? 'mini'
                        : options.compact ? 'compact' : 'standard'
    , offsetLeft    : offsetLeft
  }
}


function draw (options, pkginfo) {
  var params = calculateParams(options, pkginfo)
    , canvas = new Canvas(params.width, params.height)
    , ctx    = canvas.getContext('2d')

  drawInit(ctx)
  drawBox(ctx, params.margin, params.inset, params.height, params.width)
  drawLogo(ctx, params.height, params.margin, params.style)
  drawRoomName(ctx, params.margin, params.height, params.roomName, params.style)

  ctx.font = '13px ubuntu-r'
  if (!options.mini) {
    if (options.compact) {
      ctx.fillText(params.compactText, params.offsetLeft, params.margin + 19)
    } else {
      ctx.fillText(params.usersText, params.offsetLeft, params.margin + 19)
      ctx.fillText(params.updatedText, params.offsetLeft, params.margin + 31)
    }
  }

  return canvas
}

module.exports                 = draw
module.exports.calculateParams = calculateParams
