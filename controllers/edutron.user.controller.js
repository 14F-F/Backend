const connection = require('../config/db');
var crypto = require('crypto');
const dotenv = require('dotenv');
const jsontoken = require('jsonwebtoken');


function genToken(req) {
    let data = {
        time: Date.now(),
        UserID: req.params.id
    }
    let token = jsontoken.sign(data, `14f`, { expiresIn: "1d" });
    console.log(token);
    return token;
}
const validations = {
    getUserById(req,res) {
        const id = req.params.id;
        const sql = `SELECT * FROM user WHERE id = ${id}`;
        connection.query(
            sql,
            (err,data)=>{
                if(err){
                    res.status(500).send({
                        message: err.message || 'Unknown error'
                    })
                }
                else {
                    if (data.length == 0){
                        res.status(404).send({
                            message:'Not found.'
                        });
                        return;
                    }
                    res.send(data);
                }
            }
        );
    },
    createUser(req, res) {
        if (validate(req, res)) {
			const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const newUser = {
                Name: req.body.Name,
                PwHash: crypto.createHash('md5').update(req.body.Name + req.body.Password).digest('hex'),
                Role: req.body.Role,
                InstituteID: req.body.InstituteID,
                Email: req.body.Email,
                CreatedAt: date
            };
            const sql = 'INSERT INTO user SET ? ';
            // Új felhasználó felvitele
            connection.query(sql, newUser, (err, data) => {
                if (err) {
                    res.status(500).send({
                        message: err.message || 'Unknown error'
                    })
                } else {
                    res.send(
                        {
                            id: data.insertId,
                            ...newUser,
                        }
                    );
                }
            });
        }

    },
    updateUser(req, res) {
        if (validate(req, res)) {
            const id = req.params.id;
            const user = {
                Name: req.body.Name,
                PwHash: crypto.createHash('md5').update(req.body.Name + req.body.Password).digest('hex'),
                Role: req.body.Role,
                InstituteID: req.body.InstituteID,
                Email: req.body.Email
            }
            const sql = `UPDATE user SET Name = ?, PwHash = ?,Role = ?,InstituteID = ?, Email= ? WHERE ID = ${id}`;
            connection.query(
                sql,
                [user.Name, user.PwHash, user.Role, user.InstituteID, user.Email, id],
                (err, data) => {
                    if (err) {
                        res.status(500).send({
                            message: err.message || 'Unknown error'
                        })
                    } else {
                        if (data.affectedRows == 0) {
                            res.status(404).send({
                                message: `Not found user witd id: ${req.params.id}.`
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
        }
    },
    /////////////////////////////////////////////////////////////
    deleteUser(req, res) {
        const id = req.params.id;
        const sql = 'delete from user where id = ?';
        connection.query(
            sql,
            id,
            (err, data) => {
                if (err) {
                    res.status(500).send({
                        message: err.message || 'Unknown error'
                    })
                } else {
                    if (data.affectedRows == 0) {
                        res.status(404).send({
                            message: `Not found user witd id: ${req.params.id}.`
                        });
                        return;
                    }
                    res.send({
                        message: 'User was deleted successfully!'
                    });
                }
            }
        );
    },
    loggedIn(req, res) {
        
        if (validate(req, res)) {
            const loginData = {
                Name: req.body.Name,
                PwHash: PwHashCheck()
            }

            function PwHashCheck() {
                if (req.body.Password != "") {
                    PwHash = crypto.createHash('md5').update(req.body.Name + req.body.Password).digest('hex');
                }
                else {
                    PwHash = "";
                }
                return PwHash;
                
            }
            let sql = `select * from user where pwhash = "${loginData.PwHash}"`;
            connection.query(sql, loginData, (err, data) => {
                
                if (err) {
                    res.status(500).send({
                        message: err.message || 'Unknown error'
                    })
                }
                else {
                    if (userValidation(req, res, loginData)) {
                        if (data.length == 1) {
                            res.status(200).send(
                            {
                                token: genToken(req)
                            }
                            );
                            console.log("Successful login")
                        }
                        else if (data.length == 0) {
                            res.send(500,
                                "User not created."
                            );
                            }
                        else if (data.length > 1) {
                            res.send(500,
                                'User is logged in more than once.'
                            );
                        }
                        else {
                            res.send(500,
                                'Unknown error.'
                            );
                        }
                    }
                }
            });
        }
    },
}
function userValidation(req, res, loginData) {
    if (loginData.Name == "") { res.send(400, "Username is empty"); return false;}
    if (loginData.PwHash == "") { res.send(400, "Password is empty"); return false;} 
    else return true;
}
function validate(req, res) {
    if (JSON.stringify(req.body) == '{}') {
        res.status(400).send({
            message: 'Content can not be empty!'
        });
    }
    if (req.body.Name != '' && req.body.Name != undefined) {
        if (req.body.Name.length > 50) {
            res.status(400).send({
                message: 'Name cant be shorter than 50 digits!'
            });
            return false;
        }
    }
    if (req.body.PwHash != undefined && req.body.PwHash.length > 50) {
        res.status(400).send({
            message: 'PwHash generated wrong!'
        });
        return false;
    }
    if (req.body.InstituteID != undefined && req.body.InstituteID.length > 6) {
        res.status(400).send({
            message: 'InstituteID is longer then expected!'
        });
        return false;
    }
    if (req.body.Email != undefined && req.body.Email.length > 255) {
        res.status(400).send({
            message: 'Email must be shorter than 255 characters!'
        });
        return false;
    }
    else if (req.body.Email != undefined && !req.body.Email.includes('@') && !req.body.Email.includes('.')) {
        res.status(400).send({
            message: 'Email is not in the correct format!'
        });
        return false;
    }
    console.log("validation was successful!")
    return true;
}
module.exports = validations;