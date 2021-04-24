const debug = require('debug')
const { users, penghuni } = require('../models')
const log = debug('api-asrama:penghuni:')
const { Op } = require('sequelize')
const { isEmpty } = require('lodash')

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

async function findByNik (nik) {
    log('findByNik', nik)
    try {
        const result = await penghuni.findOne({
            where: { nik, is_deleted: false }
        })
        log('results', result)
        if (isEmpty(result)) return result
        return result[0]
    } catch (error) {
        throw error
    }
}

async function findByIdKamar (id_kamar) {
    log('findByIdKamar', id_kamar)
    try {
        const result = await penghuni.findAll({
            where: { id_kamar, is_deleted: false }
        })
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function create (penghuniData, createUsers) {
    log('create', { penghuniData, createUsers })
    try {
        const result = await penghuni.create({
            nik: penghuniData.nik,
            jenis_kelamin: penghuniData.jenis_kelamin,
            alamat: penghuniData.alamat,
            no_telepon: penghuniData.no_telepon,
            id_kamar: penghuniData.id_kamar,
            id_users: createUsers
        })
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function editById (data, id) {
    log('editById', { data, id })
    try {
        const result = await penghuni.update({ nik: data.nik, jenis_kelamin: data.jenis_kelamin, alamat: data.alamat, no_telepon: data.no_telepon }, { where: { id }})
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function updateSetNull (id) {
    log('updateSetNull', id)
    try {
        const result = await penghuni.update({ id_kamar: null }, { where: { id }})
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

module.exports = {
    findByPhone,
    findByNik,
    findByIdKamar,
    create,
    editById,
    updateSetNull
}