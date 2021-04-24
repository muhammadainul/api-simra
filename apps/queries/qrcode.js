const debug = require('debug')
const qr = require('qrcode')
const { isEmpty } = require('lodash')
const log = debug('api-asrama:queries:qrcode:')

async function generateQRCode (dataQR, type = 'png') {
    log('generateQRCode:', { dataQR, type })

    const generateQR = await qr.toDataURL(dataQR, { errorCorrectionLevel: 'H' }, { width: '300' })
    log('generateQR', generateQR)
    return generateQR
}

module.exports = {
    generateQRCode
}