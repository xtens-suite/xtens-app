/**
 * @author  Massimiliano Izzo
 * @description This file contains the Backbone classes for handling DataType
 *              models, collections and views
 */
(function (xtens, DataFile) {
    DataFile.Views = {};
    var i18n = require('./i18n.js').en;
    var ModalDialog = require('./XtensBootstrap.js').Views.ModalDialog;
    /**
     * @class
     * @name DataFile.Model
     *
     */
    DataFile.Model = Backbone.Model.extend({

        urlRoot: '/dataFile'

    });

    /**
     * @class
     * @name DataFile.List
     */
    DataFile.List = Backbone.Collection.extend({

        url: '/dataFile'

    });

    /**
     * @class
     * @name DataFile.Views.List
     */
    DataFile.Views.List = Backbone.View.extend({

        tagName: 'div',
        className: 'dataFile',

        events: {
            // 'click .remove-me': 'closeMe',
            'click span.download-file-content': 'downloadFileContentOnClick',
            'click span.delete-file-content': 'deleteFileContentOnClick'
        },

        initialize: function (options) {
            this.template = require("./../../templates/datafile-list.ejs");
            this.collection = options.collection;
            this.datum = options.datum;
        },

        render: function () {
            this.$el.html(this.template({ __: i18n, dataFiles: this.collection.models }));
            this.$queryModal = $(".modal-cnt");
            return this;
        },

        /**
         * @method
         * @name closeMe
         * @description trigger a 'closeMe' for the parent view to get it and close this child
         */
        // closeMe: function(ev) {
        //     this.trigger("closeMe", this);
        // },

        /**
         * @method
         * @name downloadFileContentOnClick
         * @param{} ev
         */
        downloadFileContentOnClick: function (ev) {
            ev.preventDefault();
            var idFile = $(ev.target).data('id');
            console.log("FileManager.Views.Download.downloadFileContent: " + idFile);
            this.downloadFileContent(_.parseInt(idFile));
            return false;
        },

        deleteFileContentOnClick: function (ev) {
            ev.preventDefault();
            var idFile = $(ev.target).data('id');
            console.log("FileManager.Views.Download.downloadFileContent: " + idFile);
            this.deleteFileContent(_.parseInt(idFile));
            return false;
        },

        /**
         * @method
         * @name downloadFileContent
         * @param{Integer} id - the ID of the dataFile on XTENS
         * @description download a file from the remote file storage given its XTENS ID
         * @link http://stackoverflow.com/questions/16086162/handle-file-download-from-ajax-post
         */
        downloadFileContent: function (idFile) {
            var that = this;
            var xhr = new XMLHttpRequest();
            var url = 'fileContent?id=' + idFile;
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';

            xhr.onload = function () {
                var fileName = ""; var disposition; var fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/; var matches; var type; var blob; var windowURL; var downloadURL; var a;
                // response is OK
                if (this.status === 200) {
                    fileName = "";
                    disposition = xhr.getResponseHeader('Content-Disposition');
                    if (disposition && disposition.indexOf('attachment') !== -1) {
                        matches = fileNameRegex.exec(disposition);
                        if (matches != null && matches[1]) {
                            fileName = matches[1].replace(/['"]/g, '');
                        }
                    }
                    type = xhr.getResponseHeader('Content-Type');
                    blob = new Blob([this.response], { type: type });

                    if (typeof window.navigator.msSaveBlob !== 'undefined') {
                        // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created.
                        // These URLs will no longer resolve as the data backing the URL has been freed."
                        window.navigator.msSaveBlob(blob, fileName);
                    } else {
                        windowURL = window.URL || window.webkitURL;
                        downloadURL = windowURL.createObjectURL(blob);

                        if (fileName) {
                            // use HTML5 a[download] attribute to specify filename
                            a = document.createElement("a");
                            if (typeof a.download === 'undefined') {
                                window.location = downloadURL;
                            } else {
                                a.href = downloadURL;
                                a.download = fileName;
                                document.body.appendChild(a);
                                a.click();
                            }
                        } else {
                            window.location = downloadURL;
                        }
                        setTimeout(function () { windowURL.revokeObjectURL(downloadURL); }, 100); // cleanup
                    }
                }
                // response is serverError
                else {
                    console.log("DataFile.Views.List - downloadFileContent: could not download file");
                    that.modal = new ModalDialog({
                        title: i18n('could-not-download-file'),
                        body: xhr.statusText,
                        type: "delete"
                    });
                    that.$queryModal.append(that.modal.render().el);
                    that.modal.show();
                }
            };

            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader('Authorization', 'Bearer ' + xtens.session.get("accessToken"));
            xhr.send();
        },

        /**
         * @method
         * @name deleteFileContent
         * @param{Integer} id - the ID of the dataFile on XTENS
         * @description delete a file from the remote file storage given its XTENS ID
         * @link http://stackoverflow.com/questions/16086162/handle-file-delete-from-ajax-post
         */
        deleteFileContent: function (idFile) {
            var that = this;
            var url = 'fileContent?id=' + idFile;
            $.ajax({
                url: 'fileContent?file=' + idFile + '&id=' + this.datum,
                type: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + xtens.session.get("accessToken")
                },
                contentType: 'application/json',
                success: function () {
                    that.trigger("fileDeleted", { dataId: this.datum });
                    $('body').notify({
                        message: i18n('file-correctly-deleted')
                    }, {
                        type: 'success'
                    });
                },
                error: function (err) {
                    xtens.error(err);
                }
            });
        }

    });
}(xtens, require('./DataFile.js')));
