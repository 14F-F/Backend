const connection = require('../config/db');
var crypto = require('crypto');

const validations ={
    getAllUser(res){
        let sql = 'select * from user';
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
    createUser(req,res){
        if ( validate(req,res) ) { return; }
        const newUser = {
            Name: req.body.Name,
            PwHash: crypto.createHash('md5').update(req.body.Password).digest('hex'),
            Role: req.body.Role,
            InstituteID: req.body.InstituteID,
            Email: req.body.Email,
            CreatedAt: req.body.CreatedAt
        };
        const sql = 'INSERT INTO user SET ? ';
        // Új felhasználó felvitele
        connection.query(sql,newUser,(err,data)=>{
            if (err){
                res.status(500).send({
                    message: err.message || 'Unknown error'
                })
            }else {
                res.send(
                    {
                        id: data.insertId,
                        ...newUser,
                    }
                ); 
            }
        });
    },
    updateUser(req,res){
        if ( validate(req,res) ) { return; }
        const id = req.params.id;
        const user = {
            Name: req.body.Name,
            PwHash: req.body.PwHash,
            Role: req.body.Role,
            InstituteID: req.body.InstituteID,
            Email: req.body.Email,
            CreatedAt: req.body.CreatedAt
        }
        const sql='update test set Name = ?, PwHash = ?, Role = ?, InstituteID = ?, Email = ?, CreatedAt = ? where id = ?';
        connection.query(
            sql,
            [user.Name,user.PwHash,user.Role,user.InstituteID,user.Email,user.CreatedAt,id],
            (err,data) => {
                if (err){
                    res.status(500).send({
                        message: err.message || 'Unknown error'
                    })
                }else {
                    if (data.affectedRows == 0){
                        res.status(404).send({
                            message : `Not found user witd id: ${req.params.id}.`
                        });
                        return;
                    }
                    res.send({
                        id: id,
                        ...user
                    });
                }
            }
        );
    },
    /////////////////////////////////////////////////////////////
    deleteUser(req,res){
        const id = req.params.id;
        const sql = 'delete from user where id = ?';
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
                            message : `Not found user witd id: ${req.params.id}.`
                        });
                        return;
                    }
                    res.send({
                       message : 'User was deleted successfully!'
                    });
                }
            }
        );
    },
    loggedIn(req,res){
        if (validate(req,res)) {return;}
        const loginData = {
            UserName : req.body.UserName,
            PwHash : crypto.createHash('md5').update(req.body.Password).digest('hex')
        };
        let sql = 'select * from user';
        connection.query(sql,(err,data)=>{
            if (err){
                res.status(500).send({
                    message: err.message || 'Unknown error'
                })
            }else {
                res.send(data);
            }
        });
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
        if (req.body.Name.length > 50) {
            res.status(400).send({
            message : 'Name cant be shorter than 50 digits!'
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
    if (req.body.PwHash.length > 50){
        res.status(400).send({
            message : 'PwHash generated wrong!'
        });
        return true;
    }
    if (req.body.InstituteID.length > 6){
        res.status(400).send({
            message : 'InstituteID is longer then expected!'
        });
        return true;
    }
    if (req.body.Email.length > 255){
        res.status(400).send({
            message : 'Email must be shorter than 255 characters!'
        });
        return true;
    }
    else if(!req.body.Email.contains('@') && !req.body.Email.contains('.')){
        res.status(400).send({
            message : 'Email is not in the correct format!'
        });
    }
    try{
        var date = new Date(req.body.CreatedAt)
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDay();
    }
    catch {
        res.status(400).send({
            message : 'CreatedAt is not in the correct form (parse error)'
        });
        return true;
    }
    return false;
}
module.exports = validations;