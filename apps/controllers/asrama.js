const debug = require('debug')
const _ = require('lodash')
const Gambar = require('../queries/gambar')
const Asrama = require('../queries/asrama')
const log = debug('api-asrama:asrama:')

async function getAll (req, res) {
    let data = req.body
    log('getAll', data)
    try {
        let asramaId = []
        let options = {
            skip: Number(data.start),
            limit: Number(data.length),
        }
        if (!_.isEmpty(data.search.value)) {
            let detail = await Asrama.getByName(data.search.value)
            if (!_.isEmpty(detail)) {
                detail.forEach(row => {
                    asramaId.push(row.id)
                })
            }
            const result = await Asrama.getAllSearch({ asramaId, options })
            let idAsrama = []
            result.data.forEach(data => {
                idAsrama.push(data.idAsrama)
            })
            result.draw = data.draw
            return res.status(200).json({ statusCode: 200, body: result })
        } else {
            const result = await Asrama.getAll({ options })
            result.draw = data.draw
            return res.status(200).json({ statusCode: 200, body: result })
        }
    } catch (error) {
        throw error
    }
}

async function getById (req, res) {
    let param = req.params
    log('getById', param)
    try {
        const exists = await Asrama.findById(param.id)
        if (_.isEmpty(exists)) return res.status(200).json({ statusCode: 404, message: 'Data asrama tidak ditemukan.', data: exists })
        return res.status(200).json({ statusCode: 200, data: exists })
    } catch (error) {
        throw error
    }
}

async function getAsrama (req, res) {
    log('getAsrama')
    try {
        const result = await Asrama.findAll()
        return res.status(200).json({ statusCode: 200, data: result })
    } catch (error) {
        throw error
    }
}

async function addAsrama (req, res) {
    let data = req.body
    log('addAsrama', data)
    try {
        const exists = await Asrama.findByName(data.nama_asrama)
        if (!_.isEmpty(exists)) return res.status(200).json({ statusCode: 400, message: 'Nama asrama sudah tersedia.' })
        if (_.isEmpty(data.files)) return res.status(200).json({ statusCode: 400, message: 'Gambar harus dilampirkan.' })

        const makeImage = await Gambar.create(data.files)
        let formData = {
            id_gambar: makeImage.id,
            nama_asrama: data.nama_asrama,
            jumlah_kamar: data.jumlah_kamar,
            jumlah_lantai: data.jumlah_lantai,
            fasilitas: data.fasilitas
        }  
        const created = await Asrama.create(formData)
        if (!created) return res.status(200).json({ statusCode: 400, message: 'Gagal menyimpan data. Silahkan coba lagi.' })
        return res.status(200).json({ statusCode: 200, message: 'Data asrama berhasil disimpan.' })
    } catch (error) {
        throw error
    }
}

async function editAsrama (req, res) {
    let data = req.body
    let param = req.params
    log('editAsrama', data, param)
    try {
        if (!_.isEmpty(data.files)) {
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
                nama_asrama: data.nama_asrama,
                jumlah_kamar: data.jumlah_kamar,
                jumlah_lantai: data.jumlah_lantai,
                fasilitas: data.fasilitas
            }
            const edited = await Asrama.editById(formData, param.id)
            if (!edited) return res.status(200).json({ statusCode: 400, message: 'Gagal menyimpan data. Silahkan coba lagi.' })
            return res.status(200).json({ statusCode: 200, message: 'Data asrama berhasil disimpan.' })
        }

        let formData = {
            nama_asrama: data.nama_asrama,
            jumlah_kamar: data.jumlah_kamar,
            jumlah_lantai: data.jumlah_lantai,
            fasilitas: data.fasilitas
        }
        const edited = await Asrama.editById(formData, param.id)
        if (!edited) return res.status(200).json({ statusCode: 400, message: 'Gagal menyimpan data. Silahkan coba lagi.' })
        return res.status(200).json({ statusCode: 200, message: 'Data asrama berhasil disimpan.' })
    } catch (error) {
        throw error
    }
}

async function deleteById (req, res) {
    let param = req.params
    log('deleteById', param)
    try {
        const exists = await Asrama.findById(param.id)
        if (_.isEmpty(exists)) return res.status(200).json({ statusCode: 404, message: 'Data asrama tidak ditemukan.' })

        const deleted = await Asrama.deleteById(param.id)
        const deletedGambar = await Gambar.deleteById(exists.files.id)
        
        if (!deleted) return res.status(200).json({ statusCode: 400, message: 'Gagal menghapus data asrama.' })
        if (!deletedGambar) return res.status(200).json({ statusCode: 400, message: 'Gagal menghapus data gambar.' })

        return res.status(200).json({ statusCode: 200, message: 'Data asrama berhasil dihapus.' })
    } catch (error) {
        throw error
    }
}

module.exports = {
    getAll,
    getById,
    getAsrama,
    addAsrama,
    editAsrama,
    deleteById
}