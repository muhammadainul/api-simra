const debug = require('debug')
const { isEmpty } = require('lodash')
const Asset = require('../queries/asset')
const Gambar = require('../queries/gambar')
const log = debug('api-asrama:kamar:')

async function getAll (req, res) {
    let data = req.body
    log('[api-asrama][asset] getAll')
    try {
        let assetId = []
        const options = {
            skip: Number(data.start),
            limit: Number(data.length),
            sort: data.searchOrder,
            idAsrama: data.searchByAsrama,
            kategori: data.searchByKategori
        }
        if (!isEmpty(data.search.value) || !isEmpty(data.searchByAsrama) || !isEmpty(data.searchByKategori)) {
            const detail = await Asset.getByName(data.search.value)
            if (!isEmpty(detail)) {
                detail.forEach(row => {
                    assetId.push(row.id)
                })
            }
            const result = await Asset.getAllSearch({ assetId, options })
            let idAsset = []
            result.data.forEach(data => {
                idAsset.push(data.idAsset)
            })
            
            result.draw = data.draw
            return res.status(200).json({ status: 200, body: result })
        } else {
            const result = await Asset.getAll({ assetId, options })
            result.draw = data.draw
            return res.status(200).json({ status: 200, body: result })
        }
    } catch (error) {
        throw error
    }
}

async function getById (req, res) {
    let param = req.params
    log('[api-asrama][asset] getById', param)
    try {
        const exists = await Asset.findById(param.id)
        if (isEmpty(exists)) return res.status(200).json({ status: 404, message: 'Data asset tidak terdaftar.', data: exists })

        return res.status(200).json({ status: 200, data: exists })
    } catch (error) {
        throw error
    }
}

async function getByIdKamar (req, res) {
    let param = req.params
    log('[api-asrama][asset] getByIdKamar', param)
    try {
        const exists = await Asset.findByIdKamar(param.id)
        if (isEmpty(exists)) return res.status(200).json({ status: 404, message: 'Asset tidak terdaftar.', data: exists })

        return res.status(200).json({ status: 200, data: exists })
    } catch (error) {
        throw error
    }
}

async function addAsset (req, res) {
    let data = req.body
    let files = req.file
    log('[api-asrama][asset] addAsset', { data, files })
    try {
        const makeImage = await Gambar.create(data.files)
        let formData = {
            nama_asset: data.nama_asset,
            id_kategori: data.id_kategori,
            id_gambar: makeImage.id,
            id_kamar: data.id_kamar,
            id_asrama: data.id_asrama
        }
        const created = await Asset.create(formData)
        if (!created) return res.status(200).json({ status: 400, message: 'Data asset gagal disimpan', body: created })

        return res.status(200).json({ status: 200, message: 'Data asset berhasil disimpan.', body: created })
    } catch (error) {
        throw error
    }
}

async function editAsset (req, res) {
    let data = req.body
    let param = req.params
    log('[api-asrama][asset] editAsset', { data, param })
    try {
        let id = param.id
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
                nama_asset: data.nama_asset,
                id_kategori: data.id_kategori,
                id_asrama: data.id_asrama,
                id_kamar: data.id_kamar
            }
    
            const edited = await Asset.editById(formData, id)
            if (!edited) return res.status(200).json({ status: 400, message: 'Data asset gagal disimpan', body: edited })

            return res.status(200).json({ status: 200, message: 'Data asset berhasil disimpan.', body: edited })
        }

        let formData = {
            nama_asset: data.nama_asset,
            id_kategori: data.id_kategori,
            id_asrama: data.id_asrama,
            id_kamar: data.id_kamar
        }

        const edited = await Asset.editById(formData, id)
        if (!edited) return res.status(200).json({ status: 400, message: 'Data asset gagal disimpan', body: edited })

        return res.status(200).json({ status: 200, message: 'Data asset berhasil disimpan.', body: edited })
    } catch (error) {
        throw error
    }
}

async function deleteById (req, res) {
    let param = req.params
    log('[api-asrama][asset] deleteById', param)
    try {
        let id = param.id
        const exists = await Asset.findById(id)
        if (isEmpty(exists)) return res.status(200).json({ status: 404, message: 'Data asset tidak terdaftar.' })

        const deleted = await Asset.deleteById(id)
        const deleteGambar = await Gambar.deleteById(exists.id_gambar)
        
        return res.status(200).json({ status: 200, message: 'Data kamar berhasil dihapus', body: deleted })
    } catch (error) {
        throw error
    }
}

module.exports = {
    getAll,
    getById,
    getByIdKamar,
    addAsset,
    editAsset,
    deleteById
}