'use strict'

const router = require('express').Router()
const index = require('../controllers/index')
const asrama = require('../controllers/asrama')
const kamar = require('../controllers/kamar')
const asset = require('../controllers/asset')
const kategoriAsset = require('../controllers/kategoriAsset')
const kartu = require('../controllers/kartu')
const lantai = require('../controllers/lantai')
const report = require('../controllers/report')
const logs = require('../controllers/logs')
const isVerified = require('./isVerified')

// dashboard
router.get('/v1/asrama/report', [isVerified], report.getReport)

// index
router.post('/v1/asrama/pengguna/login', index.login)
router.post('/v1/asrama/registrasi', index.registrasi)

// lantai
router.get('/v1/asrama/lantai', [isVerified], lantai.getLantai)

// kartu
router.get('/v1/asrama/kartu', [isVerified], kartu.getAll)
router.get('/v1/kartu/getKartu', [isVerified], kartu.getKartu)
router.get('/v1/kartu/getById/:id', [isVerified], kartu.getById)
router.post('/v1/kartu/add', [isVerified], kartu.addKartu)
router.patch('/v1/kartu/edit/:id', [isVerified], kartu.updateKartu)

// kategori asset
router.get('/v1/kategoriAsset/getAll', [isVerified], kategoriAsset.getAll)
router.get('/v1/kategoriAsset/getKategori', [isVerified], kategoriAsset.getKategori)
router.get('/v1/kategoriAsset/getById/:id', [isVerified], kategoriAsset.getById)
router.post('/v1/kategoriAsset/add', [isVerified], kategoriAsset.addKategoriAsset)
router.patch('/v1/kategoriAsset/edit/:id', [isVerified], kategoriAsset.editKategoriAsset)
router.delete('/v1/kategoriAsset/delete/:id', [isVerified], kategoriAsset.deleteById)

// asset
router.get('/v1/asset/getAll', [isVerified], asset.getAll)
router.get('/v1/asset/getById/:id', [isVerified], asset.getById)
router.get('/v1/asset/getByKamar', [isVerified], asset.getByIdKamar)
router.post('/v1/asset/add', [isVerified], asset.addAsset)
router.patch('/v1/asset/edit/:id', [isVerified], asset.editAsset)
router.delete('/v1/asset/delete/:id', [isVerified], asset.deleteById)

// kamar
router.get('/v1/kamar/getAll', [isVerified], kamar.getAll)
router.get('/v1/kamar/getKamar', [isVerified], kamar.getKamar)
router.get('/v1/kamar/getKamarByLantai', [isVerified], kamar.getKamarByLantai)
router.get('/v1/kamar/getById/:id', [isVerified], kamar.getById)
router.post('/v1/kamar/add', [isVerified], kamar.addKamar)
router.patch('/v1/kamar/edit/:id', [isVerified], kamar.editKamar)
router.delete('/v1/kamar/delete/:id', [isVerified], kamar.deleteById)

// asrama
router.get('/v1/asrama/asrama', [isVerified], asrama.getAll)
router.get('/v1/asrama/asrama/:id', [isVerified], asrama.getById)
router.get('/v1/asrama/get', [isVerified], asrama.getAsrama)
router.post('/v1/asrama/asrama', [isVerified], asrama.addAsrama)
router.patch('/v1/asrama/asrama/:id', [isVerified], asrama.editAsrama)
router.delete('/v1/asrama/asrama/:id', [isVerified], asrama.deleteById)

// logs
router.get('/v1/logs/getAll', [isVerified], logs.getAll)
router.post('/v1/asrama/logs', logs.create)

module.exports = router