const express = require('express');
const Campsite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Favorite = require('../models/favorite');
const user = require('../models/user');
const favoriteRouter = express.Router();

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
       Favorite.find({user:req.user._id})
       .populate('user')
       .populate('campsites')
       
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(Favorite);
        
      
    })
    .post(cors.corsWithOptions,authenticate.verifyUser, (req, res, next) => {
       
       //check body for message  of [{"_id":"campsite ObjectId"},  . . . , {"_id":"campsite ObjectId"}] 
      //console.log(req.body._id);
       //check if they have favorite document

       Favorite.findOne({user: req.user._id}).then(favorites => {
            //check if the campsite exists in document
            favorites.foreach(fav => {
                //check if user has the favorite
                if(  user.favorites.includes(fav)){

                }else{
                    //get user favorites doc and push the new favorite
                    //user.favoritesDocument.push(fav);
                }
              
            })
            //save favorite document
        
            
       })
       .catch(err => next(err));

    })
    .put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,  (req, res, next) => {
       
    })
    .delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,  (req, res, next) => {
        Favorite.findByIdAndDelete(req.params.campsiteId)
        .then((favorite) => {
            if(favorite){
                
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                
                
            }else{
               
                res.setHeader('Content-Type', 'text/plain');
                res.end('You do not have any favorites to delete.');
                
            }
          
           
        })
        
   
        });
   

favoriteRouter.route('/:campsiteId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotions/${req.params.promotionsId}`);
    })
    .post(cors.corsWithOptions,authenticate.verifyUser, (req, res) => {
        
       Favorite.findOne(req.params.campsiteId).then(favorite => {
           //add to favorites campsite array

           // If the campsite is already in the array, then respond with a message saying "That campsite is already in the list of favorites!"
       })
    })
    .put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,  (req, res, next) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /promotions/${req.params.promotionsId}`);
    })
    .delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,  (req, res, next) => {
      
        });