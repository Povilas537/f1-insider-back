const Race = require('../models/raceModel')

const getRaces = async (req, res) => {
    try {
        const races = await Race.find().populate('winner', 'name')
        res.send(races)
    } catch (error) {
        res.status(500).send(error)
    }
}

const getRaceById = async (req, res) => {
    try {
        const { id } = req.params
        const race = await Race.findById(id).populate('winner', 'name')
        if (!race) {
            return res.status(404).send({ error: 'Race not found' })
        }
        res.send(race)
    } catch (error) {
        res.status(500).send(error)
    }
}

const createRace = async (req, res) => {
    try {
        const race = new Race(req.body)
        await race.save()
        res.send(race)
    } catch (error) {
        res.status(500).send(error)
    }
}

const updateRace = async (req, res) => {
    try {
        const { id } = req.params
        const updatedRace = await Race.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        )
        if (!updatedRace) {
            return res.status(404).send({ error: 'Race not found' })
        }
        res.send(updatedRace)
    } catch (error) {
        res.status(500).send(error)
    }
}

const deleteRace = async (req, res) => {
    try {
        const { id } = req.params
        const deletedRace = await Race.findByIdAndDelete(id)
        if (!deletedRace) {
            return res.status(404).send({ error: 'Race not found' })
        }
        res.send({ message: 'Race was removed', data: deletedRace })
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = {
    getRaces,
    getRaceById,
    createRace,
    updateRace,
    deleteRace
}
