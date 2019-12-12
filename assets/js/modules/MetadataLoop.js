(function (xtens, MetadataLoop) {
    MetadataLoop.Views = {};
    var i18n = require('./i18n.js').en;
    var MetadataComponent = require('./MetadataComponent.js');
    var MetadataField = require('./MetadataField.js');
    var constants = require('./XtensConstants.js').Constants;

    MetadataLoop.Model = Backbone.Model.extend({
        defaults: {
            label: constants.METADATA_LOOP,
            name: null
        }
    });

    MetadataLoop.Views.Edit = MetadataComponent.Views.Edit.fullExtend({

        tagName: 'div',
        className: 'metadataLoop',

        bindings: {
            'input[name=name]': 'name'
        },

        // template: _.template($("#metadata-field-form-template").html()),
        initialize: function () {
            this.template = require('./../../templates/metadataloop-edit.ejs');
            this.nestedViews = [];
        },

        events: {
            'click .remove-me': 'closeMe',
            'click .add-metadata-field': 'addMetadataFieldOnClick'
        },

        addMetadataFieldOnClick: function (ev) {
            this.add({ label: constants.METADATA_FIELD });
            ev.stopPropagation();
        },

        add: function (field) {
            var model = new MetadataField.Model();
            model.set(field);
            var view = new MetadataField.Views.Edit({ model: model });
            this.$('.metadataLoop-body').append(view.render(field).el);
            this.listenTo(view, 'closeMe', this.removeChild);
            this.nestedViews.push(view);
        }

    });
}(xtens, require('./MetadataLoop.js')));
