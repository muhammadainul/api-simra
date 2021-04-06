const debug = require('debug')
const { lantai } = require('../models')
const log = debug('api-simra:queries:lantai:')
const { Op } = require('sequelize')
const { isEmpty } = require('lodash')

async function findAll () {
    log('findAll')
    try {
        let result = await lantai.findAll({
             where: { is_deleted: false },
             raw: true
        })
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

module.exports = {
    findAll
}