const express= require('express');
const bodyParser= require('body-parser')
const Promotion= require('../models/promotions')

const promotionRouter= express.Router()
promotionRouter.use(bodyParser.json())


//** Promotion */
promotionRouter
.route('/')
.get((req, res,next) => {
    Promotion.find()
    .then( promotions=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }).catch( err=> next(err))
})
.post((req, res,next) => {
    Promotion.create(req.body)
    .then(promotion=>{
        console.log('Promotion added ,', promotion)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }).catch(err=> next(err))
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res,next) => {
    Promotion.deleteMany()
    .then(response=>{
        console.log('Promotion deleted')
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    }).catch(err=> next(err))
});

//** Promotion/: ID */
promotionRouter
.route('/:promotionId')
.get((req, res,next) => {
    Promotion.findById(req.params.promotionId)
    .then(promotion=> {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
    }).catch(err=> next(err))
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotions/${req.params.promotionId}`)
})
.put((req, res) => {
    Promotion.findById(req.params.promotionId,{$set:req.body},{new:true})
    .then(promotion=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
    }).catch((err) => next(err));
})
.delete((req, res,next) => {
    Promotion.findByIdAndRemove(req.params.promotionId)
    .then(response=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
});


module.exports=promotionRouter;