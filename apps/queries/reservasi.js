const debug = require('debug')
const moment = require('moment')
const { isEmpty } = require('lodash')
const { 
    asrama,
    kamar, 
    gambar, 
    lantai, 
    reservasi,
    users,
    penghuni,
    sequelize 
} = require('../models')
const { Op } = require('sequelize')
const log = debug('api-asrama:queries:reservasi:')

async function getAllSearch ({ idAsrama, userId, options, status, draw }) {
    log('getAll', { idAsrama, userId, options, status, draw })
    try {
        let dateStr = options.searchByDate
        let startDate = dateStr.split('-')[0]
        let endDate = dateStr.split('-')[1]
        
        if (isEmpty(userId)) return { recordsFiltered: 0, recordsTotal: 0, data: [] }
        else {
            let whereCondition = {
                '$penghuni.user.id$' : { [Op.in]: userId },
                is_deleted: false
            }
            if (!isEmpty(idAsrama)) {
                var whereByAsrama = { '$asrama.id$': { [Op.eq]: idAsrama }}
            }
            if (!isEmpty(startDate)) {
                var whereByStartDate = { tgl_cekin: { [Op.gte]: moment(startDate).format('MM DD, YYYY') }}
            }
            if (!isEmpty(endDate)) {
                var whereByEndDate = { tgl_cekin: { [Op.lte]: moment(endDate).format('MM DD, YYYY') }}
            }
            if (!isEmpty(status)) {
                var whereByStatus = { status }
            }
            let where = {
                ...whereCondition,
                ...whereByAsrama,
                ...whereByStartDate,
                ...whereByEndDate,
                ...whereByStatus
            } 
            var [recordsTotal, recordsFiltered, data] = await Promise.all([
                reservasi.count({}),
                reservasi.count({ 
                    include: [ 
                        { model: asrama },
                        { model: kamar },
                        { model: penghuni, include: { model: users, attributes: [['id', 'id_users'], 'nip', 'nama_lengkap'] }}
                    ],
                    where
                }),
                reservasi.findAll({
                    attributes: [
                        'id',
                        'tgl_reservasi',
                        ['status', 'statusReservasi'],
                        'tgl_cekin',
                        'tgl_cekout',
                        'created_at',
                        'id_reservasi',
                        'id_asrama',
                        [sequelize.col('asrama.nama_asrama'), 'nama_asrama'],
                        'id_kamar',
                        [sequelize.col('kamar.nama_kamar'), 'nama_kamar'],
                        [sequelize.col('kamar.status'), 'status'],
                        [sequelize.col('kamar.id_gambar'), 'id_gambar'],
                        'id_penghuni',
                        [sequelize.col('penghuni.nik'), 'nik']
                    ],
                    include: [
                        { model: asrama },
                        { model: kamar },
                        { model: penghuni, include: { model: users } }
                    ],
                    where,
                    order: [['id', 'desc']],
                    offset: options.skip,
                    limit: options.limit
                })
            ])
        }

        return {
            draw,
            recordsTotal,
            recordsFiltered,
            data
        }
    } catch (error) {
        throw error
    }
}

async function getAll ({ userId, options, draw }) {
    log('getAll', { userId, options, draw })
    try {
        const [recordsTotal, recordsFiltered, data] = await Promise.all([
            reservasi.count(),
            reservasi.count({ where: { tgl_cekout: null }}),
            reservasi.findAll({
                attributes: [
                    'id',
                    'tgl_reservasi',
                    ['status', 'statusReservasi'],
                    'tgl_cekin',
                    'tgl_cekout',
                    'created_at',
                    'id_reservasi',
                    'id_asrama',
                    [sequelize.col('asrama.nama_asrama'), 'nama_asrama'],
                    'id_kamar',
                    [sequelize.col('kamar.nama_kamar'), 'nama_kamar'],
                    [sequelize.col('kamar.status'), 'status'],
                    [sequelize.col('kamar.id_gambar'), 'id_gambar'],
                    'id_penghuni',
                    [sequelize.col('penghuni.nik'), 'nik']
                ],
                include: [
                    { model: asrama },
                    { model: kamar },
                    {
                        model: penghuni, 
                        include: { model: users }
                    }
                ],
                order: [['id', 'desc']],
                offset: options.skip,
                limit: options.limit
            })
        ])

        return { draw, recordsTotal, recordsFiltered, data }
    } catch (error) {
        throw error
    }
}

