var Validator = require('jsonschema').Validator;
fs = require('fs');
//To read json schema $re
$RefParser = require('json-schema-ref-parser');
configs = require('../../configs')


function validate_schema(file_path, instance){
    return new Promise((resolve, reject) => {
        var heart_rate_schema = JSON.parse(fs.readFileSync(file_path, 'utf8'));
        $RefParser.dereference(configs.open_m_health_schema_path + '/omh/', heart_rate_schema, {})
            .then(function (schema) {
                var validator = new Validator();
                var validated = validator.validate(instance, schema);
                if ((validated.errors).length > 0) {
                    reject(validated.errors);
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
}

exports.heart_rate_validation = function(instance){
    return new Promise((resolve, reject) => {
        file_path = __dirname + "/../utils/open_m_health_schema/omh/heart-rate-1.1.json";
        validate_schema(file_path, instance).catch(
            (error) => {
                reject(error)
            }
        )
    });

}