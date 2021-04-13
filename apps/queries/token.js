const debug = require('debug')
const { token } = require('../models')
const log = debug('api-asrama:token:')
const { Op } = require('sequelize')

async function create (tokenCode) {
    log('create', tokenCode)
    try {
        let result = await token.create(tokenCode)
        log('results', result)

        return result
    } catch (error) {
        throw error
    }
}

module.exports = {
    create
}