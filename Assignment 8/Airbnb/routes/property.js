const express = require('express')
const pool = require('../db')
const result = require('../utils')
const router = express.Router()

// Create operation
router.post('/', async (req, res) => {
    try {
        const { categoryId, title, details, address, contactNo, ownerName, isLakeView,
            isTV, isAC, isWifi, isMiniBar, isBreakfast, isParking, guests,
            bedrooms, beds, bathrooms, rent } = req.body

        const sql = `INSERT INTO property(categoryId, title,details, address, 
            contactNo, ownerName, isLakeView,
            isTV, isAC, isWifi, isMiniBar, isBreakfast, isParking, guests,
            bedrooms, beds, bathrooms, rent) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`

        const [data] = await pool.query(sql, [categoryId, title, details, address, contactNo, ownerName, isLakeView,
            isTV, isAC, isWifi, isMiniBar, isBreakfast, isParking, guests,
            bedrooms, beds, bathrooms, rent])
        res.send(result.createSuccessResult(data))
    } catch (error) {
        res.send(result.createErrorResult(error))
    }
})

// Read operation
router.get('/', async (req, res) => {
    try {
        const sql = `SELECT id,title,details,rent,profileImage FROM property`
        const [data] = await pool.query(sql)
        res.send(result.createSuccessResult(data))
    } catch (error) {
        res.send(result.createErrorResult(error))
    }
})

// Read operation with details
router.get('/details/:id', async (req, res) => {
    try {
        const { id } = req.params
        const sql = `SELECT * FROM property WHERE id=?`
        const [data] = await pool.query(sql, [id])
        res.send(result.createSuccessResult(data))
    } catch (error) {
        res.send(result.createErrorResult(error))
    }
})

// Update operation
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { categoryId, title, details, address, contactNo, ownerName, isLakeView,
            isTV, isAC, isWifi, isMiniBar, isBreakfast, isParking, guests,
            bedrooms, beds, bathrooms, rent } = req.body

        const sql = `UPDATE property SET categoryId=?, title=?, details=?, address=?, 
            contactNo=?, ownerName=?, isLakeView=?,
            isTV=?, isAC=?, isWifi=?, isMiniBar=?, isBreakfast=?, isParking=?, guests=?,
            bedrooms=?, beds=?, bathrooms=?, rent=? WHERE id=?`

        const [data] = await pool.query(sql, [categoryId, title, details, address, contactNo, ownerName, isLakeView,
            isTV, isAC, isWifi, isMiniBar, isBreakfast, isParking, guests,
            bedrooms, beds, bathrooms, rent, id])
        res.send(result.createSuccessResult(data))
    } catch (error) {
        res.send(result.createErrorResult(error))
    }
})

// Delete operation
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const sql = `DELETE FROM property WHERE id=?`
        const [data] = await pool.query(sql, [id])
        res.send(result.createSuccessResult(data))
    } catch (error) {
        res.send(result.createErrorResult(error))
    }
})

module.exports = router