const express = require('express');
const bodyParser = require('body-parser');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const favoriteRouter = express.Router();
const cors = require('./cors');
const user = require('../models/user');

favoriteRouter.use(express.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

  Favorite.find({user: req.user._id})
  .populate('User')
  .populate('Campsites')
  .then((favorite) => {
   console.log(favorite);
   res.statusCode = 200;
   res.setHeader('Content-Type', 'application/json');
   res.json(favorite);
 })
 .catch((err) => next(err));
 console.log(req.user);
   

      
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
      console.log(req.body);
      Favorite.findOne({ user: req._id })
        .then((favorite) => {
          if (favorite) {
            // request body is an array, need to loop through it
            req.body.forEach((fav) => {
              if (!favorite.campsites.includes(fav._id)) {
                favorite.campsites.push(fav._id);
              }
            });
            favorite
              .save()
              .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
              })
              .catch((err) => next(err)); // updated favorite, save it to db
          } else {
            Favorite.create({ user: req.user._id, campsites: req.body })
              .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
              })
              .catch((err) => next(err));
          }
        })
        .catch((err) => next(err));
    })
    .put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,  (req, res, next) => {
        res.statusCode = 403;
        res.end(`Put operations not supported on /favorites`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.deleteMany({ user: req.user._id })
          .then((response) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
          })
          .catch((err) => next(err));
      });
  
   

      favoriteRouter.route('/:campsiteId')
      .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
      })
      .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(
          `Get operations not supported on /favorites/${req.params.campsiteId}`
        );
      })
      .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
          .then((favorite) => {
            if (favorite) {
              console.log(favorite.campsites);
              if (favorite.campsites.includes(req.params.campsiteId)) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end('That campsite is already in the list of favorites!');
              } else {
                favorite.campsites.push(req.params.campsiteId);
                favorite
                  .save()
                  .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                  })
                  .catch((err) => next(err));
              }
            } else {
              Favorite.create({
                user: req.user._id,
                campsites: [req.params.campsiteId],
              })
                .then((favorite) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(favorite);
                })
                .catch((err) => next(err));
            }
          })
          .catch((err) => next(err));
      })
      .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(
          `Put operations not supported on /favorites/${req.params.campsiteId}`
        );
      })
      .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
          .then((favorite) => {
            if (favorite) {
              favorite.campsites.remove({ _id: req.params.campsiteId });
              favorite
                .save()
                .then((response) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(response);
                })
                .catch((err) => next(err));
            } else {
              err = new Error(`Favorite ${req.params.campsiteId} not found`);
              err.status = 404;
              return next(err);
            }
          })
          .catch((err) => next(err));
      });
    module.exports = favoriteRouter;