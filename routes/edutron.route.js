module.exports = (app) =>{
    const router = require('express').Router();
    const edutron = require('../controllers/edutron.controller');


    router.get('/test',edutron.getAllTest);
    router.get('/category',edutron.getAllCategory);
    router.post('/createTest',edutron.createTest);
    router.post('/createQuestion',edutron.createQuestion);
    router.put('/updateTest/:id',edutron.updateTest);
    router.delete('/deleteTest/:id',edutron.deleteTest);

    router.get('/category/:id',edutron.getAllByCategoryId);
    router.get('/test/:id',edutron.getTestById);
    router.get('/testdata/:id',edutron.getAllTestDataById);

    app.use('/api/edutron',router);
}