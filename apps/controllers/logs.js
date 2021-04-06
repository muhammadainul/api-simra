const debug = require('debug')
const { isEmpty } = require('lodash')
const Logs = require('../queries/logs')
const log = debug('api-simra:logs:')

async function create (req, res) {
    let data = req.body
    log('create: ', data)
    try {
        const created = await Logs.create(data)
        return res.status(200).json({ statusCode: 200, body: created })
    } catch (error) {
        throw error
    }
}

module.exports = {
    create
}