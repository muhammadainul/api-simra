const jwt = require('jsonwebtoken')
const { myConfig } = require('../config/config')
const debug = require('debug')
const log = debug('api-simra:isVerified:')

async function isVerified (req, res, next) {
    try {
        const BearerHeader = req.headers['authorization']
        log(BearerHeader)
        const token = BearerHeader.split('Bearer ')[1]
        log('token', token)
        const decoded = jwt.verify(token, myConfig.sessionSecret)
        log('decoded: ', decoded)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(400).json({ statusCode: 400, message: 'Invalid token.', error: error })
    }
}

module.exports = isVerified