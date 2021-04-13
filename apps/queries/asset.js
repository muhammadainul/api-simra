const { isEmpty } = require('lodash')
const debug = require('debug')
const { 
    asrama,
    kamar, 
    gambar, 
    lantai, 
    kategori_asset,
    asset,
    sequelize 
} = require('../models')
const { Op } = require('sequelize')
const log = debug('api-asrama:queries:asset:')

async function getAll ({ assetId, options }) {
    log('getAll', assetId, options)
    try {
        let recordsTotal = await asset.count({
            where: {
                is_deleted: false
            }
        })
        let recordsFiltered = await asset.count({
            where: {
                is_deleted: false
            }
        })
        let data = await asset.findAll({
            include: [
                {
                    model: kategori_asset,
                    attributes: ['nama_kategori', 'deskripsi']
                },
                {
                    model: gambar,
                    attributes: ['filename', 'originalname']
                }, 
                {
                    model: kamar,
                    attributes: ['nama_kamar']
                },
                {
                    model: asrama,
                    attributes: ['nama_asrama']
                }
            ],
            where: {
                is_deleted: false
            },
            order: [['id', 'asc']],
            offset: options.skip,
            limit: options.limit
        })
        const result = { recordsFiltered, recordsTotal, data }
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function getAllSearch ({ assetId, options }) {
    log('getAllSearch', assetId, options)
    try {
        let recordsTotal = await asset.count({
            where: {
                is_deleted: false
            }
        })
        if (isEmpty(assetId)) return { recordsFiltered: 0, recordsTotal: recordsTotal, data: [] }
        else {
            var whereQuery = { 
                id: {
                    [Op.in]: assetId
                },
                is_deleted: false 
            }
            if (!isEmpty(options.idAsrama)) {
                var searchByAsrama = {
                    id_asrama: options.idAsrama
                }
            }
            if (!isEmpty(options.kategori)) {
                var searchByKategori = {
                    id_kategori: options.kategori
                }
            }
            let whereCondition = {
                ...whereQuery,
                ...searchByAsrama,
                ...searchByKategori
            }
            var queryFiltered = await asset.findAndCountAll({
                where: whereCondition
            })
            var queryData = await asset.findAll({
                include: [
                    {
                        model: kategori_asset,
                        attributes: ['nama_kategori', 'deskripsi']
                    },
                    {
                        model: gambar,
                        attributes: ['filename', 'originalname']
                    }, 
                    {
                        model: kamar,
                        attributes: ['nama_kamar']
                    },
                    {
                        model: asrama,
                        attributes: ['nama_asrama']
                    }
                ],
                where: whereCondition,
                order: [['id', 'asc']],
                offset: options.skip,
                limit: options.limit
            })
        }
        const result = { recordsFiltered: queryFiltered.count, recordsTotal, data: queryData }
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function getByName (nama_asset) {
    log('getByName', nama_asset)
    try {
        let result = await asset.findAll({
            where: {
                nama_asset: {
                    [Op.like]: `%${nama_asset}%`
                },
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
        let result = await asset.findAll({
            include: [
                {
                    model: kategori_asset,
                    attributes: ['nama_kategori', 'deskripsi']
                },
                {
                    model: gambar,
                    attributes: ['filename', 'originalname']
                }, 
                {
                    model: kamar,
                    attributes: ['nama_kamar']
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
            order: [['id', 'asc']]
        })
        log('results', result)
        return result[0]
    } catch (error) {
        tr
    }
}

async function findByIdKamar (id) {
    log('findByIdKamar', id)
    try {
        let result = await asset.findAll({
            include: [
                {
                    model: kategori_asset,
                    attributes: ['nama_kategori']
                },
                {
                    model: kamar
                },
                {
                    model: gambar,
                    attributes: ['filename', 'originalname']
                }
            ],
            where: {
                id_kamar: id
            },
            order: [['id']]
        })
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function create (formData) {
    log('create', formData)
    try {
        let result = await asset.create(formData)
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function editById (formData, id) {
    log('editById', formData, id)
    try {
        let result = await asset.update(formData, {
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
        let result = await asset.update(
            { is_deleted: true },
            { where: { id: id} }
        )
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

module.exports = {
    getAll,
    getAllSearch,
    getByName,
    findById,
    findByIdKamar,
    create,
    editById,
    deleteById
}