var ObjectId = require('mongodb').ObjectID;
var Image = require('../media/models');
var User = require('../user/models/user');
const path = require('path');
const configs = require('../../configs');

const AVAILABLE_IMAGE_TYPE = ["PROFILE"]

exports.get_image = function(req, res, next){
    var img_id = req.params.id;
    try {
        Image.findOne({"_id": ObjectId(img_id)}, (err, img)=>{
            if (err) {
                res.status(404).send({err:err.message});
                return next(err);
            }
            res.status(200);
        })
    }catch(e){
        return res.status(500).send({error: e.message});
    }
}

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