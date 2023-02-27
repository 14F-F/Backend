const connection = require('../config/db');

const validations = {
    getAll(req,res){
        let sql = 'select * from test';
        connection.query(sql,(err,data)=>{
            if (err){
                res.status(500).send({
                    message: err.message || 'Unknow error'
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
                    message: err.message || 'Unknow error'
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
    getAllByCategory(req,res){
        const id = req.params.CategoryID;
        const sql ='SELECT * FROM test WHERE categoryid = ?';
        connection.query(
            sql,
            id,
            (err,data)=>{
            if (err){
                res.status(500).send({
                    message: err.message || 'Unknow error'
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
        const sql = 'insert into test set ?';
        connection.query(sql,newTest,(err,data)=>{
            if (err){
                res.status(500).send({
                    message: err.message || 'Unknow error'
                })
            }else {
                res.send(
                    {
                        id: data.insertId,
                        ...newTest
                    }
                ); 
            }
        });
    },
    update(req,res){
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
                        message: err.message || 'Unknow error'
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
    delete(req,res){
        const id = req.params.id;
        const sql = 'delete from test where id = ?';
        connection.query(
            sql,
            id,
            (err,data)=>{
                if (err){
                    res.status(500).send({
                        message: err.message || 'Unknow error'
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

// SELECT * FROM test,test_question,question,question_answer,answer
// INNER JOIN test_question ON test.ID = test_question.TestID
// INNER JOIN test_question ON question.ID = test_question.QuestionID
// INNER JOIN question_answer ON question.ID = question_answer.QuestionID
// INNER JOIN question_answer ON answer.ID = question_answer.AnswerID
// WHERE test.ID = ?;