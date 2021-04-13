const { isEmpty } = require('lodash')
const debug = require('debug')
const Kartu = require('../queries/kartu')
const moment = require('moment')
const log = debug('api-asrama:kartu:')

async function getAll (req, res) {
    let data = req.body
    log('[api-asrama][kartu] getAll', data)
    try {
        let kartuId = []
        let options = {
            skip: Number(data.start),
            limit: Number(data.length),
            status: data.searchByStatus,
            namaKamar: data.searchByKamar,
            sort: data.searchOrder
        }
        if (!isEmpty(data.search.value) || !isEmpty(data.searchByStatus) || !isEmpty(data.searchByAsrama) || !isEmpty(data.searchByKamar)) {
            const detail = await Kartu.getByRfid(data.search.value)
            if (!isEmpty(detail)) {
                detail.forEach(row => {
                    kartuId.push(row.id)
                })
            }
            const result = await Kartu.getAllSearch({ kartuId, idAsrama: data.searchByAsrama, options })
            let idKartu = []
            result.data.forEach(data => {
                idKartu.push(data.idKartu)
            })

            result.draw = data.draw
            return res.status(200).json({ status: 200, body: result })
        } else {
            const result = await Kartu.getAll({ kartuId, options })
            result.draw = data.draw
            return res.status(200).send({ status: 200, body: result })
        }
    } catch (error) {
        throw error
    }
}

async function getKartu (req, res) {
    log('[api-asrama][kartu] getKartu')
    try {
        const result = await Kartu.findAll()
        return res.status(200).json({ status: 200, data: result })
    } catch (error) {
        throw error
    }
}

async function getById (req, res) {
    let param = req.params
    log('[api-asrama][kartu] getById', param)
    try {
        const exists = await Kartu.findById(param.id)
        if (isEmpty(exists)) return res.status(200).json({ status: 400, message: 'Kartu tidak ditemukan.' })

        return res.status(200).json({ status: 200, data: exists })
    } catch (error) {
        throw error
    }
}

async function addKartu (req, res) {
    let data = req.body
    log('[api-asrama][kartu] addKartu', data)
    try {
        let formData = {
            rfid: data.rfid,
            id_kamar: isEmpty(data.id_kamar) ? '' : data.id_kamar
        }

        const checkRfid = await Kartu.findByRfid(data.rfid)
        if (checkRfid) return res.status(200).json({ status: 400, message: 'Gagal menambahkan data. RFID sudah terdaftar', data: checkRfid })

        if (!isEmpty(data.id_kamar)) {
            const checkStatus = await Kartu.findByKamar(data.id_kamar)
            if (checkStatus.length == 4) return res.status(200).json({
                status: 400,
                message: `Tidak dapat menambahkan kartu RFID dengan kamar ${checkStatus[0].kamar.nama_kamar}. Jumlah yang digunakan sudah memenuhi batas(max 4 kartu).` 
            })
        }

        const created = await Kartu.create(formData)
        if (!created) return res.status(200).json({ status: 400, message: 'Gagal menambahkan data.', body: created })

        return res.status(200).json({ status: 200, message: 'Data kartu berhasil ditambah', body: created })
    } catch (error) {
        throw error
    }
}

async function updateKartu (req, res) {
    let data = req.body
    let param = req.params
    log('[api-asrama][kartu] updateKartu', data, param)
    try {
        let id = param.id
        let now = moment().format('YYYY-MM-DD hh:mm:ss')
        
        if (!isEmpty(data.id_kamar) && isEmpty(data.newRfid)) {
            const checkStatus = await Kartu.findByKamar(data.id_kamar)
            if (checkStatus.length == 4) return res.status(200).json({
                status: 400,
                message: `Tidak dapat menambahkan kartu RFID dengan kamar ${checkStatus[0].kamar.nama_kamar}. Jumlah yang digunakan sudah memenuhi batas(max 4 kartu).`
            })
        }
        if (!isEmpty(data.newRfid)) {
            const checkRfid = await Kartu.findByRfidStatus(data.newRfid)
            if (checkRfid.id_kamar) return res.status(200).json({ 
                status: 400, 
                message: `Gagal mengubah data. Tidak dapat menggunakan kartu yang sudah digunakan kamar ${checkRfid.nama_kamar}.`
            })

            const updated = await Kartu.update(data, now, id)
            return res.status(200).json({ status: 200, message: 'Data berhasil disimpan.', body: updated })
        }

        const updated = await Kartu.update(data, now, id)
        if (!updated) return res.status(200).send({ status: 400, message: 'Gagal mengubah data.', body: updated })

        return res.status(200).json({ status: 200, message: 'Data berhasil disimpan.', body: updated })
    } catch (error) {
        throw error
    }
}

module.exports = {
    getAll,
    getKartu,
    getById,
    addKartu,
    updateKartu
}