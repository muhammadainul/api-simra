const debug = require('debug')
const { isEmpty } = require('lodash')
const Logs = require('../queries/logs')
const log = debug('api-asrama:logs:')

async function getAll (req, res) {
    let data = req.body
    log('[api-asrama][logs] getAll', data)
    try {
        let logsId = []
        const options = {
            skip: Number(data.start),
            limit: Number(data.length),
            sort: data.searchOrder
        }

        if (!isEmpty(data.search.value)) {
            const detail = await Logs.getByName(data.search.value)
            if (!isEmpty(detail)) {
                detail.forEach(row => {
                    logsId.push(row.id)
                })
            }

            const result = await Logs.getAllSearch({ logsId, options })
            let idLogs = []
            result.data.forEach(data => {
                idLogs.push(data.idLogs)
            })
            
            result.draw = data.draw
            return res.status(200).json({ status: 200, body: result })
        } else {
            const result = await Logs.getAll({ logsId, options })
            result.draw = data.draw
            return res.status(200).json({ status: 200, body: result })
        }
    } catch (error) {
        throw error
    }
} 

async function create (req, res) {
    let data = req.body
    log('[api-asrama][asset] create', data)
    try {
        const created = await Logs.create(data)
        return res.status(200).json({ status: 200, message: 'Logs successfully created', body: created })
    } catch (error) {
        throw error
    }
}

module.exports = {
    getAll,
    create
}