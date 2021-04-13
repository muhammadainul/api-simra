const debug = require('debug')
const moment = require('moment')
const { isEmpty } = require('lodash')
const { logs, users } = require('../models')

const { Op } = require('sequelize')
const log = debug('api-asrama:queries:logs:')

async function getAll ({ logsId, options }) {
    log('getAll', logsId, options)
    try {
        let recordsTotal = await logs.count()
        let recordsFiltered = await logs.count()
        let data = await logs.findAll({
            include: [
                { model: users, attributes: ['nama_lengkap'] }
            ],
            order: [['logdetail', 'desc']],
            offset: options.skip,
            limit: options.limit
        })
        const results = { recordsFiltered, recordsTotal, data }
        log('results', results)
        return results
    } catch (error) {
        throw error
    }
}

async function getAllSearch ({ logsId, options }) {
    log('getAllSearch', logsId, options)
    try {
        let recordsTotal = await logs.count()
        if (isEmpty(logsId)) return { recordsFiltered: 0, recordsTotal, data: [] }
        else {
            let recordsFiltered = await logs.count()
            let data = await logs.findAll({
                include: [
                    { model: users, attributes: ['nama_lengkap'] }
                ],
                where: { id: { [Op.in]: logsId }},
                order: [['logdetail', 'desc']],
                offset: options.skip,
                limit: options.limit
            })
            const results = { recordsFiltered: recordsFiltered, recordsTotal: recordsTotal, data: data }
            log('results', results)
            return results
        }
    } catch (error) {
        throw error
    }
}

async function getByName (nama_lengkap) {
    log('getByName', nama_lengkap)
    try {
        let result = await users.findAll({
            where:{
                nama_lengkap: {
                    [Op.like]: `%${nama_lengkap}%`
                }
            }
        })
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function create (data) {
    log('create', data)
    try {
        let result = await logs.create(data)
        log('result: ', result)
        return result
    } catch (error) {
        throw error
    }
}

module.exports = {
    getAll,
    getAllSearch,
    getByName,
    create
}