const connection = require('../config/db');

const validations = {
    getAllTest(req,res){
        let sql = 'select * from test';
        connection.query(sql,(err,data)=>{
            if (err){
                res.status(500).send({
                    message: err.message || 'Unknown error'
                })
            }else {
                res.send(data);
            }
        });
    },
    getAllCategory(req,res){
        let sql = 'select * from category';
        connection.query(sql,(err,data)=>{
            if (err){
                res.status(500).send({
                    message: err.message || 'Unknown error'
                })
            }else {
                res.send(data);
            }
        });
    },
    getTestById(req,res){
        const id = req.params.id;
        const sql ='select * from test where id = ?';
        connection.query(
            sql,
            id,
            (err,data)=>{
            if (err){
                res.status(500).send({
                    message: err.message || 'Unknown error'
                })
            }else {
                if (data.length == 0){
                    res.status(404).send({
                        message:'Not found.'
                    });
                    return;
                }
                res.send(data);
            }
        });
    },
    getAllByCategoryId(req,res){
        const id = req.params.id;
        const sql ='SELECT * FROM test WHERE categoryid = ?';
        connection.query(
            sql,
            id,
            (err,data)=>{
            if (err){
                res.status(500).send({
                    message: err.message || 'Unknown error'
                })
            }else {
                if (data.length == 0){
                    res.status(404).send({
                        message:'Not found.'
                    });
                    return;
                }
                res.send(data);
            }
        });
    },
    getAllTestDataById(req,res){
        const id = req.params.id;
        const sql =
        'SELECT * FROM test '+
        'INNER JOIN test_question ON test.ID = test_question.TestID '+
        'INNER JOIN question ON test_question.QuestionID = question.ID '+
        'INNER JOIN question_answer ON question.ID = question_answer.QuestionID '+
        'INNER JOIN answer ON question_answer.AnswerID = answer.ID '+
        'WHERE test.ID = ?';
        connection.query(
            sql,
            id,
            (err,data)=>{
            if (err){
                res.status(500).send({
                    message: err.message || 'Unknown error'
                })
            }else {
                if (data.length == 0){
                    res.status(404).send({
                        message:'Not found.'
                    });
                    return;
                }
                res.send(data);
            }
        });
    },
    createTest(req,res){
        if ( validate(req,res) ) { return; }
        const newTest = {
            Name: req.body.Name,
            SolvingCode: req.body.SolvingCode,
            CategoryID: req.body.CategoryID,
            Visibility: req.body.Visibility,
            CreatorID: req.body.CreatorID,
            CreatedDate: req.body.CreatedDate
        };
        const newQuestion = {
            QuestionText: req.body.QuestionText,
            CategoryID: req.body.CategoryID
        };
        const newAnswer = {
            AnswerText: req.body.AnswerText,
            Correct: req.body.Correct
        };
        const newTnQ = {
            TestID: req.body.TestID,
            QuestionID: req.body.QuestionID
        };
        const newQnA = {
            AnswerID: req.body.AnswerID,
            QuestionID: req.body.QuestionID,
        };
        const testsql = 'INSERT INTO test SET ? ';
        const questionsql = 'INSERT INTO question SET ? ';
        const answersql ='INSERT INTO answer SET ? ';
        const TnQsql = 'INSERT INTO test_question SET ? ';
        const QnAsql = 'INSERT INTO question_answer SET ? ';
        // Új teszt felvitele
        connection.query(testsql,newTest,(err,data)=>{
            if (err){
                res.status(500).send({
                    message: err.message || 'Unknown error'
                })
            }else {
                res.send(
                    {
                        id: data.insertId,
                        ...newTest,
                    }
                ); 
            }
        });
        //  Kérdések 
        for (let question = 0; question < questions.length; question++) {
            connection.query(questionsql,questions[question],(err,data)=>{
                if (err){
                    res.status(500).send({
                        message: err.message || 'Unknown error'
                    })
                }else {
                    res.send(
                        {
                            id: data.insertId,
                            ...newQuestion,
                        }
                    ); 
                }
            });
        //  Teszt-Kérdés kapcsolótábla
            connection.query(TnQsql,newTest,(err,data)=>{
                if (err){
                    res.status(500).send({
                        message: err.message || 'Unknown error'
                    })
                }else {
                    res.send(
                        {
                            id: data.insertId,
                            ...newTnQ,
                        }
                    ); 
                }
            });
        //  Válaszok
            for (let answer = 0; answer < answers.length; answer++) {
                connection.query(answersql,answers[answer],(err,data)=>{
                    if (err){
                        res.status(500).send({
                            message: err.message || 'Unknown error'
                        })
                    }else {
                        res.send(
                            {
                                id: data.insertId,
                                ...newAnswer,
                            }
                        ); 
                    }
                });
        // Kérdés-Válasz kapcsolótábla
                connection.query(QnAsql,newTest,(err,data)=>{
                    if (err){
                        res.status(500).send({
                            message: err.message || 'Unknown error'
                        })
                    }else {
                        res.send(
                            {
                                id: data.insertId,
                                ...newQnA,
                            }
                        ); 
                    }
                });
                
            }
            
        }

    },
    createQuestion(req,res){
        const newQuestion = {
            QuestionText: req.body.QuestionText,
            CategoryID: req.body.CategoryID
        };
        const newAnswer = {
            AnswerText: req.body.AnswerText,
            Correct: req.body.Correct
        };
    },
    updateTest(req,res){
        if ( validate(req,res) ) { return; }
        const id = req.params.id;
        const test = {
            Name: req.body.Name,
            SolvingCode: req.body.SolvingCode,
            CategoryID: req.body.CategoryID,
            Visibility: req.body.Visibility,
            CreatorID: req.body.CreatorID,
            CreatedDate: req.body.CreatedDate
        }
        const sql='update test set Name = ?, SolvingCode = ?, CategoryID = ?, Visibility = ?, CreatorID = ?, CreatedDate = ? where id = ?';
        connection.query(
            sql,
            [test.Name, test.SolvingCode, test.CategoryID, test.Visibility, test.CreatorID, test.CreatedDate],
            (err,data) => {
                if (err){
                    res.status(500).send({
                        message: err.message || 'Unknown error'
                    })
                }else {
                    if (data.affectedRows == 0){
                        res.status(404).send({
                            message : `Not found test witd id: ${req.params.id}.`
                        });
                        return;
                    }
                    res.send({
                        id: id,
                        ...test
                    });
                }
            }
        );
    },
    updateQuestion(req,res){
        if ( validate(req,res) ) { return; }
        const id = req.params.id;
        const question = {
            CategoryID: req.body.CategoryID,
            PhotoID: req.body.PhotoID,
            CreatorID: req.body.CreatorID,
            QuestionText: req.body.QuestionText
        }
        const sql='update question set categoryid = ?, photoid = ?, CreatorID = ?, questiontext = ? where id = ?';
        connection.query(
            sql,
            [question.CategoryID,question.PhotoID,question.CreatorID,question.QuestionText],
            (err,data) => {
                if (err){
                    res.status(500).send({
                        message: err.message || 'Unknown error'
                    })
                }else {
                    if (data.affectedRows == 0){
                        res.status(404).send({
                            message : `Not found question witd id: ${req.params.id}.`
                        });
                        return;
                    }
                    res.send({
                        id: id,
                        ...test
                    });
                }
            }
        );
    },
    deleteTest(req,res){
        const id = req.params.id;
        const sql = 'delete from test where id = ?';
        connection.query(
            sql,
            id,
            (err,data)=>{
                if (err){
                    res.status(500).send({
                        message: err.message || 'Unknown error'
                    })
                }else {
                    if (data.affectedRows == 0){
                        res.status(404).send({
                            message : `Not found test witd id: ${req.params.id}.`
                        });
                        return;
                    }
                    res.send({
                       message : 'Test was deleted successfully!'
                    });
                }
            }
        );
    }

}

function validate(req,res){      
    if (JSON.stringify(req.body) == '{}'){
        res.status(400).send({
            message : 'Content can not be empty!'
        });
        return true;
    }
    if (req.body.Name == ''){
        if (req.body.Name.length > 32) {
            res.status(400).send({
            message : 'Name required and cant be shorter than 32 digits!'
        });
        }
        return true;
    }
    if (req.body.SolvingCode.length > 16){
        res.status(400).send({
            message : 'Solving Code must be shorter than 16 digits!'
        });
        return true;
    }
    if (req.body.CategoryID.length > 11){
        res.status(400).send({
            message : 'Category ID must be shorter than 11 digits!'
        });
        return true;
    }
    if (req.body.Visibility.length > 11){
        res.status(400).send({
            message : 'Visibility must be shorter than 11 digits!'
        });
        return true;
    }
    if (req.body.CreatorID.length > 11){
        res.status(400).send({
            message : 'Creator ID must be shorter than 11 digits!'
        });
        return true;
    }
    try{
        var date = new Date(req.body.CreatedDate)
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDay();
    }
    catch {
        res.status(400).send({
            message : 'CreatedDate is not in the correct form'
        });
        return true;
    }
    return false;
}

module.exports = validations;
