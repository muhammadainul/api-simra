'use strict'

const router = require('express').Router()
const index = require('../controllers/index')
const asrama = require('../controllers/asrama')
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

// asrama
router.get('/v1/asrama/asrama', [isVerified], asrama.getAll)
router.get('/v1/asrama/asrama/:id', [isVerified], asrama.getById)
router.post('/v1/asrama/asrama', [isVerified], asrama.addAsrama)
router.patch('/v1/asrama/asrama/:id', [isVerified], asrama.editAsrama)

// logs
router.post('/v1/asrama/logs', logs.create)

module.exports = router