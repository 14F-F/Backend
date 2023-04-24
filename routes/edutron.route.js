module.exports = (app) =>{
    const router = require('express').Router();
    const edutron = require('../controllers/edutron.controller');
    const user = require('../controllers/edutron.user.controller');

    router.get('/getAll/:tableName',edutron.getAllFromTable);
    router.get('/test/:userId',edutron.getTestByUserId);
    router.get('/test/:categoryId',edutron.getTestByCategoryId);
    
    router.get('/question/:testId',edutron.getQuestionByTestId);
    router.get('/answer/:questionId',edutron.getAnswerByQuestionId);

    router.post('/createTest',edutron.createTest);
    router.post('/createQuestion',edutron.createQuestion);
    router.post('/createAnswer',edutron.createAnswer);

    router.post('/addTQID',edutron.AddTQID);
    router.put('/updateTQID/:TestID/:QuestionID',edutron.updateTQID);
    router.delete('/deleteTQID/:TestID/:QuestionID',edutron.deleteTQID);
    router.post('/addQAID',edutron.AddQAID);
    router.put('/updateQAID/:QuestionID/:AnswerID',edutron.updateQAID);
    router.delete('/deleteQAID/:QuestionID/:AnswerID',edutron.deleteQAID);


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

    router.post('/register',user.createUser);
    router.put('/updateUser/:id',user.updateUser);
    router.delete('/deleteUser/:id',user.deleteUser);
    router.post('/loggedIn',user.loggedIn);


    app.use('/api/edutron',router);
}