const connection = require('../config/db');
const LastIDs = {
    TestID: 0,
    QuestionID: 0,
    AnswerID: 0
}

const validations = {
    // ONLY FOR TEST PURPOSES

    getAllFromTable(req,res){
        const table = req.params.tableName;
        const sql = `SELECT * FROM ${table}`;
        connection.query(
            sql,
            (err,data)=>{
                if(err){
                    res.status(500).send({
                        message: err.message || 'Unknown error'
                    })
                }
                else{
                    res.send(data);
                }
            }
        );
    },
    deleteAllLogs(req,res){
        const sql = 'delete from user_answer';
        connection.query(
            sql,
            (err,data)=>{
                if (err){
                    res.status(500).send({
                        message: err.message || 'Unknown error'
                    })
                }else {
                    if (data.affectedRows == 0){
                        res.status(404).send({
                            message : `Not found any logs.`
                        });
                        return;
                    }
                    res.send({
                       message : 'Logs deleted successfully!'
                    });
                }
            }
        );
    },
    getTestById(req,res){
        const id = req.params.id;
        const sql =`select * from test where id = ${id}`;
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
    getTestByCategoryId(req,res){
        const categoryId = req.params.categoryId;
        const sql = 'SELECT * FROM test '+
        'INNER JOIN category ON test.CategoryID = category.ID '+
        `WHERE category.id = ${categoryId}`;
        connection.query(
            sql,
            categoryId,
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
    getTestByUserId(req,res){
        const userId = req.params.userId;
        const sql = 'SELECT * FROM test '+
                    'INNER JOIN user_test ON test.ID = user_test.TestID '+
                    'INNER JOIN user ON user.ID = user_test.UserID '+
                    `WHERE user.id = ${userId}`;
        connection.query(
            sql,
            userId,
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
        `WHERE test.ID = ${id}`;
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
                        message:'Not found.'
                    });
                    return;
                }
                res.send(data);
            }
        });
    },

    getQuestionByTestId(req,res){
        const id = req.params.id;
        const sql =
        'SELECT * FROM question '+
        'INNER JOIN test_question ON test.ID = test_question.TestID '+
        'INNER JOIN question ON test_question.QuestionID = question.ID '+
        `WHERE test.ID = ${id}`;
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
                        message:'Not found.'
                    });
                    return;
                }
                res.send(data);
            }
        });
    },
    getAnswerByQuestionId(req,res){
        const id = req.params.id;
        const sql =
        'SELECT * FROM answer '+
        'INNER JOIN question_answer ON answer.ID = question_answer.AnswerID '+
        'INNER JOIN question ON question_answer.QuestionID = question.ID '+
        `WHERE question.ID = ${id}`;
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
                        message:'Not found.'
                    });
                    return;
                }
                res.send(data);
            }
        });
    },

    logTest(req,res){
        const id = req.params.id;
        const sql ='INSERT INTO user_answer SET ?';
        const log = {
            UserID: req.params.UserID,
            TestID: req.params.TestID,
            QuestionID: req.params.QuestionID,
            AnswerID: req.params.AnswerID,
            Result: req.params.Result
        }
        connection.query(sql,log,(err,data)=>{
            if(err){
                res.status(500).send({
                    message: err.message || 'Unknown error'
                })
            }
            else {
                res.send(
                    {
                        id:data.insertId,
                        ...log,
                    }
                );
            }
        });
    },
    createTest(req,res){
        if ( validate(req,res) ) { 
            const newTest = {
                Name: req.body.Name,
                SolvingCode: req.body.SolvingCode,
                CategoryID: req.body.CategoryID,
                Visibility: req.body.Visibility,
                CreatorID: req.body.CreatorID,
                CreatedDate: Date.now()
            };
            const sql = 'INSERT INTO test SET ? ';
            connection.query(sql,newTest,(err,data)=>{
                if (err){
                    res.status(500).send({
                        message: err.message || 'Unknown error'
                    })
                }
                else {
                    res.send(
                        {
                            id: data.insertId,
                            ...newTest,
                        }
                    );
                    LastIDs.TestID = data.insertId; 
                }
            });
         }   
    },
    createQuestion(req,res){
        if ( validate(req,res) ) { 
            const newQuestion = {
                QuestionText: req.body.QuestionText,
                CategoryID: req.body.CategoryID,
                PhotoID: req.body.PhotoID,
                CreatorID: req.body.CreatorID
            };
            const sql = 'INSERT INTO question SET ? ';
            connection.query(sql,newQuestion,(err,data)=>{
                if (err){
                    res.status(500).send({
                        message: err.message || 'Unknown error'
                    })
                }
                else {
                    res.send(
                        {
                            id: data.insertId,
                            ...newQuestion
                        }
                    );
                    LastIDs.QuestionID = data.insertId;
                }
            });
         }
    },

    AddTQID(req,res){
        const newTQ = {
            TestID: LastIDs.TestID,
            QuestionID: LastIDs.QuestionID
        };
        const sql2 = 'INSERT INTO test_question SET ? ';
        connection.query(sql2,newTQ,(err,data)=>{
            if (err){
                res.status(500).send({
                    message: err.message || 'Unknown error'
                })
            }else {
                res.send(
                    {
                        ...newTQ
                    },
                ); 
            }
        }); 
    },
    updateTQID(req,res){
        const TQ = {
            TestID: LastIDs.TestID,
            QuestionID: LastIDs.QuestionID
        };
        const sql = 'update test_question SET TestID = ?,QuestionID = ?';
        connection.query(sql,newTQ,(err,data)=>{
            if (err){
                res.status(500).send({
                    message: err.message || 'Unknown error'
                })
            }else {
                res.send(
                    {
                        ...TQ
                    },
                ); 
            }
        }); 
    },
    deleteTQID(req,res){
        const TestID = req.params.testId;
        const QuestionID = req.params.questionId;
        const sql = `delete from test_question where questionId = ${QuestionID} and testId = ${TestID}`;
        connection.query(
            sql,[QuestionID,TestID],
            (err,data)=>{
                if (err){
                    res.status(500).send({
                        message: err.message || 'Unknown error'
                    })
                }else {
                    if (data.affectedRows == 0){
                        res.status(404).send({
                            message : `Not found row with questionId: ${req.params.QuestionID} or testId: ${req.params.TestID}.`
                        });
                        return;
                    }
                    res.send({
                       message : 'Row deleted successfully!'
                    });
                }
            }
        );
    },

    createAnswer(req,res){
        if ( validate(req,res) ) { 
            const newAnswer = {
                AnswerText: req.body.AnswerText,
                Correct: req.body.Correct
            };
            const sql = 'INSERT INTO answer SET ? ';
            connection.query(sql,newAnswer,(err,data)=>{
                if (err){
                    res.status(500).send({
                        message: err.message || 'Unknown error'
                    })
                }
                else {
                    res.send(
                        {
                            id: data.insertId,
                            ...newAnswer
                        }
                    );
                    LastIDs.AnswerID = data.insertId;
                }
            });
         }

    },

    AddQAID(req,res){
        const newQA = {
            QuestionID : LastIDs.QuestionID,
            AnswerID : LastIDs.AnswerID
        };
        const sql2 = 'INSERT INTO question_answer SET ? ';
        connection.query(sql2,newQA,(err,data)=>{
            if (err){
                res.status(500).send({
                    message: err.message || 'Unknown error'
                })
            }else {
                res.send(
                    {
                        id: data.insertId,
                        ...newQA
                    },
                    
                ); 
            }
        }); 
    },
    updateQAID(req,res){
        const QA = {
            QuestionID: LastIDs.QuestionID,
            AnswerID: LastIDs.AnswerID
        };
        const sql = 'update question_answer SET QuestionID = ?,AnswerID = ?';
        connection.query(sql,QA,(err,data)=>{
            if (err){
                res.status(500).send({
                    message: err.message || 'Unknown error'
                })
            }else {
                res.send(
                    {
                        ...QA
                    },
                ); 
            }
        }); 
    },
    deleteQAID(req,res){
        const QuestionID = req.params.questionId;
        const AnswerID = req.params.answerId;
        const sql = `delete from question_answer where questionId = ${QuestionID} and answerId = ${AnswerID}`;
        connection.query(
            sql,[QuestionID,AnswerID],
            (err,data)=>{
                if (err){
                    res.status(500).send({
                        message: err.message || 'Unknown error'
                    })
                }else {
                    if (data.affectedRows == 0){
                        res.status(404).send({
                            message : `Not found row with questionId: ${req.params.QuestionID} or answerId: ${req.params.AnswerID}.`
                        });
                        return;
                    }
                    res.send({
                       message : 'Row deleted successfully!'
                    });
                }
            }
        );
    },
    
    updateTest(req,res){
        if ( validate(req,res) ) { 
            const id = req.params.id;
            const test = {
                Name: req.body.Name,
                SolvingCode: req.body.SolvingCode,
                CategoryID: req.body.CategoryID,
                Visibility: req.body.Visibility,
                CreatorID: req.body.CreatorID
            }
            const sql=`update test set name = ?, solvingcode = ?, categoryid = ?, visibility = ?, creatorid = ? where id = ${id}`;
            connection.query(
                sql,
                [test.Name, test.SolvingCode, test.CategoryID, test.Visibility, test.CreatorID, test.CreatedDate,id],
                (err,data) => {
                    if (err){
                        res.status(500).send({
                            message: err.message || 'Unknown error'
                        })
                    }
                    else {
                        console.log(test)
                        console.log(data)
                        if (data.affectedRows == 0){
                            res.status(404).send({
                                message : `Not found test with id: ${req.params.id}.`
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
         }   
    },
    updateQuestion(req,res){
        if ( validate(req,res) ) { 
            const id = req.params.id;
        const question = {
            CategoryID: req.body.CategoryID,
            PhotoID: req.body.PhotoID,
            CreatorID: req.body.CreatorID,
            QuestionText: req.body.QuestionText
        }
        const sql=`update question set categoryid = ?, photoid = ?, CreatorID = ?, questiontext = ? where id = ${id}`;
        connection.query(
            sql,
            [question.CategoryID,question.PhotoID,question.CreatorID,question.QuestionText,id],
            (err,data) => {
                if (err){
                    res.status(500).send({
                        message: err.message || 'Unknown error'
                    })
                }else {
                    if (data.affectedRows == 0){
                        res.status(404).send({
                            message : `Not found question with id: ${req.params.id}.`
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
         }    
    },
    updateAnswer(req,res){
        if ( validate(req,res) ) { 
            const id = req.params.id;
            const answer = {
                Correct: req.body.Correct,
                AnswerText: req.body.AnswerText
            }
            const sql=`UPDATE answer SET Correct = ?, AnswerText = ? WHERE ID = ${id}`;
            connection.query(
                sql,
                [answer.AnswerText,answer.Correct,id],
                (err,data) => {
                    console.log(answer)
                    console.log(data)
                    if (err){
                        res.status(500).send({
                            message: err.message || 'Unknown error'
                        })
                    }else {
                        if (data.affectedRows == 0){
                            res.status(404).send({
                                message : `Not found answer with id: ${req.params.id}.`
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
         }   
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
        return false;
    }
    if (req.body.Name != undefined && req.body.Name.length > 32) {
            res.status(400).send({
            message : 'Name cant be longer than 32 digits!'
        });
        return false;
    }
    if (req.body.PhotoID != undefined && req.body.PhotoID.length > 255) {
            res.status(400).send({
            message : 'PhotoID cant be longer than 255 digits!'
        });
        return false;
    }
    if (req.body.QuestionText != undefined && req.body.QuestionText.length > 255) {
            res.status(400).send({
            message : 'QuestionText cant be longer than 255 digits!'
        });
        return false;
    }
    if (req.body.AnswerText != undefined &&req.body.AnswerText.length > 255) {
            res.status(400).send({
            message : 'AnswerText cant be longer than 255 digits!'
        });
        return false;
    }   
    if (req.body.Correct != undefined && (req.body.Correct != 1 && req.body.Correct != 0)) {
            res.status(400).send({
            message : 'Correct cant be longer than 1 digits!'
        });
        return false;
    }   
    if (req.body.SolvingCode != undefined && req.body.SolvingCode.length > 16){
        res.status(400).send({
            message : 'Solving Code cant be longer than 16 digits!'
        });
        return false;
    }
    if (req.body.CategoryID != undefined && req.body.CategoryID.length > 11){
        res.status(400).send({
            message : 'Category ID cant be longer than 11 digits!'
        });
        return false;
    }
    if (req.body.Visibility != undefined && req.body.Visibility.length > 11){
        res.status(400).send({
            message : 'Visibility cant be longer than 11 digits!'
        });
        return false;
    }
    if (req.body.CreatorID != undefined && req.body.CreatorID.length > 11){
        res.status(400).send({
            message : 'Creator ID cant be longer than 11 digits!'
        });
        return false;
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
        return false;
    }
    return true;
}

module.exports = validations;
