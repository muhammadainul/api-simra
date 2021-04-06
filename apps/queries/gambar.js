const debug = require('debug')
const _ = require('lodash')
const { asrama, kamar, gambar } = require('../models')
const { Op } = require('sequelize')
const log = debug('api-simra:queries:gambar:')

async function create (data) {
    log('create', data)
    try {
        let result = await gambar.create(data)
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function editById (formDataImage, id) {
    log('editById', formDataImage, id)
    try {
        let result = await gambar.update(formDataImage, {
            where: {
                id: id
            }
        })
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

module.exports = {
    create,
    editById
}