module.exports = (app) =>{
    const router = require('express').Router();
    const edutron = require('../controllers/edutron.controller');
    const user = require('../controllers/edutron.user.controller');


    router.post('/getToken',user.genToken);


    router.get('/tests',edutron.getAllTest);
    router.get('/categories',edutron.getAllCategory);
    // ONLY FOR TEST PURPOSES
    router.get('/questions',edutron.getAllQuestion);
    router.get('/answers',edutron.getAllAnswer);
    router.get('/TQID',edutron.getAllTQID);
    router.get('/QAID',edutron.getAllQAID);

    router.post('/createTest',edutron.createTest);
    router.post('/createQuestion',edutron.createQuestion);
    router.post('/createAnswer',edutron.createAnswer);

    router.post('/addTQID',edutron.AddTQID);
    router.post('/addQAID',edutron.AddQAID);

    router.get('/logs',edutron.getLogs);
    router.post('/testlog',edutron.logTest);
    router.delete('/clearlogs',edutron.deleteAllLogs);


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