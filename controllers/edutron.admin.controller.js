const connection = require('../config/db');
const validations = {
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
    createCategory(req,res){
        if ( validate(req,res) ) { 
            const newCategory = {
                Name: req.body.Name,
            };
            const sql = 'INSERT INTO category SET ? ';
            connection.query(sql,newCategory,(err,data)=>{
                if (err){
                    res.status(500).send({
                        message: err.message || 'Unknown error'
                    })
                }
                else {
                    res.send(
                        {
                            id: data.insertId,
                            ...newCategory,
                        }
                    );
                }
            });
		}   
    },
	updateCategory(req,res){
        const id = req.params.id;
        const newCategory = {
            Name: req.body.Name,
        };
        const sql = `update category SET Name = ? where id = ${id}`;
        connection.query(sql,newCategory,(err,data)=>{
            if (err){
                res.status(500).send({
                    message: err.message || 'Unknown error'
                })
            }else {
                res.send(
                    {
                        ...newCategory
                    },
                ); 
            }
        }); 
    },
	deleteCategory(req,res){
        const id = req.params.id;
        const sql = 'delete from category where id = ?';
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
                            message : `Not found category with id: ${id}.`
                        });
                        return;
                    }
                    res.send({
                       message : `Category with id: ${id} was deleted successfully!`
                    });
                }
            }
        );
    },
	
	createRole(req,res){
        if ( validate(req,res) ) { 
            const newRole = {
                Name: req.body.Name,
				Value: req.body.Value
            };
            const sql = 'INSERT INTO role SET ? ';
            connection.query(sql,newRole,(err,data)=>{
                if (err){
                    res.status(500).send({
                        message: err.message || 'Unknown error'
                    })
                }
                else {
                    res.send(
                        {
                            id: data.insertId,
                            ...newRole,
                        }
                    );
                }
            });
		}   
    },
	updateRole(req,res){
        const id = req.params.id;
        const newRole = {
            Name: req.body.Name,
			Value: req.body.Value
        };
        const sql = `update category SET Name = ?,Value = ? where id = ${id}`;
        connection.query(sql,newRole,(err,data)=>{
            if (err){
                res.status(500).send({
                    message: err.message || 'Unknown error'
                })
            }else {
                res.send(
                    {
                        ...newRole
                    },
                ); 
            }
        }); 
    },
	deleteRole(req,res){
		
        const id = req.params.id;
        const sql = 'delete from role where id = ?';
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
                            message : `Not found role with id: ${req.params.id}.`
                        });
                        return;
                    }
                    res.send({
                       message : `Role with id: ${id} was deleted successfully!`
                    });
                }
            }
        );
    },

	createInstitute(req,res){
        if ( validate(req,res) ) { 
            const newInstitute = {
				ID : req.body.ID,
				Name : req.body.Name
            };
            const sql = 'INSERT INTO institute SET ? ';
            connection.query(sql,newInstitute,(err,data)=>{
                if (err){
                    res.status(500).send({
                        message: err.message || 'Unknown error'
                    })
                }
                else {
                    res.send(
                        {
                            ...newInstitute,
                        }
                    );
                }
            });
		}   
    },
	updateInstitute(req,res){
        const id = req.params.id;
        const newInstitute = {
            ID: id,
			Name: req.body.Name
        };
        const sql = `update institute SET ID = ?,Name = ? where id = ${id}`;
        connection.query(sql,newInstitute,(err,data)=>{
            if (err){
                res.status(500).send({
                    message: err.message || 'Unknown error'
                })
            }else {
                res.send(
                    {
                        ...newInstitute
                    },
                ); 
            }
        }); 
    },
	deleteInstitute(req,res){
        const id = req.params.id;
        const sql = 'delete from institute where id = ?';
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
                            message : `Not found intitute with id: ${req.params.id}.`
                        });
                        return;
                    }
                    res.send({
                       message : `Institute with id: ${id} was deleted successfully!`
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
