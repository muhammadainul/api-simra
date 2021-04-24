const debug = require('debug')
const { isEmpty, toUpper } = require('lodash')
const moment = require('moment')
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)
const Reservasi = require('../queries/reservasi')
const Users = require('../queries/user')
const Penghuni = require('../queries/penghuni')
const Gambar = require('../queries/gambar')
const Kamar = require('../queries/kamar')
const log = debug('api-asrama:reservasi:')

async function getAll (req, res) {
    let data = req.body
    log('getAll', data)
    try {
        let userId = []
        const options = {
            skip: Number(data.start),
            limit: Number(data.length),
            sort: data.searchOrder,
            searchByDate: data.searchByDate  
        }

        if (!isEmpty(data.search.value) || !isEmpty(data.searchByDate) || !isEmpty(data.searchByAsrama) || !isEmpty(data.status)) {
            const detail = await Reservasi.getByName(data.search.value)
            if (!isEmpty(detail)) {
                detail.forEach(row => {
                    userId.push(row.id)
                })
            }
            const result = await Reservasi.getAllSearch({ idAsrama: data.searchByAsrama, userId, options, status: data.status, draw: data.draw })
            const idUsers = []
            result.data.forEach(data => {
                idUsers.push(data.idUsers)
            })
            return res.status(200).json({ status: 200, body: result })
        } else {
            const result = await Reservasi.getAll({ userId, options, draw: data.draw })
            return res.status(200).json({ status: 200, body: result })
        }
    } catch (error) {
        throw error
    }
}

async function getById (req, res) {
    let users = req.user
    let param = req.params
    log('getById', param)
    try {
        const exists = await Reservasi.findById(param.id)
        if (isEmpty(exists)) return res.status(200).json({ status: 404, message: 'Data reservasi tidak terdaftar.' })

        return res.status(200).send({ status: 200, data: exists })
    } catch (error) {
        throw error
    }
}

async function getByIdTamu (req, res) {
    let users = req.user
    let param = req.params
    log('getByIdTamu', param)
    try {
        const exists = await Reservasi.findByIdPenghuni(param.id)
        if (isEmpty(exists)) return res.status(200).json({ status: 404, message: 'Data reservasi tidak terdaftar.' })

        return res.status(200).json({ status: 200, data: exists })
    } catch (error) {
        throw error
    }
}

async function addReservasi (req, res) {
    let data = req.body
    let users = req.user
    log('addReservasi', { data, users })
    try {
        let awal = 'RS-'
        let belakang =  + Math.floor(1 + Math.random()) + Date.now(moment().format('YYYY-MM-DD'))
        .toString(30)
        
        let id_reservasi = toUpper(awal + belakang)

        const checkNip = await Users.findByNip(data.nip)
        const checkPhone = await Penghuni.findByPhone(data.no_telepon)
        const checkNik = await Penghuni.findByNik(data.nik)
        const checkEmail = await Users.findByEmail(data.email)
        if (!isEmpty(checkNip)) return res.status(200).json({ status: 400, message: 'NIP sudah terdaftar.' })
        if (!isEmpty(checkPhone)) return res.status(200).json({ status: 400, message: 'Nomor telepon sudah terdaftar.' })
        if (!isEmpty(checkNik)) return res.status(200).json({ status: 400, message: 'NIK sudah terdaftar.' })
        if (!isEmpty(checkEmail)) return res.status(200).json({ status: 400, message: 'Email sudah terdaftar.' })

        const checkUser = await Users.findByNip(users.nip)
        // ADMIN
        if (checkUser.kewenangan_id == 1) {
            let kewenangan_id = 5
            let enabled = 1
            let password = `user123`
            let encryptPassword = bcrypt.hashSync(password, salt)
            let str = "{bcrypt}" + encryptPassword

            const createUsers = await Users.create(data, kewenangan_id, enabled, str)
            const createPenghuni = await Penghuni.create(data, createUsers.id)

            let formData = {
                id_asrama: data.id_asrama,
                id_kamar: data.id_kamar,
                tgl_cekin: data.tgl_cekin,
                status: 1,
                id_penghuni: createPenghuni.id,
                id_reservasi
            }
            const created = await Reservasi.create(formData)
            if (!created) return res.status(200).json({ status: 400, message: 'Reservasi gagal disimpan.' })

            const checkTamu = await Penghuni.findByIdKamar(data.id_kamar)
            if (checkTamu.length > 1) {
                const updateStatusKamar = await Kamar.updateById(data.id_kamar)
            }
            return res.status(200).json({ status: 200, message: 'Reservasi berhasil disimpan.', body: created })
        } else {
            // PESERTA
            const updateUser = await Users.editById(data, users.id)

            const updateProfile = await Penghuni.editById(data, data.id_penghuni)

            let formData = {
                id_asrama: data.id_asrama,
                id_kamar: data.id_kamar,
                tgl_cekin: data.tgl_cekin,
                status: 1,
                id_penghuni: data.id_penghuni,
                id_reservasi
            }
            const created = await Reservasi.create(formData)
            if (!created) return res.status(200).json({ status: 400, message: 'Reservasi gagal disimpan.' })

            const checkTamu = await Penghuni.findByIdKamar(data.id_kamar)
            if (checkTamu.length > 1) {
                const updateStatusKamar = await Kamar.updateById(data.id_kamar)
            }
            return res.status(200).json({ status: 200, message: 'Reservasi berhasil disimpan.', body: created })
        }
    } catch (error) {
        throw error
    }
}

