var barcode = require('./barcode');
var qrcode = require('./qrcode');

// function convert_length(length) {
// 	return Math.round(wx.getSystemInfoSync().windowWidth * length / 750);
// }

function barc(id, code, width, height) {
	barcode.code128(wx.createCanvasContext(id), code, width, height)
}

function qrc(id, code, width, height) {
	qrcode.api.draw(code, {
		ctx: wx.createCanvasContext(id),
		width: width,
		height: height
	})
}

module.exports = {
	barcode: barc,
	qrcode: qrc
}