const debug = require('debug')
const _ = require('lodash')
const { asrama, kamar, gambar } = require('../models')
const { Op } = require('sequelize')
const log = debug('api-asrama:queries:asrama:')

async function getAllSearch ({ asramaId, options }) {
    log('getAllSearch', asramaId, options)
    try {
        let recordsTotal = await asrama.count({
            where: {
                is_deleted: false
            }
        })
        if (_.isEmpty(asramaId)) return { recordsFiltered: 0, recordsTotal: recordsTotal, data: [] }
        else {
            var recordsFiltered = await asrama.count({
                where: {
                    id: [asramaId],
                    is_deleted: false
                }
            })
            var data = await asrama.findAll({
                include: {
                    model: gambar,
                    attributes: ['filename']
                },
                where: {
                    id: [asramaId],
                    is_deleted: false
                },
                order: [
                    ['id', 'desc']
                ],
                offset: options.skip,
                limit: options.limit,
                mapToModel: true
            })
            const result = { recordsFiltered: recordsFiltered, recordsTotal: recordsTotal, data: data }
            log('results', result)
            return result
        }
    } catch (error) {
        throw error
    }
}

async function getAll ({ options }) {
    log('getAll', options)
    try {
        let recordsTotal = await asrama.count({
            where: { is_deleted: false }
        })
        let recordsFiltered = await asrama.count({
            where: { is_deleted: false }
        })
        let data = await asrama.findAll({
            include: [{
                model: gambar,
                attributes: [['id', 'filesId'], 'filename', 'originalname', 'path'],
                as: 'files'
            }],
            order: [[ 'id', 'asc' ]],
            offset: options.skip,
            limit: options.limit,
            mapToModel: true
        })
        const result = { recordsFiltered: recordsFiltered, recordsTotal: recordsTotal, data: data }
        log('results', result)
        return result
    } catch (error) {   
        throw error
    }
}

async function findAll () {
    log('findAll')
    try {
        let result = await asrama.findAll({
            where: { is_deleted: false },
            order: [[ 'id', 'asc' ]],
            mapToModel: true
        })
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function getByName (nama_asrama) {
    log('getByName', nama_asrama)
    try {
        let result = await asrama.findAll({
            where: {
                nama_asrama: { 
                    [Op.like]: `%${nama_asrama}%`
                }
            }
        })
        log('result', result)
        return result
    } catch (error) {
        throw error
    }
}

async function findByName (nama_asrama) {
    log('findByName', nama_asrama)
    try {
        let result = await asrama.findAll({
            where: {
                nama_asrama: nama_asrama,
                is_deleted: false
            }
        })
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function findById (id) {
    log('findById', id)
    try {
        let result = await asrama.findAll({
            include: {
                model: gambar,
                as: 'files'
            },
            where: {
                id: id
            },
            mapToModel: true
        })
        log('results', result)
        return result[0]
    } catch (error) {
        throw error
    } 
}

async function create (data) {
    log('create', data)
    try {
        let result = await asrama.create(data)
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function editById (formData, id) {
    log('editById', formData)
    try {
        let result = await asrama.update(formData, {
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

async function deleteById (id) {
    log('deleteById', id)
    try {
        let result = await asrama.destroy({
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
    getAllSearch,
    getAll,
    findAll,
    getByName,
    findByName,
    findById,
    create,
    editById,
    deleteById
}