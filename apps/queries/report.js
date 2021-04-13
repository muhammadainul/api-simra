const debug = require('debug')
const { includes } = require('lodash')
const _ = require('lodash')
const { 
    users, 
    penghuni, 
    kamar, 
    asrama,
    asset, 
    keluhan,
    logs,
    reservasi,
    lantai,
    Sequelize,
    sequelize
 } = require('../models')
const { Op } = require('sequelize')
const log = debug('api-asrama:queries:')

async function getTotalCounts () {
    log('getTotalCounts: ')
    try {
        let totalAsrama = await asrama.count()
        let totalKamar = await kamar.count()
        let totalAsset = await asset.count()
        let totalKeluhan = await keluhan.count()
        let totalLogs = await logs.count()
        let totalPenghuni = await penghuni.count()
        let totalReservasi = await reservasi.count()
        let dataAsramaL = await kamar.findAll({
            attributes: ['id', 'nama_kamar', 'status'],
            include: [
                {
                    model: lantai,
                    attributes: ['lantai'],
                },
                {
                    model: asrama,
                    attributes: ['nama_asrama'],
                }  
            ],
            where:  {
                [Op.and]: [
                    sequelize.literal("asrama.nama_asrama = 'A (Laki-laki)'"), 
                    sequelize.literal("lantai.lantai = '3'"),
                ]
            },
            order: [[ 'nama_kamar', 'ASC']]
        })

        const result = { totalAsrama, totalKamar, totalAsset, totalKeluhan, totalLogs, totalPenghuni, totalReservasi, dataAsramaL }
        log('result', result)
        return result
    } catch (error) {
        throw error
    }
}

module.exports = {
    getTotalCounts
}