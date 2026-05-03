const express = require('express')
const verifyToken = require("../middlewares/verify-token.js")
const Hoot = require('../models/hoot.js');
const { verify } = require('jsonwebtoken');
const router = express.Router();
// const jwt = require("jsonwebtoken");

/*
METHOD      CONTROLLER      RESPONSE               URI                     USE CASE
POST          create          200               '/hoots'                 Create a hoot
GET           index           200               '/hoots'                   List hoots
GET            show           200           '/hoots/:hootId'              View a hoot
Put           update          200           '/hoots/:hootId'             Update a hoot
DELETE      deleteHoot        200           '/hoots/:hootId'             Delete a hoot
POST       createComment      200       '/hoots/:hootId/comments'       Create a comment
*/


router.post('/', verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id
        const newHoot = await Hoot.create(req.body)
        newHoot._doc.author = req.user
        res.status(201).json(newHoot)
    } catch (error) {
        res.status(500).json({ err: error.message })
    }
})

router.get('/', verifyToken, async (req, res) => {
    try {
        const hoots = await Hoot.find({})
        .populate("author")
        .sort({ createdAt: "desc" })
        res.status(200).json(hoots)
    } catch (error) {
        res.status(500).json({ err: error.message })
    }
})

router.get('/:hootId', verifyToken, async (req, res) => {
    try {
        const hoot = await Hoot.findById(req.params.hootId).populate("author")
        res.status(200).json(hoot)
    } catch (error) {
        res.status(500).json({ err: error.message })
    }
})

router.put('/:hootId', verifyToken, async (req, res) => {
    try {
        const hoot = await Hoot.findById(req.params.hootId)
        if (!hoot.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that")
        }
        const updatedHoot = await Hoot.findByIdAndUpdate(
            req.params.hootId, 
            req.body, 
            { new: true }
        )
        updatedHoot._doc.auther = req.user
        res.status(200).json(updatedHoot)
    } catch (error) {
        res.status(500).json({ err: error.message })
    }
})

router.delete('/:hootId', verifyToken, async (req, res) => {
    try {
        const hoot = await Hoot.findById(req.params.hootId)
        if (!hoot.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that")
        }
        const deletedHoot = await Hoot.findByIdAndDelete(req.params.hootId)
        res.status(200).json(`Successfully Deleted ${deletedHoot}`)
    } catch (error) {
        res.status(500).json({ err: error.message })
    }
})

module.exports = router