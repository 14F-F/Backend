module.exports = (app) =>{
    const router = require('express').Router();
    const edutron = require('../controllers/edutron.controller');


    router.get('/test',edutron.getAllTest);
    router.get('/category',edutron.getAllCategory);
    router.post('/create',edutron.createTest);
    router.put('/:id',edutron.update);
    router.delete('/:id',edutron.delete);

    router.get('/category/:id',edutron.getAllByCategoryId); // nem működik XD
    router.get('/test/:id',edutron.getTestById);

    app.use('/api/edutron',router);
}