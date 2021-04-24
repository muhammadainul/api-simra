const debug = require('debug')
const { isEmpty, assign } = require('lodash')
const { kamar, kartu, asrama, sequelize } = require('../models')
const { Op } = require('sequelize')
const log = debug('api-asrama:queries:kartu:')

async function getAllSearch ({ kartuId, idAsrama, options }) {
    log('getAllSearch', { kartuId, idAsrama, options })
    try {
        let recordsTotal = await kartu.count({
            where: { is_deleted: false }
        })
        if (isEmpty(kartuId)) return { recordsFiltered: 0, recordsTotal: recordsTotal, data: [] }
        else {
            var whereQuery = { 
                id: {
                    [Op.in]: kartuId
                },
                is_deleted: false
            }
            if (!isEmpty(idAsrama)) {
                var searchByAsrama = { 
                    '$kamar.asrama.id$': { [Op.eq]: idAsrama }
                }
            }
            if (!isEmpty(options.namaKamar)) {
                var searchByKamar = {
                    [Op.eq]: sequelize.literal(`kamar.nama_kamar = '${options.namaKamar}'`) 
                }
            }
            if (!isEmpty(options.status)) { 
                var searchByStatus = {
                    status: options.status
                }
            }
            var whereCondition = {
                ...whereQuery,
                ...searchByAsrama,
                ...searchByKamar,
                ...searchByStatus
            }
            var queryFiltered = await kartu.findAndCountAll({
                include: [
                    { 
                        model: kamar,
                        include: 
                            {
                                model: asrama
                            }
                    }
                ],
                required: false,
                where: whereCondition
            })
            var queryData = await kartu.findAll({
                include: [
                    { 
                        model: kamar,
                        required: false,
                        include: [
                            {
                                model: asrama,
                                required: false,
                            }
                        ]
                    }
                ],
                required: false,
                where: whereCondition,
                order: [['status', 'asc']],
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
        let recordsTotal = await kartu.count({ 
            where: { is_deleted: false }
        })
        let recordsFiltered = await kartu.count({
            where: { is_deleted: false }
        })
        let data = await kartu.findAll({
            include: [
                {
                    model: kamar,
                    attributes: ['nama_kamar'],
                    include: {
                        model: asrama,
                        attributes: ['nama_asrama']
                    }   
                }
            ], 
            order: [[ 'status', 'asc']],
            offset: options.skip,
            limit: options.limit,
            mapToModel: true
        })
        const result = { recordsFiltered, recordsTotal, data }
        log('results', JSON.stringify(result))
        return result
    } catch (error) {
        throw error
    }
}

async function getByRfid (rfid) {
    log('getByRfid', rfid)
    try {
        let result = await kartu.findAll({ 
            where: {
                rfid: {
                    [Op.like]: `%${rfid}%`
                }
            }
        })
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function findAll () {
    log('findAll')
    try {  
        let result = await kartu.findAll({
            where: {
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
        let result = await kartu.findAll({
            where: {
                id: id,
                is_deleted: false
            }
        })
        log('results', result)
        return result[0]
    } catch (error) {
        throw error
    }
}

async function findByRfid (rfid) {
    log('findByRfid', rfid)
    try {
        let result = await kartu.findAll({
            where: {
                rfid: rfid,
                is_deleted: false
            }
        })
        log('results', result)
        return result[0]
    } catch (error) {
        throw error
    }
}

async function findByKamar (id_kamar) {
    log('findByKamar', id_kamar)
    try {
        let result = await kartu.findAll({
            include: { model: kamar },
            where: {
                id_kamar: id_kamar,
                is_deleted: false
            },
            mapToModel: true
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
        if (isEmpty(formData.id_kamar)) { 
            var result = await kartu.create({ rfid: formData.rfid, status: 0 })
        } else {
            var result = await kartu.create({ rfid: formData.rfid, id_kamar: formData.id_kamar, status: 1 })
        }
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function findByRfidStatus (newRfid) {
    log('findByRfidStatus', newRfid)
    try {
        let result = await kartu.findAll({
            include: [
                { model: kamar, attributes: ['nama_kamar'] }
            ],
            where: {
                rfid: {
                    [Op.and]: [ 
                        sequelize.literal("kartu.status = 0 OR kartu.status = 1") 
                    ]
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

async function update (data, now, id) {
    log('update', data, now, id)
    try {
        if (isEmpty(data.newRfid)) { 
            var query = await kartu.update({
                status: 1,
                id_kamar: data.id_kamar,
                updated_at: now
            }, 
            { 
                where: {
                    id: id
                }
            })
        } else {
            var exists = await kartu.findAll({
                where: {
                    rfid: data.newRfid,
                    status: 0
                }
            })
            if (isEmpty(exists)) {
                var query = await kartu.create({ rfid: data.newRfid, id_kamar: data.id_kamar, status: 1 })
                var query = await kartu.update({ status: 2, updated_at: now }, { where: { id: id } })
            } else {
                var query = await kartu.update({ status: 1, id_kamar: data.id_kamar, updated_at: now }, { where: { id: exists[0].id }})
                var query = await kartu.update({ status: 2, updated_at: now }, { where: { id: id }})
            }
        }
        log('result', query)
        return query
    } catch (error) {
        throw error
    }
}

module.exports = {
    getAllSearch,
    getAll,
    getByRfid,
    findAll,
    findById,
    findByRfid,
    findByKamar,
    findByRfidStatus,
    create,
    update
}
