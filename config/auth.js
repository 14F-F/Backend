const value = require('../config/defRoles');
const authorizations = {
    sessionCheck(req,res){
        if(req.body.token == "" || req.body.token == null || req.body.token == undefined){
            res.status(403).send(
                {
                message: 'authentication_key couldnt be accessed to this action!'
                });
            return false;
        }
        return true;
    },
    roleCheck(req,res,allowedValue){
        if(!req.body.value > allowedValue){
            res.status(403).send(
                {
                message: 'You are not authorized to this action!'
                });
            return false;
        }
        return true;
    }
}

module.exports = authorizations;