async function getByName (nama_lengkap) {
    log('getByName', nama_lengkap)
    try {
        const result = await users.findAll({
            where: { 
                nama_lengkap: { 
                    [Op.like]: `%${nama_lengkap}%` 
                }
            },
            raw: true
        })
        log('response', result)
        return result
    } catch (error) {
        throw error
    }
}

async function findById (id) {
    log('findById', id)
    try {
        const result = await reservasi.findOne({
            attributes: [
                'id',
                'id_reservasi',
                'id_penghuni',
                'tgl_cekin',
                'tgl_cekout',
                'tgl_reservasi',
                [sequelize.col('reservasi.status'), 'status'],
                [sequelize.col('penghuni.id'), 'idTamu'],
                [sequelize.col('penghuni.nik'), 'nik'],
                [sequelize.col('penghuni.jenis_kelamin'), 'jenis_kelamin'],
                [sequelize.col('penghuni.alamat'), 'alamat'],
                [sequelize.col('penghuni.no_telepon'), 'no_telepon'],
                'id_kamar',
                [sequelize.col('kamar.nama_kamar'), 'nama_kamar'],
                'id_asrama',
                [sequelize.col('asrama.nama_asrama'), 'nama_asrama'],
            ],
            include: [
                { 
                    model: penghuni,
                    include: { model: users, attributes: [['id', 'idUsers'], 'nama_lengkap', 'nip'] }
                }, 
                { model: kamar },
                { model: asrama }
            ],
            where: { id, is_deleted: false },
        })
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function findByIdPenghuni (id) {
    log('findByIdPenghuni', id)
    try {
        const result = await reservasi.findOne({
            attributes: [
                'id_penghuni',
                [sequelize.col('penghuni.id'), 'idTamu'],
                [sequelize.col('penghuni.nik')],
                [sequelize.col('penghuni.jenis_kelamin')],
                [sequelize.col('penghuni.alamat')],
                [sequelize.col('penghuni.no_telepon')],
                'id_kamar',
                [sequelize.col('kamar.nama_kamar')],
                'id_asrama',
                [sequelize.col('asrama.nama_asrama')],
            ],
            include: [
                { 
                    model: penghuni,
                    include: { model: users, attributes: [['id', 'idUsers'], 'nama_lengkap', 'nip'] }
                }, 
                { model: kamar },
                { model: asrama }
            ],
            where: { id_tamu: id, tgl_cekout: null, is_deleted: false },
        })
        log('results', result)
        return result[0]
    } catch (error) {
        throw error
    }
}

async function create (formData) {
    log('create', formData)
    try {
        const result = await reservasi.create({
            id_asrama: formData.id_asrama,
            id_kamar: formData.id_kamar,
            tgl_cekin: formData.tgl_cekin,
            status: formData.status,
            id_penghuni: formData.id_penghuni,
            id_reservasi: formData.id_reservasi
        })
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function editById (formData, id) {
    log('editById', { formData, id })
    try {
        const result = await reservasi.update(formData, { where: { id }})
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function checkIn (id, today) {
    log('checkInReservasi', { id, today })
    try {
        const result = await reservasi.update({ status: 2 }, { where: { id }})
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function checkOut (id, today) {
    log('checkOutReservasi', { id, today })
    try {
        const result = await reservasi.update({ tgl_cekout: today, status: 3 }, { where: { id }})
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

module.exports = {
    getAllSearch,
    getAll,
    getByName,
    findById,
    findByIdPenghuni,
    create,
    editById,
    checkIn,
    checkOut
}
