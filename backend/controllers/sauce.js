// Import FileSystem
const express = require('express');
const fs = require('fs');

// Import Sauce Model
const Sauce = require('../models/sauce');

// Get All Sauce
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then((sauce) => { res.status(200).json(sauce) })
        .catch((error) => { res.status(400).json({ error }) });
}

// Get Single Sauce
exports.getSingleSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => { res.status(200).json(sauce) })
        .catch((error) => { res.status(404).json({ error }) });
}

// Create Sauce
exports.createSauce = (req, res, next) => {
    // Transform Request for JSON
    const sauceJSON = JSON.parse(req.body.sauce);
    delete sauceJSON._id;
    delete sauceJSON._userId;
    // Create Sauce
    const sauce = new Sauce({
        ...sauceJSON,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    })
    // Save To MongoDB
    sauce.save()
        .then(() => { res.status(201).json({ message: 'Nouvelle Sauce Enregistrée' }) })
        .catch((error) => { res.status(400).json({ error }) });
}

// Update Sauce
exports.updateSauce = (req, res, next) => {
    // Transform Request for JSON
    const sauceJSON = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    } : { ...req.body }
    delete sauceJSON._userId;
    // Find Sauce On MongoDB & Verify user.Id
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId !== req.auth.userId) {
                res.status(403).json({ message: 'Requête non autorisée' });
            }
            else {
                // Delete Old File 
                if (sauceJSON.imageUrl) {
                    const oldFile = sauce.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${oldFile}`, (err) => {
                        if (err) throw err;
                    });
                }
                // Update Sauce
                Sauce.updateOne({ _id: req.params.id }, { ...sauceJSON, _id: req.params.id })
                    .then(() => { res.status(200).json({ message: 'Votre Sauce à bien été modifiée' }) })
                    .catch((error) => { res.status(400).json({ error }) });
            }
        })
        .catch((error) => { res.status(404).json({ error }) }
        );
}

// Delete Sauce
exports.deleteSauce = (req, res, next) => {
    // Find Sauce On MongoDB & Verify user.Id
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId !== req.auth.userId) {
                res.status(403).json({ message: 'Requête non autorisée' });
            }
            else {
                // Delete Sauce
                const fileName = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${fileName}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Sauce supprimée' }) })
                        .catch(error => res.status(401).json({ error }))
                });
            }
        })
        .catch((error) => { res.status(404).json({ error }) });
}

// Like & Dislike
exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    const idSauce = req.params.id;
    // Find Sauce On MongoDB
    Sauce.findOne({ _id: idSauce })
        .then((sauce) => {
            const waitForOpinion = !sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId);
            // Like
            if (like === 1 && waitForOpinion) {
                Sauce.updateOne({ _id: idSauce }, { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } })
                    .then(() => res.status(200).json({ message: 'Like ajouté' }))
                    .catch(error => res.status(400).json({ error }));
            }
            // Dislike
            else if (like === -1 && waitForOpinion) {
                Sauce.updateOne({ _id: idSauce }, { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } })
                    .then(() => res.status(200).json({ message: 'Dislike ajouté' }))
                    .catch(error => res.status(400).json({ error }));
            }
            // Change Opinion
            else {
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: idSauce }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                        .then(() => res.status(200).json({ message: 'Like retiré' }))
                        .catch(error => res.status(400).json({ error }));
                }
                else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: idSauce }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                        .then(() => res.status(200).json({ message: 'Dislike retiré' }))
                        .catch(error => res.status(400).json({ error }));
                }
            }
        })
        .catch(error => res.status(400).json({ error }));
}