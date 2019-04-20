var ObjectId = require('mongodb').ObjectID;
var User = require('../user/models/user');
const path = require('path');
const configs = require('../../configs');

exports.upload_profile_image = function(req, res, next){
    var user_id =  req.headers['x-user-key'];
    var image_path = path.join(configs.MEDIA_HOST, req.file.path.slice(7));
    res.status(201).json({
        data: image_path
    });
    try {
        if (user_id) {
            User.findOne({"_id": ObjectId(user_id)}, (err, user) => {
                if (err) {
                    res.status(404).send({err:err.message});
                    return next(err);
                }
                user.about.profile_image = image_path;
                user.save()
                res.status(201).json({
                    data: image_path
                });
            });
        }
        else{
            res.status(422).send({error: 'Missing require field'});
        }
    }catch(e){
        return res.status(500).send({error: e.message});
    }
}