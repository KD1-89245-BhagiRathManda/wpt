const express = require('express')
const multer = require('multer')
const fs = require('fs')
const util = require('util')
const rename = util.promisify(fs.rename)

const pool = require('../db')
const result = require('../utils')
const router = express.Router()
const upload = multer({ dest: 'resources/' })

router.post('/', upload.single('icon'), async (req, res) => {
    try {
        const newFileName = req.file.filename + '.jpg'
        await rename(req.file.path, `${req.file.destination}${newFileName}`)
        const { title, details } = req.body
        const sql = `INSERT INTO category(title,details,image) VALUES(?,?,?)`
        const [data] = await pool.query(sql, [title, details, newFileName])
        res.send(result.createSuccessResult(data))
    } catch (error) {
        res.send(result.createErrorResult(error))
    }
})

router.get('/', async (req, res) => {
    try {
        const sql = `SELECT * FROM category`
        const [data] = await pool.query(sql)
        res.send(result.createSuccessResult(data))
    } catch (error) {
        res.send(result.createErrorResult(error))
    }
})

module.exports = router