async function editReservasi (req, res) {
    let data = req.body
    let users = req.user
    let param = req.params
    log('editReservasi', { data, users, param })
    try {
        const checkKamar = await Kamar.checkIfAvailable(data.idKamar)
        if (checkKamar.status > 0) return res.json({ status: 400, message: 'Kamar tidak tersedia. Silahkan pilih kamar lain', data: checkKamar })

        const checkUser = await Users.findByNip(users.nip)

        if (checkUser.kewenangan_id == 1) {
            const editedUsers = await Users.editById(data, data.idUsers)

            const editedTamu = await Penghuni.editById(data, data.id_penghuni)

            const formData = {
                id_asrama: data.id_asrama,
                id_kamar: data.id_kamar,
                tgl_cekin: data.tgl_cekin,
            }
            const edited = await Reservasi.editById(formData, param.id)
            if (!edited) return res.status(200).json({ status: 400, message: 'Reservasi gagal disimpan.' })

            const checkPenghuni = await Penghuni.findByIdKamar(data.id_kamar)
            if (checkPenghuni.length > 1) {
                const updateStatusKamar = await Kamar.updateById(data.id_kamar)
            }

            if (data.id_kamar !== data.idKamar) {
                const updateStatusAfterChangeKamar = await Kamar.updateStatus(data.idKamar)
                
                const checkPenghuni = await Penghuni.findByIdKamar(data.id_kamar)
                if (checkPenghuni.length > 1) {
                    const updateStatusKamar = await Kamar.updateById(data.id_kamar)
                }
            }

            return res.status(200).json({ status: 200, message: 'Reservasi berhasil diubah.', body: edited })
        } 
    } catch (error) {
        throw error
    }
}

async function checkIn (req, res) {
    let data = req.body
    log('checkIn', data) 
    try {
        const exists = await Reservasi.findById(data.id)
        if (isEmpty(exists)) return res.status(200).json({ status: 404, message: 'Data reservasi tidak terdaftar.' })

        const today = moment(Date.now()).format('YYYY-MM-DD')
        const checkIn = await Reservasi.checkIn(data.id, today)
        if (!checkIn) return res.status(200).json({ status: 400, message: 'Check-in gagal. Silahkan coba lagi.' })

        return res.status(200).json({ status: 200, message: 'Check-in berhasil.' })
    } catch (error) {
        throw error
    }
}

async function checkOut (req, res) {
    let data = req.body
    log('checkOut', data)
    try {
        const today = moment(Date.now()).format('YYYY-MM-DD')
        const checkout = await Reservasi.checkOut(data.id, today)
        if (!checkout) return res.status(200).json({ status: 400, message: 'Check-out gagal.' })

        const id_kamar = data.id_kamar
        const checkPenghuni = await Penghuni.findByIdKamar(id_kamar)
        if (!isEmpty(checkPenghuni)) {
            const updateStatusKamar = await Kamar.updateStatus(data.id_kamar)
        }

        const updatePenghuni = await Penghuni.updateSetNull(data.id_tamu)
        return res.status(200).json({ status: 200, message: 'Check-out berhasil.', body: checkout })
    } catch (error) {
        throw error
    }
}

async function deleteReservasi (req, res) {
    let param = req.params
    let data = req.body
    let users = req.user
    log('deleteReservasi', { param, data, users })
    try {
        const exists = await Reservasi.findById(param.id)
        if (isEmpty(exists)) return res.status(200).json({ status: 404, message: 'Data reservasi tidak terdaftar.' })

        const deleted = await Reservasi.deleteById(param.id)
        const deletePenghuni = await Tamu.deleteById(exists.idTamu)

        return res.status(200).json({ status: 200, message: 'Reservasi berhasil dihapus.', body: deleted })
    } catch (error) {
        throw error
    }
}

async function makeQRCode ({ id_kamar, id_tamu, today, url = '', base_url = 'http://localhost:3006' }) {
    log('makeQRCode')
    try {
        const gambar = gambarField()
        if (isEmpty(id_kamar)) return ({ statusCode: 400, message: 'Id kamar required.' })
        if (isEmpty(id_tamu)) return ({ statusCode: 400, message: 'Id tamu required.' })
        
        const dataQR = id_kamar 
        const hashed = trimEnd(base64(`${today}/${id_kamar.toString()}`), '=')
        const thisUrl = `${base_url}/${hashed}`
        log('thisUrl: ', thisUrl)
        const createQRImage = await makeQRImage({ url: thisUrl, dataQR })
        const filename = createQRImage.split('/').pop()
        const data = { 
            originalname: filename,
            encoding: '7bit',
            mimetype: 'image/png',
            destination: createQRImage,
            filename: filename,
            size: fs.statSync(createQRImage).size 
        }
        const createImage = await Gambar.create(data, gambar)
        const newid = await Gambar.findByNewId()
        const createQR = await QRCode.create({ id_kamar, id_tamu, today, url, id_gambar: `${newid.id_gambar}` })
    } catch (error) {
        throw error
    }
}

async function makeQRImage ({ url = '', dataQR }) {
    log('makeQRImage', url)
    if (isEmpty(url)) return ({ statusCode: 400, message: 'url required.' })

    const qrcode = url.split('/').pop()
    const imageBuffer = await QRCode.generateQRCode({ string: url, dataQR })
    const target = `/public/uploads/qrcode/${qrcode}.png`
    log('imageBuffer', imageBuffer)
    fs.writeFileSync(target, imageBuffer)
    return target
}

module.exports = {
    getAll,
    getById,
    getByIdTamu,
    addReservasi,
    editReservasi,
    checkIn,
    checkOut,
    deleteReservasi
}