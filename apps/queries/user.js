const debug = require('debug')
const { users, penghuni, kamar } = require('../models')
const log = debug('api-asrama:users:')
const { Op } = require('sequelize')

async function create (user) {
    log('create', user)
    try {
        let result = await users.create(user)
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function findByEmail (email) {
    log('findByEmail', email)
    try {
        let result = await users.findAll({ 
            where: { email: email, is_deleted: false },
            include: {
                model: penghuni
            },
            raw: true
        })
        log('results', result)
        return result
    } catch (error) {
        throw error
    }
}

async function findByNip (nip) {
    log('findByNip', nip)
    try {
        let result = await users.findAll({ 
            attributes: ['id', 'username', 'password', 'enabled', 'nama_lengkap', 'nip', 'email', 'id_token', 'is_verified', 'is_deleted', 'kewenangan_id', 'created_at', 'updated_at'],
            where: { nip: nip, is_deleted: false },
            include: [{ 
                model: penghuni,
                attributes: [['id', 'userId'], 'nik', 'jenis_kelamin', 'alamat', 'no_telepon', 'is_deleted'],
                as: 'userDetail',
                include: [
                    {
                        model: kamar,
                        attributes: ['id', 'nama_kamar', 'kapasitas', 'status', ['id_asrama', 'asrama'], ['id_lantai', 'lantai'], ['id_gambar', 'gambar']] 
                    }
                ] 
            }],
            mapToModel: true
        })
        log('results', result)
        return result[0]
    } catch (error) {
        throw error
    }
}

module.exports = {
    create, 
    findByEmail,
    findByNip
}