const express = require('express')
const cryptoJs = require('crypto-js')
const jwt = require('jsonwebtoken')

const pool = require('../db')
const result = require('../utils')
const config = require('../config')

const router = express.Router()

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body
        const encryptedPassword = String(cryptoJs.SHA256(password))
        const sql = `INSERT INTO user(firstName, lastName, email, password, phoneNumber) VALUES(?,?,?,?,?)`
        const [data] = await pool.query(sql, [firstName, lastName, email, encryptedPassword, phone])
        res.send(result.createSuccessResult(data))
    } catch (error) {
        res.send(result.createErrorResult(error))
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const encryptedPassword = String(cryptoJs.SHA256(password))
        const sql = `SELECT * FROM user WHERE email = ? AND password = ?`
        const [data] = await pool.query(sql, [email, encryptedPassword])
        
        if (data && data.length > 0) {
            const payload = {
                userId: data[0].id
            }
            const token = jwt.sign(payload, config.secret)
            const body = {
                token: token,
                name: `${data[0].firstName} ${data[0].lastName}`
            }
            res.send(result.createSuccessResult(body))
        } else {
            res.send(result.createErrorResult("Invalid email or password"))
        }
    } catch (error) {
        res.send(result.createErrorResult(error))
    }
})

router.get('/profile', async (req, res) => {
    try {
        const sql = `SELECT firstName, lastName, phoneNumber, email FROM user WHERE id = ?`
        const [data] = await pool.query(sql, [req.headers.userId])
        res.send(result.createSuccessResult(data))
    } catch (error) {
        res.send(result.createErrorResult(error))
    }
})

router.put('/profile', async (req, res) => {
    try {
        const { firstName, lastName, phone } = req.body
        const sql = `UPDATE user SET firstName=?, lastName=?, phoneNumber=? WHERE id = ?`
        const [data] = await pool.query(sql, [firstName, lastName, phone, req.headers.userId])
        res.send(result.createSuccessResult(data))
    } catch (error) {
        res.send(result.createErrorResult(error))
    }
})

module.exports = router