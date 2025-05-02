const express = require('express')
const router = express.Router()
const racesController = require('../controllers/racesController')

router.get('/', racesController.getRaces)
router.get('/:id', racesController.getRaceById)
router.post('/', racesController.createRace)
router.put('/:id', racesController.updateRace)
router.delete('/:id', racesController.deleteRace)

module.exports = router
