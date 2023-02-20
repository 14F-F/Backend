const connection = require('../config/db');

const tutorials = {
    getAll(req,res){
        let sql = 'select * from tutorials';
        connection.query(sql,(err,data)=>{
            if (err){
                res.status(500).send({
                    message: err.message || 'Unknow error'
                })
            }else {
                res.send(data); // adatküldés
            }
        });
    },
    getTutorialById(req,res){
        const id = req.params.id;
        const sql ='select * from tutorials where id = ?';
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
                res.send(data); // adatküldés
            }
        });
    },
    getAllPublished(req,res){
        const sql = 'select * from tutorials where published = true';
        connection.query(sql,(err,data)=>{
            if (err){
                res.status(500).send({
                    message: err.message || 'Unknow error'
                })
            }else {
                res.send(data); // adatküldés
            }
        });
    },
    create(req,res){
        if ( validate(req,res) ) { return; }
        const newTutorial = {
            title: req.body.title,
            description: req.body.description,
            published: req.body.published
        };
        const sql = 'insert into tutorials set ?';
        connection.query(sql,newTutorial,(err,data)=>{
            if (err){
                res.status(500).send({
                    message: err.message || 'Unknow error'
                })
            }else {
                res.send(
                    {
                        id: data.insertId,
                        ...newTutorial
                    }
                ); 
            }
        });
    },
    update(req,res){
        if ( validate(req,res) ) { return; }
        const id = req.params.id;
        const tutorial = {
            title: req.body.title,
            description: req.body.description,
            published: req.body.published
        }
        const sql='update tutorials set title = ?, description = ?, published = ? where id = ?';
        connection.query(
            sql,
            [tutorial.title,tutorial.description,tutorial.published,id],
            (err,data) => {
                if (err){
                    res.status(500).send({
                        message: err.message || 'Unknow error'
                    })
                }else {
                    // id letezik-e?
                    if (data.affectedRows == 0){
                        // nincs ilyen id-jü rekord
                        res.status(404).send({
                            message : `Not found tutorial witd id: ${req.params.id}.`
                        });
                        return; // kilépés a fv-ből
                    }
                    res.send({
                        id: id,
                        ...tutorial
                    });
                }
            }
        );
    },
    delete(req,res){
        const id = req.params.id;
        const sql = 'delete from tutorials where id = ?';
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
                        // nincs ilyen id-jü rekord
                        res.status(404).send({
                            message : `Not found tutorial witd id: ${req.params.id}.`
                        });
                        return; // kilépés a fv-ből
                    }
                    res.send({
                       message : 'Tutorial was deleted successfully!'
                    });
                }
            }
        );
    }

}

function validate(req,res){
    //console.log(req.body);        
    if (JSON.stringify(req.body) == '{}'){
        res.status(400).send({
            message : 'Content can not be empty!'
        });
        return true;
    }
    if (req.body.title == ''){
        res.status(400).send({
            message : 'Title required!'
        });
        return true;
    }
    if (req.body.description == ''){
        res.status(400).send({
            message : 'Title description!'
        });
        return true;
    }


    return false;
}

module.exports = tutorials;