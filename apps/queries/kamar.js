const debug = require('debug')
const { isEmpty } = require('lodash')
const { 
    asrama,
    kamar, 
    gambar, 
    lantai, 
    sequelize 
} = require('../models')
const { Op } = require('sequelize')
const log = debug('api-asrama:queries:kamar:')

async function getAllSearch ({ idAsrama, kamarId, options }) {
    log('getAllSearch', idAsrama, kamarId, options)
    try {
        let recordsTotal = await kamar.count({
            where: { 
                is_deleted: false
            }
        })
        if (isEmpty(kamarId)) return { recordsFiltered: 0, recordsTotal: recordsTotal, data: [] }
        else {
            var whereQuery = { 
                id: {
                    [Op.in]: kamarId
                },
                is_deleted: false
            }
            
            if (!isEmpty(idAsrama)) {
                var searchByAsrama = {
                    [Op.and]: [
                        sequelize.literal(`asrama.id = '${idAsrama}'`)
                    ]
                }
            }
            if (!isEmpty(options.status)) {
                var searchByStatus = {
                    status: options.status
                }
            }

            let whereCondition = {
                ...whereQuery,
                ...searchByAsrama,
                ...searchByStatus
            }
            var queryFiltered = await kamar.findAndCountAll({
                include: [
                    { 
                        model: asrama
                    }
                ],
                where: whereCondition
            })
            var queryData = await kamar.findAll({
                include: [
                    {
                        model: asrama,
                        attributes: ['id', 'nama_asrama']
                    },
                    {
                        model: gambar,
                        attributes: ['id', 'filename', 'originalname']
                    }
                ],
                where: whereCondition,
                offset: options.skip,
                limit: options.limit,
                mapToModel: true
            })
        }
        const result = { recordsFiltered: queryFiltered.count, recordsTotal, data: queryData }
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function getAll ({ options }) {
    log('getAll', options)
    try {
        let recordsTotal = await kamar.count({
            where: { is_deleted: false }
        })
        let recordsFiltered = await kamar.count({
            where: { is_deleted: false }
        })
        let data = await kamar.findAll({
            include: [
                {
                    model: asrama,
                    attributes: ['id', 'nama_asrama']
                },
                {
                    model: gambar,
                    attributes: ['id', 'filename', 'originalname']
                }
            ],
            where: { is_deleted: false },
            order: [[ 'nama_kamar', 'asc' ]],
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

async function getByName (nama_kamar) {
    log('getByName', nama_kamar)
    try {
        let result = await kamar.findAll({
            where: {
                nama_kamar: {
                    [Op.like]: `%${nama_kamar}%`
                }
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
        let result = await kamar.findAll({
            include: [
                {
                    model: gambar,
                    attributes: [['id', 'idGambar'], 'filename'],
                    require: true
                },
                {
                    model: lantai,
                    attributes: ['lantai'],
                    require: true
                },
                {
                    model: asrama,
                    attributes: ['nama_asrama']
                }
            ],
            where: {
                id: id,
                is_deleted: false
            },
            mapToModel: true
        })
        log('results', result)
        return result[0]
    } catch (error) {
        throw error
    }
}

async function findAll () {
    log('findAll')
    try {
        let result = await kamar.findAll({
            include: [
                { model: asrama, attributes: ['nama_asrama'] }
            ],
            where: {
                is_deleted: false
            },
            order: [['nama_kamar', 'asc']]
        })
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function checkIfAvailable (id) {
    log('checkIfAvailable', id)
    try {
        const result = await kamar.findAll({ where: { id: id, is_deleted: false }})
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function getByLantai (id) {
    log('getByLantai', id)
    try {
        let result = await kamar.findAll({
            include: [
                {
                    model: asrama,
                    attributes: ['nama_asrama']
                },
                {
                    model: lantai,
                    attributes: ['lantai']
                }
            ],
            where: {
                id_lantai: id,
                is_deleted: false
            },
            order: ['nama_kamar', 'asc']
        })
        log('results', result)
    } catch (error) {
        throw error
    }
}

async function create (formData) {
    log('create', formData)
    try {
        let result = await kamar.create(formData)
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function editById (formData, id) {
    log('editById', formData, id)
    try {
        let result = await kamar.update(formData, {
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

async function updateById (id_kamar) {
    log('updateById', id_kamar)
    try {
        const result = await kamar.update({ status: 1 }, { where: { id: id_kamar } })
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function updateStatus (id) {  
    log('updateStatus', id) 
    try {
        const result = await kamar.update({ status: 0 }, { where: { id }})
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function deleteById (id) {
    log('deleteById', id)
    try {
        let result = await kamar.update(
            { is_deleted: true }, 
            { where: { id: id }}
        )
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

module.exports = {
    getByName,
    getAllSearch,
    getAll,
    checkIfAvailable,
    findById,
    findAll,
    getByLantai,
    create,
    editById,
    updateById,
    updateStatus,
    deleteById
}