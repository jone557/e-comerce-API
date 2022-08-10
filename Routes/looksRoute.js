const express = require('express')
const looksController = require('./../Controllers/looksController')

const router = express.Router()
router.route('/')
.post(looksController.addLook)
.get(looksController.getLooks)

router.route('/:id')
.get(looksController.getLook)
.patch(looksController.updateLook)
.delete(looksController.deleteLook)
module.exports = router
