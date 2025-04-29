const express = require('express')
const pool = require('../db')
const result = require('../utils')
const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const { propertyId, total, fromDate, toDate } = req.body
        const sql = `INSERT INTO bookings(userId,propertyId,fromDate,toDate,total)
        VALUES (?,?,?,?,?)`
        const [data] = await pool.query(sql, [req.userId, propertyId, fromDate, toDate, total])
        res.send(result.createSuccessResult(data))
    } catch (error) {
        res.send(result.createErrorResult(error))
    }
})

router.get('/', async (req, res) => {
    try {
        const sql = `SELECT * FROM bookings WHERE userId = ?`
        const [data] = await pool.query(sql, [req.userId])
        res.send(result.createSuccessResult(data))
    } catch (error) {
        res.send(result.createErrorResult(error))
    }
})

module.exports = router