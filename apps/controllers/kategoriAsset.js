const debug = require('debug')
const { isEmpty } = require('lodash')
const KategoriAsset = require('../queries/kategoriAsset')
const log = debug('api-asrama:kategoriAsset:')

async function getAll (req, res) {
    let data = req.body
    log('[api-asrama][kategoriAsset] getAll', data)
    try {
        let kategoriAssetId = []
        let options = {
            skip: Number(data.start),
            limit: Number(data.length),
            sort: data.searchOrder
        }

        if (!isEmpty(data.search.value)) {
            const detail = await KategoriAsset.getByName(data.search.value)
            if (!isEmpty(detail)) {
                detail.forEach(row => {
                    kategoriAssetId.push(row.id)
                })
            }
            const result = await KategoriAsset.getAllSearch({ kategoriAssetId, options })
            let idKategoriAsset = []
            result.data.forEach(data => {
                idKategoriAsset.push(data.idKategoriAsset)
            })
            
            result.draw = data.draw
            return res.status(200).json({ status: 200, body: result })
        } else {
            const result = await KategoriAsset.getAll({ kategoriAssetId, options })
            result.draw = data.draw
            return res.status(200).json({ status: 200, body: result })
        }
    } catch (error) {
        throw error
    }
} 

async function getKategori (req, res) {
    log('[api-asrama][kategoriAsset] getKategori')
    try {
        const result = await KategoriAsset.findAll()
        return res.status(200).json({ status: 200, data: result })
    } catch (error) {
        throw error
    }
}

async function getById (req, res) {
    let param = req.params
    log('[api-asrama][kategoriAsset] getById', param)
    try {
        const exists = await KategoriAsset.findById(param.id)
        if (isEmpty(exists)) return res.status(200).json({ status: 404, message: 'Kategori asset tidak terdaftar.' })

        return res.status(200).json({ status: 200, data: exists })
    } catch (error) {
        throw error
    }
}

async function addKategoriAsset (req, res) {
    let data = req.body
    log('[api-asrama][kategoriAsset] addKategoriAsset', { data })
    try {
        const exists = await KategoriAsset.findByName(data.nama_kategori)
        if (!isEmpty(exists)) return res.status(200).json({ status: 400, message: 'Nama kategori sudah tersedia.' })
        
        const created = await KategoriAsset.create(data)
        return res.status(200).json({ status: 200, message: 'Data kategori asset berhasil disimpan.', body: created })
    } catch (error) {
        throw error
    }
}

async function editKategoriAsset (req, res) {
    let data = req.body
    let param = req.params
    log('editKategoriAsset', { data, param })
    try {
        let id = param.id
        let formData = {
            nama_kategori: data.nama_kategori,
            deskripsi: data.deskripsi
        }
        const edited = await KategoriAsset.editById(formData, id)
        return res.status(200).json({ status: 200, message: 'Data kategori asset berhasil disimpan.', body: edited })
    } catch (error) {
        throw error
    }
}

async function deleteById (req, res) {
    let param = req.params
    log('[api-asrama][kategoriAsset] deleteById', param)
    try {
        let id = param.id
        const exists = await KategoriAsset.findById(id)
        if (isEmpty(exists)) return res.status(200).json({ status: 404, message: 'Data kategori asset tidak terdaftar.' })

        const deleted = await KategoriAsset.deleteById(id)        
        return res.status(200).send({ status: 200, message: 'Data kategori asset berhasil dihapus.', body: deleted })
    } catch (error) {
        throw error
    }
}

module.exports = {
    getAll,
    getKategori,
    getById,
    addKategoriAsset,
    editKategoriAsset,
    deleteById
}