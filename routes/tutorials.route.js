module.exports = (app) =>{
    const router = require('express').Router(); // router tárolja a útvonalakat
    const tutorials = require('../controllers/tutorial.controller');


    router.get('/',tutorials.getAll);
    router.post('/',tutorials.create);
    router.put('/:id',tutorials.update);
    router.delete('/:id',tutorials.delete);

    router.get('/published',tutorials.getAllPublished);
    router.get('/:id',tutorials.getTutorialById);

    app.use('/api/tutorials',router); // default route név
}