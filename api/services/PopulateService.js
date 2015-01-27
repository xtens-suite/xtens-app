/**
 * @module
 * @author Massimiliano Izzo
 * @author Valentina Tedone
 */    
var MAX = sails.config.xtens.constants.TEST_MAX;
var MIN = sails.config.xtens.constants.TEST_MIN;
var FieldTypes = sails.config.xtens.constants.FieldTypes;

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

var PopulateService = {

    /**
     * @name generateData
     * @param {DataType} dataType - a DataType model
     * @return {Data} data - a new Data instance
     */
    generateData: function(dataType) {

        var data = {type:dataType.id,date:new Date(),notes:"generated by PopulateService.generateData"};

        // skipping the loop fields getRandomArbitrary(min, max
        var fields = DataTypeService.getFlattenedFields(dataType,true);
        var metadata = {};
        fields.forEach(function(field){

            switch(field.fieldType){
                case FieldTypes.TEXT:
                    metadata[field.name] = PopulateService.generateTextField(field);
                break;
                case FieldTypes.FLOAT:
                    metadata[field.name] = PopulateService.generateFloatField(field);
                break;
                case FieldTypes.INTEGER:
                    metadata[field.name] = PopulateService.generateIntegerField(field);
                break;
                case FieldTypes.BOOLEAN:
                    metadata[field.name] = PopulateService.generateBooleanField(field);
                break;
                case FieldTypes.DATE:
                    metadata[field.name] = PopulateService.genarateDateField(field);
                break;
            }

        });
        data.metadata = metadata;
        return data;
    },

    generateFloatField: function(field) {

        var min = field.min || MIN;
        var max = field.max || MAX;

        var res = {
            "value": parseFloat(getRandomArbitrary(min, max).toFixed(3)),
            "unit": (field.hasUnit) ? field.possibleUnits[0] : undefined
        };
        console.log("float field is:" + res);
        return res;

    },

    generateTextField: function(field) {

        var res = { "value": Math.random().toString(36)
        };
       console.log("text field is:"+ res);
       return res;
    },

    generateIntegerField: function(field) {

        var min = field.min || MIN;
        var max = field.max || MAX;
    
        var res = { "value": Math.floor(getRandomArbitrary(min,max)),
        "unit": (field.hasUnit) ? field.possibleUnits[0] : undefined};

        console.log("integer field is:" + res);
        return res;
    },

    generateBooleanField: function(field) {
    
        var min = 0;
        var max = 2;
        var value;

        if (Math.floor(getRandomArbitrary(min,max))===0){
            value = true;
        }
        else {
            value = false;
        }
        console.log(value);
        var res = {"value":value};
        console.log("boolean field is:" + res);
        return res;
    },

    generateDateField : function(field) {
    
    }

};
module.exports = PopulateService;
