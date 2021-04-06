const debug = require('debug')
const { users, penghuni } = require('../models')
const log = debug('api-simra:penghuni:')
const { Op } = require('sequelize')

async function findByPhone (no_telepon) {
    log('findByPhone', no_telepon)
    try {
        let result = await penghuni.findAll({ 
            where: { no_telepon: no_telepon, is_deleted: false },
            include: {
                model: users,
                required: true
            },
            mapToModel: true
        })
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function create (penghuniData) {
    log('create', { penghuniData })
    try {
        let result = await penghuni.create(penghuniData)
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

module.exports = {
    findByPhone,
    create
}