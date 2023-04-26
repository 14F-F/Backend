module.exports = (app) =>{
    const router = require('express').Router();
    const edutron = require('../controllers/edutron.controller');
    const user = require('../controllers/edutron.user.controller');
	const admin = require('../controllers/edutron.admin.controller');

    router.get('/getAll/:tableName',admin.getAllFromTable);
    router.get('/testByUser/:userId',edutron.getTestByUserId);
    router.get('/testByCategory/:categoryId',edutron.getTestByCategoryId);
    
    router.get('/question/:testId',edutron.getQuestionByTestId);
    router.get('/answer/:questionId',edutron.getAnswerByQuestionId);

    router.post('/addTQID',edutron.AddTQID);
    router.put('/updateTQID/:TestID/:QuestionID',edutron.updateTQID);
    router.delete('/deleteTQID/:TestID/:QuestionID',edutron.deleteTQID);

    router.post('/addQAID',edutron.AddQAID);
    router.put('/updateQAID/:QuestionID/:AnswerID',edutron.updateQAID);
    router.delete('/deleteQAID/:QuestionID/:AnswerID',edutron.deleteQAID);

    router.post('/addUTID',edutron.AddUTID);
    router.put('/updateUTID/:UserID/:TestID',edutron.updateUTID);
    router.delete('/deleteUTID/:UserID/:TestID',edutron.deleteUTID);

    router.post('/addUQID',edutron.AddUQID);
    router.put('/updateUQID/:UserID/:QuestionID',edutron.updateUQID);
    router.delete('/deleteUQID/:UserID/:QuestionID',edutron.deleteUQID);

    router.post('/addUAID',edutron.AddUAID);
    router.put('/updateUAID/:id',edutron.updateUAID);
    router.delete('/deleteUAID/:id',edutron.deleteUAID);

    router.post('/createTest',edutron.createTest);
    router.post('/createQuestion',edutron.createQuestion);
    router.post('/createAnswer',edutron.createAnswer);

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
	
	router.post('/createCategory',admin.createCategory);
	router.put('/updateCategory/:id',admin.updateCategory);
	router.delete('/deleteCategory/:id',admin.deleteCategory);
	
	router.post('/createRole',admin.createRole);
	router.put('/updateRole/:id',admin.updateRole);
	router.delete('/deleteRole/:id',admin.deleteRole);

    // User methods
    router.get('/user/:id',user.getUserById);
    router.post('/register',user.createUser);
    router.put('/updateUser/:id',user.updateUser);
    router.delete('/deleteUser/:id',user.deleteUser);
    router.post('/loggedIn',user.loggedIn);


    app.use('/api/edutron',router);
}