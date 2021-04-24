const qr = require('qr-image')
const fs = require('fs')
const { isEmpty } = require('lodash')
const QRCode = require('../queries/qrcode')
const Reservasi = require('../queries/reservasi')
const debug = require('debug')
const log = debug('api-asrama:qrcode:')

async function getQRCode (req, res) {
    let param = req.params
    log('getQRCode', param)
    try {
        const exists = await Reservasi.findById(param.id)
        if (isEmpty(exists)) return res.status(200).json({ status: 404, message: 'Data reservasi tidak ditemukan.', exists })

        let dataQR = param.id
        let makeQRCode = await QRCode.generateQRCode(dataQR)

        if (!makeQRCode) return res.status(200).json({ status: 400, message: 'QRCode gagal dibuat.' })

        return res.status(200).json({ status: 200, data: makeQRCode })
    } catch (error) {
        throw error
    }
}

module.exports = {
    getQRCode
} 