const debug = require('debug')
const moment = require('moment')
const { logs } = require('../models')
const { Op } = require('sequelize')
const log = debug('api-simra:queries:logs:')

async function create (data) {
    log('create: ', data)
    try {
        let result = await logs.create(data)
        log('result: ', result)
        return result
    } catch (error) {
        throw error
    }
}

module.exports = {
    create
}