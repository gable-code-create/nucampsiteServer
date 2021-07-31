const express = require('express');
const partnerRouter = express.Router();
const Partner = require('../models/partner');


partnerRouter.route('/')
.get((req, res, next) => {
    Partner.find()
    .then(partner => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Partner.create(req.body)
    .then(partner => {
        console.log('Partner Created ', partner);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
})
.delete((req, res, next) => {
    Partner.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});
partnerRouter.route('/:partnersId')
    .get((req, res, next) => {
        Partner.findById(req.params.partnersId)
        .then(partners => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(partners);
        })
        .catch(err => next(err));
    })
    .post((req, res) => {
       Partner.findById(req.params.campsiteId)
    .then(partner => {
        if (partner) {
            partner.comments.push(req.body);
            partner.save()
            .then(partner => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(partner);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Partner ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
    })
    .put((req, res, next) => {
        Partner.findByIdAndUpdate(req.params.partnerId, {
            $set: req.body
        }, { new: true })
        .then(partners => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(partners);
        })
        .catch(err => next(err));
    })
    .delete((req, res, next) => {
    Partner.findById(req.params.campsiteId)
    .then(partner => {
        if (partner) {
            for (let i = (partner.comments.length-1); i >= 0; i--) {
                partner.comments.id(partner.comments[i]._id).remove();
            }
            partner.save()
            .then(partner => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(partner);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Campsite ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
    });
    



module.exports = partnerRouter;