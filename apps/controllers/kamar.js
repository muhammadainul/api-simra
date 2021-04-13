const debug = require('debug')
const { isEmpty } = require('lodash')
const Gambar = require('../queries/gambar')
const Kamar = require('../queries/kamar')
const log = debug('api-asrama:kamar:')

async function getAll (req, res) {
    let data = req.body
    log('[api-asrama][kamar] getAll', data)
    try {
        let kamarId = []
        let options = {
            skip: Number(data.start),
            limit: Number(data.length),
            sort: data.searchOrder,
            status: data.searchByStatus
        }
        if (!isEmpty(data.search.value) || !isEmpty(data.searchByStatus) || !isEmpty(data.searchByAsrama)) {
            const detail = await Kamar.getByName(data.search.value)
            if (!isEmpty(detail)) {
                detail.forEach(row => {
                    kamarId.push(row.id)
                })
            }
            const result = await Kamar.getAllSearch({ idAsrama: data.searchByAsrama, kamarId, options })
            let idKamar = []
            result.data.forEach(data => {
                idKamar.push(data.idKamar)
            })
            
            result.draw = data.draw
            return res.status(200).send({ status: 200, body: result })
        } else {
            const result = await Kamar.getAll({ kamarId, options })
            result.draw = data.draw
            return res.status(200).send({ status: 200, body: result })
        }
    } catch (error) {
        throw error
    }
}

async function getKamar (req, res) {
    log('[api-asrama][kamar] getKamar')
    try {
        const result = await Kamar.findAll()
        return res.status(200).json({ status: 200, data: result })
    } catch (error) {
        throw error
    }
}

async function getKamarByLantai (req, res) {
    let data = req.body
    log('[api-asrama][kamar] getKamarByLantai', data)
    try {
        let id = data.id
        const result = await Kamar.getByLantai(id)
        if (isEmpty(result)) return res.status(200).json({ status: 200, data: [] })

        return res.status(200).json({ status: 200, data: result })
    } catch (error) {
        throw error
    }
}

async function getById (req, res) {
    let param = req.params
    log('[api-asrama][kamar] getById', param)
    try {
        const exists = await Kamar.findById(param.id)
        if (isEmpty(exists)) return res.status(200).json({ status: 404, message: 'Kamar tidak tersedia.' })

        return res.status(200).json({ status: 200, data: exists })
    } catch (error) {
        throw error
    }
}

async function kamarCounts (req, res) {
    let data = req.body
    log('[api-asrama][kamar] kamarCounts', data)
    try {
        const totalKamar = await Kamar.getTotalKamar()
        return res.status(200).json({ status: 200, data: totalKamar })
    } catch (error) {
        throw error
    }
}

async function addKamar (req, res) {
    let data = req.body
    log('[api-asrama][kamar] addKamar', { data })
    try {
        if (isEmpty(data.id_lantai)) return res.status(200).json({ status: 400, message: 'Lantai harus diisi.' })
        if (isEmpty(data.id_asrama)) return res.status(200).json({ status: 400, message: 'Asrama harus diisi.' })
        if (isEmpty(data.files)) return res.status(200).json({ status: 400, message: 'Gambar harus dilampirkan.' })
        const makeImage = await Gambar.create(data.files)
        let formData = {
            nama_kamar: data.nama_kamar,
            tipe_kamar: data.tipe_kamar,
            kapasitas: data.kapasitas,
            status: 0,
            id_asrama: data.id_asrama,
            id_gambar: makeImage.id,
            id_lantai: data.id_lantai
        }
        const created = await Kamar.create(formData)
        if (!created) return res.status(200).json({ status: 400, message: 'Gagal menyimpan data.', body: created })

        return res.status(200).json({ status: 200, message: 'Data kamar berhasil disimpan.', body: created })
    } catch (error) {
        throw error
    }
}

async function editKamar (req, res) {
    let data = req.body
    let param = req.params
    let files = req.file
    log('[api-asrama][kamar] editKamar', { data, param, files })
    try {
        let id  = param.id
        if (!isEmpty(data.files)) {
            let formDataImage = {
                originalname: data.files.originalname,
                encoding: data.files.encoding,
                mimetype: data.files.mimetype,
                destination: data.files.destination,
                path: data.files.path,
                filename: data.files.filename,
            }
            let editedImage = await Gambar.editById(formDataImage, data.idGambar)

            let formData = {
                id_gambar: data.idGambar,
                nama_kamar: data.nama_kamar,
                tipe_kamar: data.tipe_kamar,
                kapasitas: data.kapasitas,
                id_lantai: data.id_lantai,
                id_asrama: data.id_asrama
            }
            const edited = await Kamar.editById(formData, id)
            if (!edited) return res.status(200).json({ status: 400, message: 'Gagal menyimpan data.', body: edited })

            return res.status(200).json({ status: 200, message: 'Data kamar berhasil disimpan.', body: edited })
        }

        let formData = {
            nama_kamar: data.nama_kamar,
            tipe_kamar: data.tipe_kamar,
            kapasitas: data.kapasitas,
            id_asrama: data.id_asrama,
            id_lantai: data.id_lantai,
        }
        const edited = await Kamar.editById(formData, id)
        if (!edited) return res.status(200).json({ status: 400, message: 'Data kamar gagal disimpan.', body: edited })

        return res.status(200).json({ status: 200, message: 'Data kamar berhasil disimpan.', body: edited })
    } catch (error) {
        throw error
    }
}

async function deleteById (req, res) {
    let param = req.params
    log('[api-asrama][kamar] deleteById', param)
    try {
        let id = param.id
        const exists = await Kamar.findById(id)
        if (isEmpty(exists)) return res.status(200).json({ status: 404, message: 'Kamar tidak tersedia.' })

        const deleted = await Kamar.deleteById(id)
        const deletedGambar = await Gambar.deleteById(exists.id_gambar)
        if (!deleted || !deletedGambar) return res.status(200).json({ status: 200, message: 'Data kamar gagal dihapus.' })

        return res.status(200).json({ status: 200, message: 'Data kamar berhasil dihapus.', body: deleted })
    } catch (error) {
        throw error
    }
}

module.exports = {
    getAll,
    getKamar,
    getKamarByLantai,
    getById,
    kamarCounts,
    addKamar,
    editKamar,
    deleteById
}