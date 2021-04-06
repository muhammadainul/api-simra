'use strict'

const debug = require('debug')
const { isEmpty } = require('lodash')
const Users = require('../queries/user')
const Tamu = require('../queries/penghuni')
const Token = require('../queries/token')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const { myConfig } = require('../config/config') 
const salt = bcrypt.genSaltSync(10)
const log = debug('api-simra:index:')

async function registrasi (req, res) {
    let data = req.body
    log('registrasi', data)
    try {   
        const checkEmail = await Users.findByEmail(data.email)
        if (!isEmpty(checkEmail)) return res.status(400).json({ statusCode: 400, message: 'Email sudah terdaftar.' })

        const checkPhone = await Tamu.findByPhone(data.no_telepon)
        if (!isEmpty(checkPhone)) return res.status(400).json({ statusCode: 400, message: 'Nomor telepon sudah terdaftar.' })

        if (data.password !== data.repassword) return res.status(400).json({ statusCode: 400, message: 'Password tidak cocok.' })

        let tokenCode = { 
            token: crypto.randomBytes(50).toString('hex')
        }   
        let createTokenCode = await Token.create(tokenCode) 

        let password = data.password
        let encryptPassword = bcrypt.hashSync(password, salt)
        let str = "{bcrypt}" + encryptPassword

        const user = {
            username: data.username,
            password: str,
            nama_lengkap: data.nama_lengkap,
            nip: data.nip,
            email: data.email,
            kewenangan_id: 1,
            id_token: createTokenCode.id
        }
        const createdUser = await Users.create(user)     

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            service: 'gmail',
            auth: {
                user: "ainulsaya@gmail.com",
                pass: "17005402"
            }
        })  

        let mailOptions = {
            from: "no-reply@simra.com",
            to: data.email,
            subject: "Account Verification Token",
            text: 
                "Hallo " + data.nama_lengkap + ", \n\n" +
                "Please verify your account by click the link: \nhttp:\/\/localhost:3007\/user\/confirmation\/token\/" +
                tokenCode.token + "\n" +
                "If you don't register, you can ignore this email. Thank you :)"
        } 

        transporter.sendMail(mailOptions, function (err) {
            if (err) return res.status(400).json({ statusCode: 400, error: err })

            return res.status(200).json({ statusCode: 200, message: "Verification email has been send to " + data.email + "." })
        })

        const penghuniData = {
            nik: data.nik,
            jenis_kelamin: data.jenis_kelamin,
            alamat: data.alamat,
            no_telepon: data.no_telepon,
            id_users: createdUser.id
        }
        const createdTamu = await Tamu.create(penghuniData)
    } catch (error) {
        throw error
    }
}

async function login (req, res) {
    let data = req.body
    log('login', data)
    try {
        const exists = await Users.findByNip(data.nip)
        if (isEmpty(exists)) return res.status(400).json({ statusCode: 404, message: 'Pengguna tidak ditemukan.', data: exists })
        
        const str = exists.password.replace('{bcrypt}', '')
        let passwordValid = bcrypt.compare(data.password, str, function (err, result){
            log('result', result)
            if (!result) return res.status(400).json({ statusCode: 400, message: 'Password salah! Silahkan coba lagi.' })

            const accessToken = jwt.sign({ id: exists.id, nip: exists.nip, kewenangan_id: exists.kewenangan_id }, myConfig.sessionSecret, { expiresIn: myConfig.expiredSessionTime })
            const refreshToken = jwt.sign({ id: exists.id, nip: exists.nip, kewenangan_id: exists.kewenangan_id }, myConfig.refreshSessionSecret, { expiresIn: myConfig.expiredRefreshSessionTime })

            return res.status(200).json({ 
                statusCode: 200,
                message: 'Login berhasil.',
                session: { accessToken, refreshToken },
                data: exists 
            })
        }) 
    } catch (error) {
        throw error
    }
}

module.exports = {
    registrasi,
    login
}