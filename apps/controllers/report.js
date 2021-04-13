const debug = require('debug')
const _ = require('lodash')
const log = debug('api-asrama:report:')
const Report = require('../queries/report')

async function getReport (req, res) {
    let data = req.body
    log('getReport', data)
    try {
        let result = await Report.getTotalCounts()
        if (!result) return res.status(400).json({ statusCode: 400, message: 'Tidak dapat menampilkan data', result })
        return res.status(200).json({ statusCode: 200, data: result })
    } catch (error) {
        throw error
    }
}

module.exports = {
    getReport
}