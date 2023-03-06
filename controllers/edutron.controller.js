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
        const sql = 'INSERT INTO test SET ? ';
        connection.query(sql,newTest,(err,data)=>{
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
    },
    createQuestion(req,res){
        if ( validate(req,res) ) { return; }
        const newQuestion = {
            QuestionText: req.body.QuestionText,
            CategoryID: req.body.CategoryID,
            PhotoID: req.body.PhotoID
        };
        const sql = 'INSERT INTO question SET ? ';
        connection.query(sql,newQuestion,(err,data)=>{
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

    },
    createAnswer(req,res){
        if ( validate(req,res) ) { return; }
        const newAnswer = {
            AnswerText: req.body.QuestionText,
            Correct: req.body.Correct
        };
        const sql = 'INSERT INTO answer SET ? ';
        connection.query(sql,newAnswer,(err,data)=>{
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
                        ...question
                    });
                }
            }
        );
    },
    updateAnswer(req,res){
        if ( validate(req,res) ) { return; }
        const id = req.params.id;
        const answer = {
            Correct: req.body.Correct,
            AnswerText: req.body.AnswerText
        }
        const sql='update answer set answertext = ? where id = ?';
        connection.query(
            sql,
            [answer.AnswerText,answer.Correct],
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
                        ...answer
                    });
                }
            }
        );
    },
    
    deleteTest(req,res){
        const id = req.params.id;
        const sql = 'delete from test where id = ?';
        const sqlt ='delete from test_question where TestID = ?';
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
                            message : `Not found test with id: ${req.params.id}.`
                        });
                        return;
                    }
                    res.send({
                       message : 'Test was deleted successfully!'
                    });
                }
            }
        );
        connection.query(
            sqlt,
            id,
            (err,data)=>{
                if (err){
                    res.status(500).send({
                        message: err.message || 'Unknown error'
                    })
                }else {
                    if (data.affectedRows == 0){
                        res.status(404).send({
                            message : `Not found test key in the connection table with id: ${req.params.id}.`
                        });
                        return;
                    }
                    res.send({
                       message : 'Test key was deleted successfully!'
                    });
                }
            }
        );
    },
    deleteQuestion(req,res){
        const id = req.params.id;
        const sql = 'delete from question where id = ?';
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
                            message : `Not found question witd id: ${req.params.id}.`
                        });
                        return;
                    }
                    res.send({
                       message : 'Question was deleted successfully!'
                    });
                }
            }
        );
    },
    deleteAnswer(req,res){
        const id = req.params.id;
        const sql = 'delete from answer where id = ?';
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
                            message : `Not found answer witd id: ${req.params.id}.`
                        });
                        return;
                    }
                    res.send({
                       message : 'Answer was deleted successfully!'
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
    if (req.body.Name != ''){
        if (req.body.Name.length > 32) {
            res.status(400).send({
            message : 'Name cant be shorter than 32 digits!'
        });
        }
        return true;
    }
    else
    {
        res.status(400).send({
            message : 'Name required!'
        });
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
            message : 'CreatedDate is not in the correct form (parse error)'
        });
        return true;
    }
    return false;
}

module.exports = validations;
