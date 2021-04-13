const debug = require('debug')
const { isEmpty } = require('lodash')
const { 
    asrama,
    kamar, 
    gambar, 
    lantai, 
    asset,
    kategori_asset,
    sequelize 
} = require('../models')
const { Op } = require('sequelize')
const log = debug('api-asrama:queries:kategoriAsset')

async function getAll ({ kategoriAssetId, options }) {
    log('getAll', kategoriAssetId, options)
    try {
        let recordsTotal = await kategori_asset.count({
            where: {
                is_deleted: false
            }
        })
        let recordsFiltered = await kategori_asset.count({
            where: {
                is_deleted: false
            }
        })
        let data = await kategori_asset.findAll({
            where: { is_deleted: false },
            order: [['id', 'asc']],
            offset: options.skip,
            limit: options.limit,
            mapToModel: true
        })
        const result = { recordsFiltered, recordsTotal, data }
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function getAllSearch ({ kategoriAssetId, options }) {
    log('getAllSearch', kategoriAssetId, options)
    try {
        let recordsTotal = await kategori_asset.count({
            where: { 
                is_deleted: false
            }
        })
        if (isEmpty(kategoriAssetId)) return { recordsFiltered: 0, recordsTotal: recordsTotal, data: [] }
        else {
            var whereQuery = {
                id: {
                    [Op.in]: kategoriAssetId
                },
                is_deleted: false
            }
            let whereCondition = {
                ...whereQuery
            }
            
            var queryFiltered = await kategori_asset.findAndCountAll({
                where: whereCondition
            })
            var queryData = await kategori_asset.findAll({
                where: whereCondition,
                order: [['id', 'asc']],
                offset: options.skip,
                limit: options.limit,
                mapToModel: true
            })
            const result = { recordsFiltered: queryFiltered.count, recordsTotal, data: queryData }
            log('results', result)
            return result
        }
    } catch (error) {
        throw error
    }
}

async function findAll () {
    log('findAll')
    try {
        let result = await kategori_asset.findAll({
            where: {
                is_deleted: false
            },
            order: [['id']]
        })
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function getByName (nama_kategori) {
    log('getByName', nama_kategori)
    try {
        let result = await kategori_asset.findAll({
            where: {
                nama_kategori: {
                    [Op.like]: `%${nama_kategori}%`
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
        let result = await kategori_asset.findAll({
            where: { 
                id: id,
                is_deleted: false 
            },
            order: [['id']]
        })
        log('results', result)
        return result[0]
    } catch (error) {
        throw error
    }
}

async function findByName (nama_kategori) {
    log('findByName', nama_kategori)
    try {
        let result = await kategori_asset.findAll({
            where: {
                nama_kategori: nama_kategori,
                is_deleted: false
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
        let result = await kategori_asset.create(data)
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function editById (formData, id) {
    log('editById', formData, id)
    try {
        let result = await kategori_asset.update(formData, {
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
        let result = await kategori_asset.update(
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
    getAll,
    getAllSearch,
    getByName,
    findAll,
    findById, 
    findByName,
    create,
    editById,
    deleteById
}