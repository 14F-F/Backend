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
    createSession(req, res){
        if(validations.loggedIn(req,res)){
            console.log("tru")
            let token = genToken(req)
        }
    },
    getAllUser(res) {
        let sql = 'select * from user';
        connection.query(sql, (err, data) => {
            if (err) {
                res.status(500).send({
                    message: err.message || 'Unknown error'
                })
            } else {
                res.send(data);
            }
        });
    },
    createUser(req, res) {
        if (validate(req, res)) {
            const newUser = {
                Name: req.body.Name,
                PwHash: crypto.createHash('md5').update(req.body.Name + req.body.Password).digest('hex'),
                Role: req.body.Role,
                InstituteID: req.body.InstituteID,
                Email: req.body.Email,
                CreatedAt: Date.now()
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
                PwHash: req.body.PwHash,
                Role: req.body.Role,
                InstituteID: req.body.InstituteID,
                Email: req.body.Email,
                CreatedAt: req.body.CreatedAt
            }
            const sql = 'update test set Name = ?, PwHash = ?, Role = ?, InstituteID = ?, Email = ?, CreatedAt = ? where id = ?';
            connection.query(
                sql,
                [user.Name, user.PwHash, user.Role, user.InstituteID, user.Email, user.CreatedAt, id],
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
                Name: req.body.UserName,
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
            return connection.query(sql, loginData, (err, data) => {
                if (err) {
                    res.status(500).send({
                        message: err.message || 'Unknown error'
                    })
                }
                else {
                    if (userValidation(req, res, loginData)) {
                        if (data.length == 1) {
                            res.status(200).send(
                                "Successful login!"
                            );
                            return true;
                        }
                        else if (data.length == 0) {
                            res.send(500,
                                "User not created."
                                );
                                return false;
                            }
                        else if (data.length > 1) {
                            res.send(500,
                                'User is logged in more than once.'
                            );
                            return false;
                        }
                        else {
                            res.send(500,
                                'Unknown error.'
                            );
                            return false;
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
    return true;
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