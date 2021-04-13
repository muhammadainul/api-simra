'use strict'

const debug = require('debug')
const { isEmpty } = require('lodash')
const Lantai = require('../queries/lantai')
const log = debug('api-asrama:lantai:')

async function getLantai (req, res) {
    let data = req.body
    log('getLantai', data)
    try {
        const result = await Lantai.findAll()
        if (isEmpty(result)) return res.json({ statusCode: 404, data: [] })
        return res.json({ statusCode: 200, data: result })
    } catch (error) {
        throw error
    }
}

module.exports = {
    getLantai
}