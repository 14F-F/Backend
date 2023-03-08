module.exports = (app) =>{
    const router = require('express').Router();
    const edutron = require('../controllers/edutron.controller');
    const user = require('../controllers/edutron.user.controller')


    router.get('/test',edutron.getAllTest);
    router.get('/category',edutron.getAllCategory);

    router.post('/createTest',edutron.createTest);
    router.post('/createQuestion',edutron.createQuestion);
    router.post('/createAnswer',edutron.createAnswer);

    router.put('/updateTest/:id',edutron.updateTest);
    router.put('/updateQuestion/:id',edutron.updateQuestion);
    router.put('/updateAnswer/:id',edutron.updateAnswer);

    router.delete('/deleteTest/:id',edutron.deleteTest);
    router.delete('/deleteQuestion/:id',edutron.deleteQuestion);
    router.delete('/deleteAnswer/:id',edutron.deleteAnswer);

    router.get('/category/:id',edutron.getAllByCategoryId);
    router.get('/test/:id',edutron.getTestById);
    router.get('/testdata/:id',edutron.getAllTestDataById);

    // User methods

    router.get('/users',user.getAllUser);
    router.post('/register',user.createUser);
    router.put('/updateUser/:id',user.updateUser);
    router.delete('deleteUser/:id',user.deleteUser);
    router.post('/loggedIn',user.loggedIn);


    app.use('/api/edutron',router);
}