const express = require("express");
const bodyParser = require("body-parser");
const Favorite = require("../models/favorite");
const authenticate = require("../authenticate");
const cors = require("./cors");
const favorite = require("../models/favorite");

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

//** Favorite */
favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate("favorite.user")
      .populate("favorite.campsite")
      .then((favorite) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorite);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {  //favorito existe
          if (
            favorite.campsite.includes(favorite)) {
              err = new Error(`Favorite already included in favorites`);
              err.status = 404;
              return next(err);
          } else {
            favorite.campsite.push(favorite);
            favorite.save();
            then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite.campsite);
            })
          }
        } else {  //favorito no existe
          req.body.campsite =req.params.campsiteId
          favorite.campsite.push(req.body);
          favorite
            .save() 
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite.campsite);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites");
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    (req, res, next) => {
      Favorite.findOneAndDelete(req.params.favoriteId)
        .then((favorite) => {
          if(favorite){
            console.log("Favorite deleted");
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
          } 
          res.setHeader("Content-Type", "text/plain")
          res.end('You do not have any favorites to delete.')
        })
        .catch((err) => next(err));
    }
  );

//** Favorite/: Campsite ID */
favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res) => {
    res.statusCode = 403;
    res.end("GET operation not supported on /favorites");
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Favorite.findOne(req.params.favoriteId)
      .then((favorite) => {
        if (!favorite.campsite.id(req.params.campsiteId)) {  //favorito no existe
            favorite.campsite.push(req.params.campsiteId);
            favorite.save()
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite.campsite);
            }) .catch((err) => next(err));
        } else {  //favorito existe
          err = new Error(`This camping is already  ${req.params.favoriteId} on the list!`);
          err.status = 404;
          return next(err);         
        }
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites");
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    (req, res, next) => {
      Favorite.findOne(req.params.favoriteId)
        .then((favorite) => {
          if(favorite){
            favorite.campsite.splice(favorite.campsite.indexOf(req.params.campsiteId),1);
            favorite.save()
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
          }else{
              res.status(403)
              res.setHeader("Content-Type", "text/plain");
              res.end("There are no favorites to delete");
            next(err);
          }
        })
        .catch((err) => next(err));
      } 
  );

module.exports = favoriteRouter;
