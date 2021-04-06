'use strict'

const { isEmpty } = require('lodash')
const localStrategy = require('passport-local').Strategy
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const debug = require('debug')
const { users, penghuni } = require('../models')

module.exports = function (passport) {
    let log = debug('api-esima:serialize')
    passport.serializeUser((user, done) => {
        log('seriaLizeUser', user)
        done(null, user)
    })

    passport.deserializeUser(async (id, done) => {
        log('deserializeUser', id)
        try {
            let result = await users.findAll({ where: { nip: nip, is_deleted: false }})
            JSON.stringify(result[0])
            const results = JSON.parse(result)
            if (!isEmpty(results)) {
                log('results', results)
                return done(null, results)
            } else {
                return done(null, false)
            }
        } catch (error) {
            throw error
        }
    })
    
    passport.use('login', new localStrategy( async (nip, password, done) => {
        try {
            const query = `select users.*, nip from users where users.id='${id}' and users.password='${password}'`
            let user = await conn.query(``, (err, result) => {
                if (err) return err

                if (!isEmpty(result)) {
                    log('localStrategy', result)
                    return done(null, result)
                } else {
                    return done(null, false)
                }
            })
            console.log('user', user)
        } catch (error) {
            throw error
        }
    }))
        
    passport.use(
        new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: "topSecret!"
        },
        (async (jwtPayload, done) => {
            log('jwtPassport', { jwtPayload })
            try {
               return done(null, jwtPayload)
            } catch (error) {
                done(error)
            }
        }) 
    ))
}