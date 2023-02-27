module.exports = (app) =>{
    const router = require('express').Router();
    const edutron = require('../controllers/edutron.controller');


    router.get('/',edutron.getAll);
    router.post('/',edutron.createTest);
    router.put('/:id',edutron.update);
    router.delete('/:id',edutron.delete);

    router.get('/category/:id',edutron.getAllByCategory);
    router.get('/test/:id',edutron.getTestById);

    app.use('/api/edutron',router);
}