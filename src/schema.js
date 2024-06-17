'use strict';

function Schema (schema) {
    var self = this;

    Object.keys(schema).forEach(function (key) {
        self[key] = schema[key];
    });

    return this;
}

Schema.prototype.getFields = function () {
    var self = this;
    var fields = [];

    Object.keys(this).forEach(function (key) {
        var field = self[key];

        fields.push(field);
    });

    return fields;
};

module.exports = Schema;
