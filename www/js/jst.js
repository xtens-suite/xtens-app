this["JST"] = this["JST"] || {};

this["JST"]["views/templates/address-modal.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="modal fade">\n    <div class="modal-dialog">\n        <div class="modal-content">\n\n            <div class="modal-header">\n                <h4 class="modal-title">' +
((__t = (__('contact-information') )) == null ? '' : __t) +
'</h4>\n            </div>\n\n            <div class="modal-body">\n              <div class="form-group metadataform-group">\n                  <label for="birthDate" class="data-label">' +
((__t = ( __('project') )) == null ? '' : __t) +
'</label>\n                  <div class="data-input-div">\n                      <span class="form-control" id="birthDate" name="birthDate" placeholder="' +
((__t = ( __('please-select') )) == null ? '' : __t) +
'" >' +
((__t = ( project.name )) == null ? '' : __t) +
'</span>\n                  </div>\n              </div>\n              <div class="form-group metadataform-group">\n                  <label for="firstName" class="data-label">' +
((__t = ( __('given-name') )) == null ? '' : __t) +
'</label>\n                  <div class="data-input-div">\n                      <span class="form-control" id="firstName" placeholder="Name" name="firstName" >' +
((__t = ( owner.firstName )) == null ? '' : __t) +
'</span>\n                  </div>\n              </div>\n              <div class="form-group metadataform-group">\n                  <label for="lastName" class="data-label">' +
((__t = ( __('surname') )) == null ? '' : __t) +
'</label>\n                  <div class="data-input-div">\n                      <span class="form-control" id="lastName" placeholder="Surname" name="lastName" >' +
((__t = ( owner.lastName )) == null ? '' : __t) +
'</span>\n                  </div>\n              </div>\n              <div class="form-group metadataform-group">\n                  <label for="birthDate" class="data-label">' +
((__t = ( __('office') )) == null ? '' : __t) +
'</label>\n                  <div class="data-input-div">\n                      <span class="form-control" id="birthDate" name="birthDate" placeholder="' +
((__t = ( __('please-select') )) == null ? '' : __t) +
'" >' +
((__t = ( address.office )) == null ? '' : __t) +
'</span>\n                  </div>\n              </div>\n              <div class="form-group metadataform-group">\n                  <label for="email" class="data-label">' +
((__t = ( __('email') )) == null ? '' : __t) +
'</label>\n                  <div class="data-input-div">\n                      <span name="email" type="email" class="form-control" id="email" placeholder="ex@example.com">' +
((__t = ( owner.email )) == null ? '' : __t) +
'</span>\n                  </div>\n              </div>\n              <div class="form-group metadataform-group">\n                  <label for="login" class="data-label">' +
((__t = ( __('phone') )) == null ? '' : __t) +
'</label>\n                  <div class="data-input-div">\n                      <span class="form-control" id="login" name="login" placeholder="Username" >' +
((__t = ( address.phone )) == null ? '' : __t) +
'</span>\n                  </div>\n              </div>\n            </div>\n\n            <div class="modal-footer">\n                <button type="button" class="btn btn-default" data-dismiss="modal">' +
((__t = ( __('close') )) == null ? '' : __t) +
'</button>\n            </div>\n\n        </div>\n    </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/addressinformation-edit.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h4>' +
((__t = ( __('address-information') )) == null ? '' : __t) +
'</h4>\n<div class="form-group metadataform-group">\n    <label for="office" class="operator-label">' +
((__t = ( __('office') )) == null ? '' : __t) +
'</label>\n    <div class="operator-halfinput-div">\n        <input text class="form-control" id="office" name="office" required data-parsley-pattern="[a-zA-Z]+"></input>\n    </div>\n    <label for="phone" class="operator-label">' +
((__t = ( __('phone') )) == null ? '' : __t) +
'</label>\n    <div class="operator-halfinput-div">\n        <input text class="form-control" id="phone" name="phone" required></input>\n    </div>\n</div>\n<div class="form-group metadataform-group">\n    <label for="address" class="operator-label">' +
((__t = ( __('address') )) == null ? '' : __t) +
'</label>\n    <div class="operator-input-div">\n        <input text class="form-control" id="address" name="address" required></input>\n    </div>\n</div>\n<div class="form-group metadataform-group">\n    <label for="zip" class="operator-label">' +
((__t = ( __('zip') )) == null ? '' : __t) +
'</label>\n    <div class="operator-thirdinput-div">\n        <input text class="form-control" id="zip" name="zip" required></input>\n    </div>\n    <label for="city" class="operator-label">' +
((__t = ( __('city') )) == null ? '' : __t) +
'</label>\n    <div class="operator-thirdinput-div">\n        <input text class="form-control" id="city" name="city" required data-parsley-pattern="[a-zA-Z]+"></input>\n    </div>\n    <label for="country" class="operator-label">' +
((__t = ( __('country') )) == null ? '' : __t) +
'</label>\n    <div class="operator-thirdinput-div">\n        <input text class="form-control" id="country" name="country" required data-parsley-length="[2,2]" data-parsley-pattern="[a-zA-Z]+"></input>\n    </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/association.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div id="adminAssociation">\n  <style>\n    #associated {\n      width: 400px;\n      max-height: 400px;\n      overflow: auto;\n      min-height: 94px;\n      padding: 10px;\n      border: 5px solid #aaaaaa;\n      border-radius: 10px;\n      height: inherit;\n    }\n\n    #noassociated {\n      width: 400px;\n      max-height: 400px;\n      overflow: auto;\n      min-height: 94px;\n      padding: 15px;\n      border: 5px solid #aaaaaa;\n      border-radius: 10px;\n      height: inherit;\n    }\n\n    div.nondominant {\n      width: 200px;\n      height: 40px;\n      padding: 5px;\n      border: 3px solid #aaaaaa;\n      border-radius: 10px;\n      text-align: center;\n      line-height: 25px;\n    }\n  </style>\n  <form name="Myform" class="form-horizontal association-form" role="form">\n\n    <h2 class="legend" align="center">' +
((__t = ( dominant.urlRoot.slice(1).charAt(0).toUpperCase()+dominant.urlRoot.slice(1).slice(1)+" "+dominant.get('name').charAt(0).toUpperCase()+dominant.get('name').slice(1) )) == null ? '' : __t) +
'</h2>\n\n\n    <div class="form-group row">\n      <div id="labelA" class="col-md-6 text-center">\n        <p> <label for="associated" class="control-label" id="label">' +
((__t = ( __("associated")+" "+nondominantName.charAt(0).toUpperCase()+nondominantName.slice(1) )) == null ? '' : __t) +
'</label></p>\n      </div>\n      <div id="labelB" class="col-md-6 text-center">\n        <p> <label for="noassociated" id="label" class="control-label">' +
((__t = ( __("no-associated")+" "+nondominantName.charAt(0).toUpperCase()+nondominantName.slice(1) )) == null ? '' : __t) +
'</label></p>\n      </div>\n    </div>\n\n    <div class="form-group row">\n\n      <div id="associated" class="col-md-5 col-md-offset-1 Table">\n        <div id="lista" class="col-md-6 col-md-offset-3">\n          ';
 if (dominant.get(nondominantName).length !=0) {;
__p += '\n            ';
 var a = new Array();
                    var dati = new Array();
                    for(var g = 0;g<dominant.get(nondominantName).length;g++){
                        a[g]=dominant.get(nondominantName)[g][field];
                        }
                        ;
__p += '\n              ';
 for(var j =0;j<nondominants.length;j++)  {
                        dati[j]= nondominants[j][field];
                        } ;
__p += '\n                ';
 var c =_.intersection(dati,a) ;
__p += '\n                  ';
 for (var i=0;i<c.length;i++) { ;
__p += '\n                    ';
 for(var l=0;l<nondominants.length;l++){ ;
__p += '\n                      ';
 if (c[i]==nondominants[l][field]) {;
__p += '\n\n                        <div class="form-group row">\n                          <div class="nondominant" draggable="true" id="' +
((__t = ( (nondominants[l].id) )) == null ? '' : __t) +
'" value="' +
((__t = ( c[i] )) == null ? '' : __t) +
'">\n                            ' +
((__t = ( c[i] )) == null ? '' : __t) +
'\n                          </div>\n                        </div>\n                        ';
 } ;
__p += '\n                          ';
 } ;
__p += '\n                            ';
 } ;
__p += '\n                              ';
 } ;
__p += '\n        </div>\n      </div>\n\n      <div id="noassociated" class="col-md-4 col-md-offset-2 Table">\n        <div id="noass" class="col-md-6 col-md-offset-3">\n          ';
 if (dominant.get(nondominantName).length ==0) {;
__p += '\n            ';
 var a = new Array();}
                        else{ var a = new Array();
                        for(var g = 0;g<dominant.get(nondominantName).length;g++){
                            a[g]=dominant.get(nondominantName)[g][field];
                            }
                            } var dati = new Array(); ;
__p += '\n              ';
 for(var j =0;j<nondominants.length;j++)  {
                            dati[j]= nondominants[j][field];
                            } ;
__p += '\n                ';
 var b = _.difference(dati,a); ;
__p += '\n                  ';
 for (var i=0;i<b.length;i++) { ;
__p += '\n                    ';
 for(var l=0;l<nondominants.length;l++){ ;
__p += '\n                      ';
 if (b[i]==nondominants[l][field]) {;
__p += '\n                        <div class="form-group row">\n                          <div class="nondominant" draggable="true" id="' +
((__t = ( (nondominants[l].id)  )) == null ? '' : __t) +
'" value="' +
((__t = ( b[i])) == null ? '' : __t) +
'">\n                            ' +
((__t = ( b[i])) == null ? '' : __t) +
'\n                          </div>\n                        </div>\n                        ';
 } ;
__p += '\n                          ';
 } ;
__p += '\n                            ';
 } ;
__p += '\n        </div>\n      </div>\n    </div>\n\n  </form>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/biobank-edit.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h1>' +
((__t = ( __("biobank-manager") )) == null ? '' : __t) +
'</h1>\n<h2>' +
((__t = ( biobank.id ? __("update-biobank") : __("create-biobank") )) == null ? '' : __t) +
'</h2>\n\n<div id="content">\n\n    <form id="biobank-form" class="form-horizontal edit-biobank-form" role="form" data-parsley-trigger="focusout" data-parsley-validate>\n        <div class="form-group biobankform-group">\n            <label for="biobankID" class="biobank-label">' +
((__t = ( __('biobank-ID') )) == null ? '' : __t) +
'</label>\n            <div class="biobank-halfinput-div">\n                <input text class="form-control" id="biobankID" name="biobankID" required></input>\n            </div>\n            <label for="acronym" class="biobank-label">' +
((__t = ( __('biobank-acronym') )) == null ? '' : __t) +
'</label>\n            <div class="biobank-halfinput-div">\n                <input text class="form-control" id="acronym" name="acronym" required></input>\n            </div>\n        </div>\n        <div class="form-group biobankform-group">\n            <label for="name" class="biobank-label">' +
((__t = ( __('biobank-name') )) == null ? '' : __t) +
'</label>\n            <div class="biobank-halfinput-div">\n                <input text class="form-control" id="name" name="name" required></input>\n            </div>\n            <label for="url" class="biobank-label">' +
((__t = ( __('biobank-url') )) == null ? '' : __t) +
'</label>\n            <div class="biobank-halfinput-div">\n                <input text class="form-control" id="url" name="url" data-parsley-type="url"></input>\n            </div>\n        </div>\n        <div class="form-group biobankform-group">\n            <label for="juristicPerson" class="biobank-label">' +
((__t = ( __('juristic-person') )) == null ? '' : __t) +
'</label>\n            <div class="biobank-halfinput-div">\n                <input required text class="form-control" id="juristicPerson" name="juristicPerson"></input>\n            </div>\n            <label for="country" class="biobank-label">' +
((__t = ( __('country') )) == null ? '' : __t) +
'</label>\n            <div class="biobank-halfinput-div">\n                <input text class="form-control" id="country" name="country" required\n                data-parsley-pattern="[a-zA-Z]+" data-parsley-length="[2,2]"></input>\n            </div>\n        </div>\n        <div class="form-group biobankform-group">\n            <label for="description" class="biobank-label">' +
((__t = ( __('description') )) == null ? '' : __t) +
'</label>\n            <div class="biobank-input-div">\n                <input text class="form-control" id="description" name="description"></input>\n            </div>\n        </div>\n        <div id="contact-information-cnt"></div>\n        <div id="buttonbardiv" class="row text-center">\n            <div class="btn-group btn-group-margin">\n                <input type="submit" class="btn btn-primary" value="' +
((__t = (__('save-biobank') )) == null ? '' : __t) +
'" >\n                ';
 if (biobank.id) { ;
__p += '\n                <input type="hidden" id="id" name="id" value="' +
((__t = ( biobank.id )) == null ? '' : __t) +
'" />\n                <button data-biobank-id="' +
((__t = ( biobank.id )) == null ? '' : __t) +
'" class="btn btn-danger delete">' +
((__t = ( __("delete") )) == null ? '' : __t) +
'</button>\n                ';
} ;
__p += '\n            </div>\n        </div>\n    </form>\n</div> <!-- content -->\n<div class="biobank-modal"></div>\n';

}
return __p
};

this["JST"]["views/templates/biobank-list.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2>' +
((__t = ( __("biobanks") )) == null ? '' : __t) +
'</h2>\n\n<div id="content">\n    <div class="row">\n        <div class="col-sm-12">\n            <div class="table-container">\n                <table class="table">\n                    <thead>\n                        <tr>\n                            <th>' +
((__t = ( __("biobank-ID") )) == null ? '' : __t) +
'</th>\n                            <th>' +
((__t = ( __("biobank-name") )) == null ? '' : __t) +
'</th>\n                            <th>' +
((__t = ( __("biobank-acronym") )) == null ? '' : __t) +
'</th>\n                            <th>' +
((__t = ( __("biobank-url") )) == null ? '' : __t) +
'</th>\n                            <th>' +
((__t = ( __("juristic-person") )) == null ? '' : __t) +
'</th>\n                            <th>' +
((__t = ( __("country") )) == null ? '' : __t) +
'</th>\n                            <th></th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                    ';
 _.each(biobanks, function(biobank) { ;
__p += '\n                    <tr>\n                        <td>' +
((__t = ( biobank.get("biobankID") )) == null ? '' : __t) +
'</td>\n                        <td>' +
((__t = ( biobank.get("name") )) == null ? '' : __t) +
'</td>\n                        <td>' +
((__t = ( biobank.get("acronym") )) == null ? '' : __t) +
'</td>\n                        <td>' +
((__t = ( biobank.get("url") )) == null ? '' : __t) +
'</td>\n                        <td>' +
((__t = ( biobank.get("juristicPerson") )) == null ? '' : __t) +
'</td>\n                        <td>' +
((__t = ( biobank.get("country") )) == null ? '' : __t) +
'</td>\n                        <td>\n                          <div class="btn-group btn-group-sm" role="group" style="margin-top:0.5vh;">\n                            <a type="button" class="btn btn-info" href="#/biobanks/edit/' +
((__t = ( biobank.id )) == null ? '' : __t) +
'">' +
((__t = (__("edit") )) == null ? '' : __t) +
'</a>\n                          </div>\n                      </td>\n                    </tr>\n                    ';
 }) ;
__p += '\n                    </tbody>\n                </table>\n            </div>\n            <div id="buttonbardiv" class="row text-center">\n                <a href="#/biobanks/new" class="btn btn-primary">' +
((__t = ( __("new-biobank"))) == null ? '' : __t) +
'</a>\n            </div>\n        </div>\n    </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/confirm-dialog-bootstrap.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- BOOTSTRAP Dialog -->\n<div class="modal fade">\n    <div class="modal-dialog">\n        <div class="modal-content">\n\n            <div class="modal-header">\n                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n                <h4 class="modal-title">' +
((__t = (__('default-title') )) == null ? '' : __t) +
'</h4>\n            </div>\n\n            <div class="modal-body">' +
((__t = (__('default-body') )) == null ? '' : __t) +
'</div>\n\n            <div class="modal-footer">\n                <button type="button" class="btn btn-default" data-dismiss="modal">' +
((__t = ( __('close') )) == null ? '' : __t) +
'</button>\n                <button id="confirm" type="button" class="btn">' +
((__t = ( type ? type : __('confirm') )) == null ? '' : __t) +
'</button>\n            </div>\n\n        </div>\n    </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/confirm-project-selection.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="modal fade">\n  <div class="modal-dialog">\n    <div class="modal-content">\n\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span\n            aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title">' +
((__t = (__('default-title') )) == null ? '' : __t) +
'</h4>\n      </div>\n\n      <div class="modal-body">\n        <div class="row">\n          <div class="col-xs-12">\n            <div class="form-group">\n              <select required data-live-search="true" id=\'project-selector\'\n                title="' +
((__t = ( __("please-select-a-project") )) == null ? '' : __t) +
'" class="form-control selectpicker">\n                ';
 _.each(xtens.session.get("projects"), function(project) {;
__p += '\n                <option data-subtext="' +
((__t = ( project.description )) == null ? '' : __t) +
'" value=\'' +
((__t = ( project.name )) == null ? '' : __t) +
'\'>' +
((__t = ( project.name )) == null ? '' : __t) +
'\n                </option>\n                ';
 }) ;
__p += '\n              </select>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <div class="modal-footer">\n        <button disabled id="confirm-project" type="button" class="btn btn-">' +
((__t = ( __('confirm') )) == null ? '' : __t) +
'</button>\n      </div>\n\n    </div>\n  </div>\n</div>';

}
return __p
};

this["JST"]["views/templates/contactinformation-edit.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h3>' +
((__t = ( __('contact-information') )) == null ? '' : __t) +
'</h3>\n<div class="form-group metadataform-group">\n    <label for="givenName" class="biobank-label">' +
((__t = ( __('given-name') )) == null ? '' : __t) +
'</label>\n    <div class="biobank-halfinput-div">\n        <input text class="form-control" id="givenName" name="givenName" required data-parsley-pattern="[a-zA-Z]+"></input>\n    </div>\n    <label for="surname" class="biobank-label">' +
((__t = ( __('surname') )) == null ? '' : __t) +
'</label>\n    <div class="biobank-halfinput-div">\n        <input text class="form-control" id="surname" name="surname" required data-parsley-pattern="[a-zA-Z]+"></input>\n    </div>\n</div>\n<div class="form-group metadataform-group">\n    <label for="phone" class="biobank-label">' +
((__t = ( __('phone') )) == null ? '' : __t) +
'</label>\n    <div class="biobank-halfinput-div">\n        <input text class="form-control" id="phone" name="phone" required></input>\n    </div>\n    <label for="email" class="biobank-label">' +
((__t = ( __('email') )) == null ? '' : __t) +
'</label>\n    <div class="biobank-halfinput-div">\n        <input type="email" class="form-control" id="email" name="email" required></input>\n    </div>\n</div>\n<div class="form-group metadataform-group">\n    <label for="address" class="biobank-label">' +
((__t = ( __('address') )) == null ? '' : __t) +
'</label>\n    <div class="biobank-input-div">\n        <input text class="form-control" id="address" name="address" required></input>\n    </div>\n</div>\n<div class="form-group metadataform-group">\n    <label for="zip" class="biobank-label">' +
((__t = ( __('zip') )) == null ? '' : __t) +
'</label>\n    <div class="biobank-thirdinput-div">\n        <input text class="form-control" id="zip" name="zip" required></input>\n    </div>\n    <label for="city" class="biobank-label">' +
((__t = ( __('city') )) == null ? '' : __t) +
'</label>\n    <div class="biobank-thirdinput-div">\n        <input text class="form-control" id="city" name="city" required data-parsley-pattern="[a-zA-Z]+"></input>\n    </div>\n    <label for="country" class="biobank-label">' +
((__t = ( __('country') )) == null ? '' : __t) +
'</label>\n    <div class="biobank-thirdinput-div">\n        <input text class="form-control" id="country" name="country" required data-parsley-length="[2,2]" data-parsley-pattern="[a-zA-Z]+"></input>\n    </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/dashboard-bargraph.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<style>\ndiv.tooltip {\t\n    position: absolute;\t\t\t\n    text-align: center;\t\t\t\n    width: 60px;\t\t\t\t\t\n    height: 28px;\t\t\t\t\t\n    padding: 2px;\t\t\t\t\n    font: 12px sans-serif;\t\t\n    background: lightsteelblue;\t\n    border: 0px;\t\t\n    border-radius: 8px;\t\t\t\n    pointer-events: none;\t\t\t\n}\n</style>\n<div id="content" style="padding:1vh">\n  <p>' +
((__t = (title)) == null ? '' : __t) +
'</p>\n  <div class="row">\n    <div class="col-md-4">\n      <label for="project-source">' +
((__t = (__('data-type') )) == null ? '' : __t) +
'</label>\n    </div>\n    <div class="col-md-4">\n      <label for="project-source">' +
((__t = (__('field') )) == null ? '' : __t) +
'</label>\n    </div>\n    <div class="col-md-4">\n        <label for="project-source">' +
((__t = (__('period') )) == null ? '' : __t) +
'</label>\n    </div>\n  </div>\n  <div class="row">\n    <div class="col-md-4">\n      <div class="form-group">\n        <select required id=\'dt-sel\' class="form-control selectpicker">\n            ';
 _.each(dataTypes, function(dt) {;
__p += '\n              <option value=\'' +
((__t = ( dt.id )) == null ? '' : __t) +
'\'>' +
((__t = ( dt.name )) == null ? '' : __t) +
'</option>\n            ';
 }) ;
__p += '\n        </select>\n      </div>\n    </div>\n    <div class="col-md-4">\n        <div class="form-group">\n          <select required id=\'field-sel\' class="form-control selectpicker">\n              <option value=\'created_at\'>Creation Date</option>\n              ';
 _.each(fields, function(field) {;
__p += '\n                <option value=\'' +
((__t = ( field.formattedName )) == null ? '' : __t) +
'\'>' +
((__t = ( field.name )) == null ? '' : __t) +
'</option>\n              ';
 }) ;
__p += '\n          </select>\n        </div>\n      </div>\n      <div class="col-md-4">\n        <div class="form-group">\n          <select required id=\'period-sel\' class="form-control selectpicker">\n              ';
 _.each(periods, function(period) {;
__p += '\n                <option value=\'' +
((__t = ( period.value )) == null ? '' : __t) +
'\'>' +
((__t = ( period.name )) == null ? '' : __t) +
'</option>\n              ';
 }) ;
__p += '\n          </select>\n        </div>\n      </div>\n    </div>\n  <div class="row">\n    <div class="col-md-12 graph-cnt" style="text-align:center;">\n    </div>\n  </div>\n';

}
return __p
};

this["JST"]["views/templates/dashboard-graph.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<style>\n    div.tooltip {\t\n        position: absolute;\t\t\t\n        text-align: center;\t\t\t\n        width: 60px;\t\t\t\t\t\n        height: 28px;\t\t\t\t\t\n        padding: 2px;\t\t\t\t\n        font: 12px sans-serif;\t\t\n        background: lightsteelblue;\t\n        border: 0px;\t\t\n        border-radius: 8px;\t\t\t\n        pointer-events: none;\t\t\t\n    }\n</style>\n<div id="content" style="padding:1vh">\n  <p>' +
((__t = (title)) == null ? '' : __t) +
'</p>\n  <div class="row">\n    <div class="col-md-12 graph-cnt" style="text-align:center;">\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/dashboard-home.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<style>\n    .form-group {\n        margin-bottom: 0px !important;\n    }\n</style>\n\n<div id="dashboard-content" style="margin-top:2vh;margin-bottom:2vh;">\n    <div class="row" style="text-align:center;">\n        <div class="col-md-2 vcenter">\n            <label for="subject-selector" class="text-uppercase">' +
((__t = ( __("subject-dashboard") )) == null ? '' : __t) +
':</label>\n        </div>\n        <div class="col-md-5 vcenter">\n            <select id=\'subject-selector\' title="' +
((__t = ( __("select-a-patient") )) == null ? '' : __t) +
'" class="form-group selectpicker"\n                data-live-search="true" data-width="100%">\n                ';
 _.each(subjects, function(subject) {
                var label = subject.givenName && subject.surname ? subject.surname + " " + subject.givenName + " - " + subject.code : subject.code; ;
__p += '\n                <option value=\'' +
((__t = ( subject.id )) == null ? '' : __t) +
'\'>' +
((__t = ( label )) == null ? '' : __t) +
'</option>\n                ';
 }) ;
__p += '\n            </select>\n        </div>\n    </div>\n</div>';

}
return __p
};

this["JST"]["views/templates/data-details.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h1>\n    ' +
((__t = ( __("data-details") )) == null ? '' : __t) +
'\n</h1>\n\n<div id="content">\n    <div class="container data-header-cnt">\n        <div id="data-header-row" class="row data-header-row">\n            <div id="data-header" class="col-md-offset-2 col-md-6">\n                <div class="row margin-row">\n                    ';
 if (data.get("parentSubject") && data.get("parentSubject").length > 0) {;
__p += '\n                    <label for="parentSubject" class="data-label">\n                        ' +
((__t = ( data.get("parentSubject").length === 1 ? __("subject") : __("subjects")  )) == null ? '' : __t) +
': </label>\n                    <span class="data-span">\n                        ' +
((__t = ( _.map(data.get("parentSubject"), "code").join(",") )) == null ? '' : __t) +
'\n                    </span>\n                    ';
} ;
__p += '\n                    ';
 if (data.get("parentSample") && data.get("parentSample").length > 0) {;
__p += '\n                    <label for="parentSample" class="data-label">\n                        ' +
((__t = ( data.get("parentSample").length === 1 ?  __("sample") :  __("samples") )) == null ? '' : __t) +
': </label>\n                    <span class="data-span">\n                        ' +
((__t = ( _.map(data.get("parentSample"), "biobankCode").join(",") )) == null ? '' : __t) +
'\n                    </span>\n                    ';
} ;
__p += '\n                </div>\n                <div class="row margin-row">\n                    <label for="dataType" class="data-label">\n                        ' +
((__t = ( __("data-type") )) == null ? '' : __t) +
'\n                    </label>\n                    <div class="data-input-div">\n                        <div class="" id="dataType" name="dataType">\n                            ' +
((__t = ( data.get("type").name )) == null ? '' : __t) +
'\n                        </div>\n                    </div>\n                </div>\n                <div class="row margin-row">\n                    <label for="date" class="data-label">\n                        ' +
((__t = ( __('date') )) == null ? '' : __t) +
'\n                    </label>\n                    <div class="data-input-div">\n                        <div text class="" id="date" name="date"></div>\n                    </div>\n                </div>\n                <div class="row margin-row">\n                    <label for="tags" class="data-label">\n                        ' +
((__t = ( __('tags') )) == null ? '' : __t) +
'\n                    </label>\n                    <div class="data-input-div">\n                        <div type="hidden" class="" id="tags" name="tags"></div>\n                    </div>\n                </div>\n                <div class="row margin-row">\n                    <label for="notes" class="data-label">\n                        ' +
((__t = ( __('notes') )) == null ? '' : __t) +
'\n                    </label>\n                    <div class="data-input-div">\n                        <div class="" id="notes" name="notes" rows="4"></div>\n                    </div>\n                </div>\n            </div>\n            <div id="file-header" class="col-md-4">\n                ';
 var files = data.get("files"); ;
__p += '\n                ';
 if (files.length) { ;
__p += '\n                <h4>\n                    ' +
((__t = (__("file-list"))) == null ? '' : __t) +
'\n                </h4>\n                ';
 _.each(files, function(file) {;
__p += '\n                <div class="input-group margin-bottom-sm">\n                    <span class="input-group-addon"><i class="fa fa-file"></i></span>\n                    <div class="form-control" type="text">\n                        ';
 var fileFragments = file.uri.split(PATH_SEPARATOR); ;
__p += '\n                        ' +
((__t = ( fileFragments[fileFragments.length - 1 ] )) == null ? '' : __t) +
'\n                    </div>\n                </div>\n                ';
});
                };
__p += '\n            </div>\n        </div>\n    </div>\n    <div id="metadata-schema" class="metadata-schema">\n        <div id="metadata-body" class="metadata-body">\n            ';
 var metadata = data.get("metadata"), value, values, unit;
            var fieldsGroups = _.groupBy(fields, '_group');
            _.forEach(fieldsGroups, function(fields, groupName) {;
__p += '\n            <div class="metadatagroup span7 center">\n                <h4 class="metadatagroup-header text-uppercase">\n                    ' +
((__t = ( groupName )) == null ? '' : __t) +
'\n                </h4>\n                <div class="metadatacomponent-body">\n                    ';
 
                    var loopsGroups = _.groupBy(fields, '_loop');
                    if (loopsGroups['undefined'] && loopsGroups['undefined'].length > 0) { 
                    _.each(loopsGroups['undefined'], function(field,index) {;
__p += '\n                    <!--\n      ';
 var groupname = field._group ;
__p += '\n        -->\n\n                    ';
 if (!field.sensitive || xtens.session.get('canAccessSensitiveData') ) {;
__p += '\n                    <div class="row margin-row">\n                        <span name="metadata-name" class="col-md-4 text-right" style="padding-left:29px">\n                            ' +
((__t = (field.name)) == null ? '' : __t) +
'\n                        </span>\n                        <div class="col-md-5 text-left">\n\n                            ';
 value =  metadata[field.formattedName] ? metadata[field.formattedName].value : null;
                            if (field.fieldType==="Date" && value != null){value=moment(value).lang("it").format('L');}
                            unit = metadata[field.formattedName] ? metadata[field.formattedName].unit : null; ;
__p += '\n                            <div name="metadata-value" class="data-value">\n                                ' +
((__t = ( value && unit ? value + " [" + unit + "]" :
                                value ? value : "" )) == null ? '' : __t) +
'\n                            </div>\n                        </div>\n                    </div>\n                    ';
}});;
__p += '\n                </div>\n            </div>\n            ';

        } 
        if (loopsGroups['true'] && loopsGroups['true'].length > 0) {
            var maxLoopNumber = _.max(_.map(_.filter(metadata, function(m) {return m.group == groupName && m.loop; }), function (a) {return a.values ? a.values.length : 0})) 
            maxLoopNumber = maxLoopNumber > 0 ? maxLoopNumber : 1;
            for (let index = 1; index <= maxLoopNumber; index++) {;
__p += '\n\n            <div class="metadatagroup span7 center">\n                ';
var loopGroupName = _.filter(metadata, function(m) {return m.group == groupName && m.loop; })
                        if(loopGroupName.length > 0) {;
__p += '\n                <h4 class="metadatagroup-header text-uppercase">\n                    ' +
((__t = ( _.filter(metadata, function(m) {return m.group == groupName && m.loop; })[0].loop )) == null ? '' : __t) +
'\n                    #' +
((__t = (index )) == null ? '' : __t) +
'\n                </h4>\n                <div class="metadatacomponent-body">\n                    ';
};
__p += '\n\n                            ';


                            _.each(loopsGroups['true'], function(field) {;
__p += '\n                    <!--\n                  ';
 var groupname = field._group ;
__p += '\n                    -->\n\n                    ';
 if (!field.sensitive || xtens.session.get('canAccessSensitiveData') ) {;
__p += '\n                    <div class="row margin-row">\n                        <span name="metadata-name" class="col-md-4 text-right" style="padding-left:29px">\n                            ' +
((__t = (field.name)) == null ? '' : __t) +
'\n                        </span>\n                        <div class="col-md-5 text-left">\n\n                            ';
 values = metadata[field.formattedName] ? metadata[field.formattedName].values : null;;
__p += '\n                            <div name="metadata-value" class="data-value">\n                                ' +
((__t = ( values && values[index-1] ? values[index-1] : null )) == null ? '' : __t) +
'\n                            </div>\n                        </div>\n                    </div>\n                    ';
}
                            });
                            if(loopGroupName.length > 0) {;
__p += '\n                </div>\n                ';
};
__p += '\n                    </div>\n\n                    ';
  }}
                            });;
__p += '\n            </div>\n        </div>\n    </div>';

}
return __p
};

this["JST"]["views/templates/data-edit-partial.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div id="metadata-body" class="metadatacomponent-body"></div>\n';

}
return __p
};

this["JST"]["views/templates/data-edit.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h1>' +
((__t = ( __("data-manager") )) == null ? '' : __t) +
'</h1>\n<h2>' +
((__t = ( data.id ? __("update-data") : __("create-data") )) == null ? '' : __t) +
'</h2>\n<div id="content">\n    <form class="form-horizontal edit-data-form" role="form" data-parsley-focus="first" data-parsley-trigger="focusout" data-parsley-validate>\n        <div class="container data-header-cnt">\n            <div id="data-header-row" class="row data-header-row">\n                <div id="data-header" class="data-header-col">\n                    <div class="form-group">\n                        ';
 if (data.get("parentSubject") && data.get("parentSubject").length > 0) {;
__p += '\n                        <label for="parentSubject" class="data-label">' +
((__t = ( data.get("parentSubject").length === 1 ? __("subject") : __("subjects")  )) == null ? '' : __t) +
': </label>\n                        <span class="data-span">' +
((__t = ( _.map(data.get("parentSubject"), "code").join(",") )) == null ? '' : __t) +
'</span>\n                        ';
} ;
__p += '\n                        ';
 if (data.get("parentSample") && data.get("parentSample").length > 0) {;
__p += '\n                        <label for="parentSample" class="data-label">' +
((__t = ( data.get("parentSample").length === 1 ?  __("sample") :  __("samples") )) == null ? '' : __t) +
': </label>\n                        <span class="data-span">' +
((__t = ( _.map(data.get("parentSample"), "biobankCode").join(",") )) == null ? '' : __t) +
'</span>\n                        ';
} ;
__p += '\n                    </div>\n                    <div class="form-group">\n                        <label for="data-type" class="data-label">' +
((__t = ( __("select-a-data-type") )) == null ? '' : __t) +
'</label>\n                        <div class="data-input-div">\n                            <select class="form-control" id="data-type" name="data-type" required></select>\n                        </div>\n                        <label for="owner" class="col-md-2 data-label">' +
((__t = ( __("owner") )) == null ? '' : __t) +
'</label>\n                        <div class="data-input-div">\n                            <select disabled class="form-control" id="owner" name="owner" required></select>\n                        </div>\n                    </div>\n                    <div class="form-group metadataform-group">\n                        <label for="date" class="data-label">' +
((__t = ( __('date') )) == null ? '' : __t) +
'</label>\n                        <div class="data-input-div">\n                            <input text class="form-control" id="date" name="date" placeholder="' +
((__t = ( __('please-select') )) == null ? '' : __t) +
'" ></input>\n                        </div>\n                    </div>\n                    <div class="form-group metadataform-group">\n                        <label for="tags" class="data-label">' +
((__t = ( __('tags') )) == null ? '' : __t) +
'</label>\n                        <div class="data-input-div">\n                            <input type="hidden" class="form-control" id="tags" name="tags"></input>\n                        </div>\n                    </div>\n                    <div class="form-group metadataform-group">\n                        <label for="notes" class="data-label">' +
((__t = ( __('notes') )) == null ? '' : __t) +
'</label>\n                        <div class="data-input-div">\n                            <textarea class="form-control" id="notes" name="notes" rows="4"></textarea>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div id="buttonbardiv" class="row text-center">\n            <div class="btn-group btn-group-margin">\n                <input type="submit" id="save" class="btn btn-primary" value="' +
((__t = (__('save') )) == null ? '' : __t) +
'" >\n                ';
 if (data.id) { ;
__p += '\n                    <input type="hidden" id="id" name="id" value="' +
((__t = ( data.id )) == null ? '' : __t) +
'" />\n                    <button data-data-id="' +
((__t = ( data.id )) == null ? '' : __t) +
'" class="btn btn-danger delete">' +
((__t = ( __("delete") )) == null ? '' : __t) +
'</button>\n                ';
} ;
__p += '\n            </div>\n        </div>\n    </form>\n</div>\n<div class="data-modal"></div>\n';

}
return __p
};

this["JST"]["views/templates/data-list.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2>' +
((__t = ( __("data-list") )) == null ? '' : __t) +
'</h2>\n\n<div id="content">\n    <div class="row">\n        <div class="col-sm-12">\n            <div class="table-responsive">\n                <table class="table">\n                    <thead>\n                        <tr>\n                            <th>' +
((__t = ( __("type") )) == null ? '' : __t) +
'</th>\n                            <th>' +
((__t = ( __("date") )) == null ? '' : __t) +
'</th>\n                            <th>' +
((__t = ( __("tags") )) == null ? '' : __t) +
'</th>\n                            <!--\n                            <th>' +
((__t = ( __("metadata") )) == null ? '' : __t) +
'</th>\n                            -->\n                            <th>' +
((__t = ( __("notes") )) == null ? '' : __t) +
'</th>\n                            <th style="display:none;">' +
((__t = ( __("project") )) == null ? '' : __t) +
'</th>\n                            <th></th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                    ';
 var metadata, date;
                    _.each(data, function(data) {
                      var dataType = _.find(dataTypes, {id : data.get('type')});
                      var dataProject = _.find(xtens.session.get("projects"), {id : dataType.get("project")}); ;
__p += '\n                      <tr class="content">\n                        <td>' +
((__t = ( dataType.get("name") )) == null ? '' : __t) +
'</td>\n                        <td>\n                            ';
 date = data.get("date") ;
__p += '\n                            ' +
((__t = ( date ? moment(date).lang("it").format('L') : '' )) == null ? '' : __t) +
'\n                        </td>\n                        <td>' +
((__t = ( data.get("tags") && data.get("tags").length > 0 ? JSON.stringify(data.get("tags")) : "" )) == null ? '' : __t) +
'</td>\n                        <!--\n                        <td>\n                            <ul>\n                            ';
 metadata = JSON.stringify(data.get("metadata"))
                                _.each(metadata, function(elem, key) { ;
__p += '\n                                <li>' +
((__t = ( key )) == null ? '' : __t) +
' : ' +
((__t = ( elem.value ? elem.value : elem.values ? elem.values.join(",") : '' )) == null ? '' : __t) +
' </li>\n                            ';
    });
                            ;
__p += '\n                            </ul>\n                        </td>\n                        -->\n                        <td>' +
((__t = ( data.get("notes") )) == null ? '' : __t) +
'</td>\n                        <td style="display:none;">' +
((__t = ( dataProject ? dataProject.name : null )) == null ? '' : __t) +
'</td>\n                        <td class="text-right">\n                          <div class="btn-group btn-group-sm" role="group" style="margin-top:0.5vh;">\n                          ';
 var privilege = dataTypePrivileges.find(function(model) {
                            return model.get('dataType') === data.get("type"); });
                           if( privilege && privilege.get("privilegeLevel") !== "view_overview" ){ ;
__p += '\n                            <a type="button" class="btn btn-info" href="' +
((__t = ( data.get("detailsLink") )) == null ? '' : __t) +
'">' +
((__t = (__("data-details") )) == null ? '' : __t) +
'\n                          ';
} ;
__p += '\n                          ';
 if( privilege && privilege.get("privilegeLevel") === "edit" ){ ;
__p += '\n                            <a type="button" class="btn btn-primary" href="' +
((__t = ( data.get("editLink") )) == null ? '' : __t) +
'">' +
((__t = (__("edit") )) == null ? '' : __t) +
'</a>\n                            ';
} ;
__p += '\n                            ';
 if (data.get("newDataLink") && data.get("newDataLink").length > 0) { ;
__p += '\n                            <a type="button" class="btn btn-default" href="' +
((__t = ( data.get("newDataLink") )) == null ? '' : __t) +
'">' +
((__t = (__("new-data") )) == null ? '' : __t) +
'</a>\n                            ';
};
__p += '\n                          </div>\n                        </td>\n                      </tr>\n                    ';
 }) ;
__p += '\n                    </tbody>\n                </table>\n            </div>\n            <div id="pagination" class="row"></div>\n            <div id="buttonbardiv" class="row text-center">\n                <div class="btn-group btn-group-margin">\n                      <a href="" id="newData" class="btn btn-primary">' +
((__t = ( __("new-data"))) == null ? '' : __t) +
'</a>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/data-table.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="table-responsive">\n    <table class="table">\n        <thead>\n            <tr>\n                <th>' +
((__t = ( __("code") )) == null ? '' : __t) +
'</th>\n                <th>' +
((__t = ( __("surname") )) == null ? '' : __t) +
'</th>\n                <th>' +
((__t = ( __("given-name") )) == null ? '' : __t) +
'</th>\n                <th>' +
((__t = ( __("sex") )) == null ? '' : __t) +
'</th>\n                <th>' +
((__t = ( __("overall-status") )) == null ? '' : __t) +
'</th>\n                <th>' +
((__t = ( __("diagnosis-age") )) == null ? '' : __t) +
'</th>\n                <th>' +
((__t = ( __("diagnosis-age-unit"))) == null ? '' : __t) +
'</th>\n            </tr>\n        </thead>\n        <tbody>\n        ';
 _.each(data, function(datum) {;
__p += '\n        ';
 if (datum.type && datum.type.classTemplate === 'Subject') {;
__p += '\n        <tr>\n            <td>' +
((__t = ( datum.code )) == null ? '' : __t) +
'</td>\n            <td>' +
((__t = ( datum.personalInfo.surname )) == null ? '' : __t) +
'</td>\n            <td>' +
((__t = ( datum.personalInfo.givenName )) == null ? '' : __t) +
'</td>\n            <td>' +
((__t = ( datum.personalInfo.sex )) == null ? '' : __t) +
'</td>\n            <td>' +
((__t = ( datum.metadata["Overall Status"] && datum.metadata["Overall Status"].value[0] )) == null ? '' : __t) +
'</td>\n            <td>' +
((__t = ( datum.metadata["Diagnosis Age"] && datum.metadata["Diagnosis Age"].value[0] )) == null ? '' : __t) +
'</td>\n            <td>' +
((__t = ( datum.metadata["Diagnosis Age"] && datum.metadata["Diagnosis Age"].unit[0] )) == null ? '' : __t) +
'</td>\n        </tr>\n        ';
};
__p += '\n        ';
}) ;
__p += '\n        </tbody>\n    </table>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/datafile-list.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h4>\n    ' +
((__t = ( __("file-list") )) == null ? '' : __t) +
'\n    <!-- <a class="remove-me">\n        <span class="fa fa-times-circle"></span>\n    </a> -->\n</h4>\n<div class="row">\n    <div class="col-sm-12">\n        <div class="table-responsive">\n            <table class="table">\n                <thead>\n                    <tr>\n                        <th>' +
((__t = (__("id") )) == null ? '' : __t) +
'</th>\n                        <th>' +
((__t = ( __("name") )) == null ? '' : __t) +
'</th>\n                        <th></th>\n                    </tr>\n                </thead>\n                <tbody>\n                ';
 _.each(dataFiles, function(dataFile) { ;
__p += '\n                <tr>\n                    <td>' +
((__t = ( dataFile.id )) == null ? '' : __t) +
'</td>\n                    <td>' +
((__t = ( dataFile.get("uri").split("/")[dataFile.get("uri").split("/").length-1] )) == null ? '' : __t) +
'</td>\n                    <!-- <td><a href="" class="download-file-content btn " data-id=' +
((__t = ( dataFile.id )) == null ? '' : __t) +
' >' +
((__t = (__("download") )) == null ? '' : __t) +
'</a></td> -->\n                    <td>\n                      <span class="download-file-content input-group-addon btn btn-default" data-id= "' +
((__t = (dataFile.id)) == null ? '' : __t) +
'"><i class="fa fa-download" data-id= "' +
((__t = (dataFile.id)) == null ? '' : __t) +
'"></i></span>\n                      <!-- <span class="delete-file-content input-group-addon btn btn-danger" data-id= "' +
((__t = (dataFile.id)) == null ? '' : __t) +
'"><i class="fa fa-trash" data-id= "' +
((__t = (dataFile.id)) == null ? '' : __t) +
'"></i></span> -->\n                    </td>\n\n                    <!-- <td><a href="" class="delete-file-content btn btn-danger" data-id=' +
((__t = ( dataFile.id )) == null ? '' : __t) +
' >' +
((__t = (__("delete") )) == null ? '' : __t) +
'</a></td> -->\n                </tr>\n                ';
 }) ;
__p += '\n                </tbody>\n            </table>\n        </div>\n    </div>\n</div>\n<div class=\'query-modal\'></div>\n';

}
return __p
};

this["JST"]["views/templates/datatype-duplicate.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="modal fade">\n    <div class="modal-dialog">\n        <div class="modal-content">\n\n            <div class="modal-header">\n                <h4 class="modal-title">' +
((__t = (__('default-title') )) == null ? '' : __t) +
'</h4>\n            </div>\n\n            <div class="modal-body">\n              <div class="row">\n                <div class="col-xs-2">\n                  <label for="project-source">' +
((__t = (__('from') )) == null ? '' : __t) +
'</label>\n                </div>\n                <div class="col-xs-9 col-offset-xs-1">\n                  <div class="form-group">\n                    <select required id=\'project-source\' title="' +
((__t = ( __('please-select-source-project') )) == null ? '' : __t) +
'" class="form-control selectpicker">\n                        ';
 _.each(xtens.session.get("projects"), function(project) {;
__p += '\n                          <option data-subtext="' +
((__t = ( project.description )) == null ? '' : __t) +
'" value=\'' +
((__t = ( project.id )) == null ? '' : __t) +
'\'>' +
((__t = ( project.name )) == null ? '' : __t) +
'</option>\n                        ';
 }) ;
__p += '\n                    </select>\n                  </div>\n                </div>\n              </div>\n              <div class="row">\n                <div class="col-xs-2">\n                  <label hidden for="data-type">' +
((__t = (__('data-type') )) == null ? '' : __t) +
'</label>\n                </div>\n                <div class="col-xs-9 col-offset-xs-1">\n                  <div class="form-group">\n                    <select required id=\'data-type-selector\' title="' +
((__t = ( __('please-select-a-data-type') )) == null ? '' : __t) +
'" class="form-control selectpicker"></select>\n                  </div>\n                </div>\n              </div>\n              <div class="row">\n                <div class="col-xs-2">\n                  <label hidden for="project-dest">' +
((__t = (__('to') )) == null ? '' : __t) +
'</label>\n                </div>\n                <div class="col-xs-9 col-offset-xs-1">\n                  <div class="form-group">\n                    <select required id=\'project-dest\' title="' +
((__t = ( __('please-select-destination-project') )) == null ? '' : __t) +
'" class="form-control selectpicker">\n                        ';
 _.each(xtens.session.get("projects"), function(project) {;
__p += '\n                          <option data-subtext="' +
((__t = ( project.description )) == null ? '' : __t) +
'" value=\'' +
((__t = ( project.id )) == null ? '' : __t) +
'\'>' +
((__t = ( project.name )) == null ? '' : __t) +
'</option>\n                        ';
 }) ;
__p += '\n                    </select>\n                  </div>\n                </div>\n              </div>\n\n            </div>\n\n            <div class="modal-footer">\n                <button disabled id="confirm-duplication" type="button" class="btn btn-">' +
((__t = ( __('edit-data-type') )) == null ? '' : __t) +
'</button>\n            </div>\n\n        </div>\n    </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/datatype-edit.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h1>' +
((__t = ( __("data-type-manager") )) == null ? '' : __t) +
'</h1>\n<h2>' +
((__t = ( dataType.id ? __("update-data-type") : __("create-data-type") )) == null ? '' : __t) +
'</h2>\n\n<div id="content">\n\n  <form class="form-horizontal edit-datatype-form" role="form" data-parsley-trigger="focusout" data-parsley-validate>\n    <div id="schemaHeader">\n      <div class="form-group row">\n        <label for="name" class="col-md-2 control-label">' +
((__t = ( __("name") )) == null ? '' : __t) +
'</label>\n        <div class="col-md-6">\n          <input text class="form-control" id="name" name="name" value="' +
((__t = ( dataType.id ? dataType.get('name') : '' )) == null ? '' : __t) +
'" placeholder="' +
((__t = ( __('data-type-name'))) == null ? '' : __t) +
'" required>\n        </div>\n        <label for="fileUpload" class="col-md-2 control-label">' +
((__t = ( __("file-upload") )) == null ? '' : __t) +
'</label>\n        <div class="col-md-2">\n          <input type="checkbox" id="fileUpload" name="fileUpload" value="fileUpload" ';
 if(dataType.id && dataType.get( 'superType').schema.header.fileUpload) { ;
__p += ' checked="checked"\n          ';
 } ;
__p += ' >\n        </div>\n      </div>\n      <div class="form-group row">\n        <label for="model" class="col-md-2 control-label">' +
((__t = ( __("model") )) == null ? '' : __t) +
'</label>\n        <div class="col-md-3">\n          <select required class="form-control" id="model" name="model" placeholder="' +
((__t = ( __('please-select'))) == null ? '' : __t) +
'"></select>\n        </div>\n        <div class="biobankPrefix-container" hidden>\n          <label for="biobankPrefix" class="col-md-3 control-label">' +
((__t = ( __("biobank-prefix") )) == null ? '' : __t) +
'</label>\n          <div class="col-md-3">\n            <div class="input-group">\n              <input text class="form-control" id="biobankPrefix" name="biobankPrefix" placeholder="' +
((__t = ( __('please-insert'))) == null ? '' : __t) +
'"></input>\n              <span class="input-group-addon">\n                  <input type="checkbox" id="getParentCode" data-toggle="tooltip" title="' +
((__t = ( __('get-parent-code'))) == null ? '' : __t) +
'">\n              </span>\n              <span style="display:none;" class="input-group-addon noparent-container">\n                  <input  type="checkbox" id="ifParentNoPrefix" data-toggle="tooltip" title="' +
((__t = ( __('no-parent-prefix'))) == null ? '' : __t) +
'">\n              </span>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class="form-group row">\n        <label for="project" class="col-md-2 control-label">' +
((__t = ( __("project") )) == null ? '' : __t) +
'</label>\n        <div class="col-md-4">\n          <select class="form-control" id="project" name="project" required></select>\n        </div>\n        <label for="parent" class="col-md-2 control-label">' +
((__t = ( __("parent") )) == null ? '' : __t) +
'</label>\n        <div class="col-md-3">\n          <select multiple class="form-control" id="parents" name="parents"></select>\n        </div>\n      </div>\n      <div class="form-group row">\n        <label for="description" class="col-md-2 control-label">' +
((__t = (__("description") )) == null ? '' : __t) +
'</label>\n        <div class="col-md-9">\n          <input text class="form-control" id="description" name="description" required value="' +
((__t = ( dataType.id ? dataType.get('superType').schema.header.description : '' )) == null ? '' : __t) +
'" placeholder="Brief Description">\n        </div>\n      </div>\n      <div class="form-group row">\n        <label for="version" class="col-md-2 control-label">' +
((__t = (__("version") )) == null ? '' : __t) +
'</label>\n        <div class="col-md-2">\n          <input text class="form-control" id="version" name="version" value="' +
((__t = ( dataType.id ? dataType.get('superType').schema.header.version : '' )) == null ? '' : __t) +
'" placeholder="0.0.X">\n        </div>\n        <label for="ontology" class="col-md-2 control-label">' +
((__t = (__("ontology") )) == null ? '' : __t) +
'</label>\n        <div class="col-md-5">\n          <select class="form-control" id="ontology" name="ontology">\n                        <option value="" selected="true">Select an ontology to name metadata fields</option>\n                    </select>\n        </div>\n      </div>\n    </div>\n    <div class="form-group row">\n      <div class="panel-group col-md-offset-1 col-md-10" id="schema-data-type">\n        <div class="panel panel-default">\n          <div class="panel-heading bg-transition">\n            <div class="row">\n              <div class="col-md-offset-1 col-md-10">\n                <h4 class="panel-title">\n                      <div id="schema-title" data-parent="#schema-data-type" href="#collapse-schema">' +
((__t = (__("edit") )) == null ? '' : __t) +
' ' +
((__t = ( isMultiProject ? __("shared-schema") : __("schema") )) == null ? '' : __t) +
'</div>\n                    </h4>\n              </div>\n              <div id="schema-title-icon" class="col-md-1"></div>\n            </div>\n          </div>\n          <div id="collapse-schema" class="panel-collapse collapse">\n            <div id="super-type-cnt" class="panel-body"></div>\n            <div class="container-schema panel-body">\n              <div id="schemaBody" class="panel-body"></div>\n              <div class="add-metadata-group-container text-center">\n                <input type="button" class="btn btn-info add-metadata-group" value="' +
((__t = (__('add-metadata-group') )) == null ? '' : __t) +
'">\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div id="buttonbardiv" class="row text-center">\n      <div class="btn-group btn-group-margin">\n\n        <input type="submit" class="btn btn-primary" value="' +
((__t = (__('save-data-type') )) == null ? '' : __t) +
'">\n        ';
 if (dataType.id) { ;
__p += '\n          <input type="hidden" id="id" name="id" value="' +
((__t = ( dataType.id )) == null ? '' : __t) +
'" />\n          <button data-dataType-id="' +
((__t = ( dataType.id )) == null ? '' : __t) +
'" class="btn btn-danger delete">' +
((__t = ( __("delete") )) == null ? '' : __t) +
'</button>\n          ';
} ;
__p += '\n      </div>\n    </div>\n  </form>\n\n</div>\n<!--content -->\n<div class="datatype-modal"></div>\n';

}
return __p
};

this["JST"]["views/templates/datatype-graph.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2>DataType Graph</h2>\n<style>\n    ellipse {\n        fill: #ececec;\n        stroke-width: 3px;\n    }\n\n    #subject {\n        stroke: steelblue;\n    }\n\n    #sample {\n        stroke: green;\n    }\n\n    #data {\n        stroke: #FF3300;\n    }\n\n    .node text {\n        font: 10px;\n    }\n\n    .link {\n        fill: none;\n        stroke-width: 2px;\n        stroke-linecap: round;\n        stroke-opacity: 1;\n        stroke-dasharray: 5, 5;\n\n    }\n</style>\n\n<div id="content">\n    <p>Select a DataType:</p>\n    <div class="row">\n        <div class="col-md-4">\n            <select class="form-control" id="select1">\n                ';
 _.each(dataTypes,function(dataType){ ;
__p += '\n                <option id="dataType" value="' +
((__t = ( dataType.get('id'))) == null ? '' : __t) +
'-@#@-' +
((__t = ( dataType.get("name"))) == null ? '' : __t) +
'">\n                    ' +
((__t = ( dataType.get("name"))) == null ? '' : __t) +
'</option>\n                ';
});
__p += '\n            </select>\n        </div>\n        <div class="col-md-4">\n            <a id="graph" class="btn btn-primary">Generate Graph</a>\n        </div>\n    </div>\n</div>';

}
return __p
};

this["JST"]["views/templates/datatype-list.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2 class="legend" align="center">' +
((__t = ( __("data-type-list") )) == null ? '' : __t) +
'</h2>\n\n<div id="content">\n    <div class="row">\n        <div class="col-sm-12">\n            <div class="table-container">\n                <table class="table">\n                    <thead>\n                        <tr>\n                            <th>' +
((__t = (__("id") )) == null ? '' : __t) +
'</th>\n                            <th>' +
((__t = ( __("name") )) == null ? '' : __t) +
'</th>\n                            <th>' +
((__t = ( __("model") )) == null ? '' : __t) +
'</th>\n                            <!--\n                            <th>' +
((__t = ( __("json-schema") )) == null ? '' : __t) +
'</th>\n                            -->\n                            <th>' +
((__t = ( __("parent") )) == null ? '' : __t) +
'</th>\n                            <th>' +
((__t = ( __("project") )) == null ? '' : __t) +
'</th>\n                            <th></th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                    ';
 _.each(dataTypes, function(dataType) { ;
__p += '\n                    <tr class="content">\n                        <td>' +
((__t = ( dataType.id )) == null ? '' : __t) +
'</td>\n                        <td>' +
((__t = ( dataType.get("name") )) == null ? '' : __t) +
'</td>\n                        <td>' +
((__t = ( dataType.get("model") )) == null ? '' : __t) +
'</td>\n                        <!--\n                        <td>' +
((__t = ( JSON.stringify(dataType.get("schema")) )) == null ? '' : __t) +
'</td>\n                        -->\n                        <td>' +
((__t = ( dataType.get("parents").map(function(parent) { return (" " + parent.name); }).toString().trim() )) == null ? '' : __t) +
'</td>\n                        <td>' +
((__t = ( dataType.get("project") ? dataType.get("project").name : '' )) == null ? '' : __t) +
'</td>\n                        <td>\n                          <div class="btn-group btn-group-sm" role="group" style="margin-top:0.5vh;">\n                            <a type="button" class="btn btn-info" href="#/datatypes/edit/' +
((__t = ( dataType.id )) == null ? '' : __t) +
'">' +
((__t = (__("edit") )) == null ? '' : __t) +
'</a>\n                          </div>\n                        </td>\n                    </tr>\n                    ';
 }) ;
__p += '\n                    </tbody>\n                </table>\n            </div>\n            <div id="outer">\n              <div id="buttonbardiv" class="inner"><a href="#/datatypes/new" class="btn btn-primary">' +
((__t = ( __("new-data-type"))) == null ? '' : __t) +
'</a></div>\n              <div id="buttonbardiv" class="inner"><a id="duplicate" class="btn btn-primary">' +
((__t = ( __("duplicate-data-type"))) == null ? '' : __t) +
'</a></div>\n              <div id="buttonbardiv" class="inner"><a href="#datatypes/graph" class="btn btn-primary">' +
((__t = ( __("datatype-graph"))) == null ? '' : __t) +
'</a></div>\n            </div>\n        </div>\n    </div>\n</div>\n<div class="data-type-modal"></div>\n';

}
return __p
};

this["JST"]["views/templates/datatypeprivileges-edit.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2>' +
((__t = ( privilege.id ? __("update-data-type-privileges") : __("create-data-type-privileges") )) == null ? '' : __t) +
'</h2>\n\n<div id="content">\n\n    <form class="form-horizontal edit-datatypeprivileges-form" role="form" data-parsley-trigger="focusout" data-parsley-validate>\n\n        <div class="form-group row">\n            <label for="group" class="col-md-3 control-label">' +
((__t = ( __("group") )) == null ? '' : __t) +
'</label>\n            <div class="col-md-6">\n                <select required class="form-control" id="group" name="group"></select>\n            </div>\n        </div>\n        <div class="form-group row">\n            <label for="data-type" class="col-md-3 control-label">' +
((__t = ( __("data-type") )) == null ? '' : __t) +
'</label>\n            <div class="col-md-6">\n                <select required class ="form-control" name="data-type" id="data-type" ></select>\n            </div>\n        </div>\n\n        <div class="form-group row">\n            <label for="privilege-level" class="col-md-3 control-label">' +
((__t = ( __("privilege-level") )) == null ? '' : __t) +
'</label>\n            <div class="col-md-6">\n                <select class ="form-control" name="privilege-level" id="privilege-level" ></select>\n            </div>\n        </div>\n\n        <div id="buttonbardiv" class="row text-center">\n            <div class="btn-group btn-group-margin">\n                <input id="save-privilege" type="submit" class="btn btn-primary" value="' +
((__t = (__('save') )) == null ? '' : __t) +
'" >\n                ';
 if (privilege.id) { ;
__p += '\n                    <input type="hidden" id="id" name="id" value="' +
((__t = ( privilege.id )) == null ? '' : __t) +
'" />\n                    <button data-privilege-id="' +
((__t = ( privilege.id )) == null ? '' : __t) +
'" class="btn btn-danger delete">' +
((__t = ( __("delete") )) == null ? '' : __t) +
'</button>\n                ';
} ;
__p += '\n            </div>\n        </div>\n\n    </form>\n\n</div>\n<div class="privilege-modal"></div>\n';

}
return __p
};

this["JST"]["views/templates/datatypeprivileges-list.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2>' +
((__t = (  params.groupId ?  __("group") + ": " + group.get("name") :
    params.dataTypeId ? __("data-type") + ": " + privileges.models[0].get("dataType").name : "")) == null ? '' : __t) +
'</h2>\n\n<div id="content">\n  <div class="row">\n      <div class="col-sm-12">\n          <div class="table-responsive no-datatable-list">\n              <table class="table">\n                  <thead>\n                      <tr>\n                          <th>' +
((__t = ( __("group") )) == null ? '' : __t) +
'</th>\n                          <th>' +
((__t = ( __("data-type-name") )) == null ? '' : __t) +
'</th>\n                          <th>' +
((__t = ( __("privilege-level") )) == null ? '' : __t) +
'</th>\n                          <th>' +
((__t = ( __("project") )) == null ? '' : __t) +
'</th>\n                          <th>' +
((__t = ( __("actions") )) == null ? '' : __t) +
'</th>\n                      </tr>\n                  </thead>\n                  <tbody>\n                  ';
 _.each(privileges.models, function(privilege) { ;
__p += '\n                  <tr class="content">\n                      <td>' +
((__t = ( privilege.get("group").name )) == null ? '' : __t) +
'</td>\n                      <td>' +
((__t = ( privilege.get("dataType").name )) == null ? '' : __t) +
'</td>\n                      <td>' +
((__t = ( privilege.get("privilegeLevel").toUpperCase().replace('_', ' ') )) == null ? '' : __t) +
'</td>\n                      <td>' +
((__t = ( mapTypeProjects[privilege.get("dataType").id] ? mapTypeProjects[privilege.get("dataType").id] : "" )) == null ? '' : __t) +
'</td>\n\n                      <td>\n                        <div class="btn-group btn-group-sm" role="group" style="margin-top:0.5vh;">\n                          <a type="button" class="btn btn-info" href="#/datatypeprivileges/edit/' +
((__t = ( privilege.id )) == null ? '' : __t) +
'">' +
((__t = (__("edit") )) == null ? '' : __t) +
'</a>\n                      </div>\n                      </td>\n                  </tr>\n                  ';
}) ;
__p += '\n                  </tbody>\n              </table>\n          </div>\n          <div id="buttonbardiv" class="row text-center">\n            <a href="" id="newPrivilege" class="btn btn-primary">' +
((__t = ( __("new-data-type-privilege"))) == null ? '' : __t) +
'</a>\n          </div>\n      </div>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/dedicated-data-dialog-bootstrap.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="modal-body">\n  <div class="row text-center">\n    <span>' +
((__t = ( __('process-loaded') )) == null ? '' : __t) +
'</span>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/dedicated-data-edit.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h1>' +
((__t = ( __("customised-data-management") )) == null ? '' : __t) +
'</h1>\n<div id="content" style="margin-top:2em;">\n  <div class="text-center new-import-btn-cnt">\n    <button id="collapse-button" type="button" class="btn btn-success"\n      name="button">' +
((__t = ( __("new-customised-data-import") )) == null ? '' : __t) +
'</button>\n  </div>\n  <div id="collapse-import" class="collapse">\n    <div class="row">\n      <h2></h2>\n      <div id="customised-form" class="col-xs-offset-2 col-xs-8">\n        <form class="form-horizontal edit-data-form" role="form" data-parsley-focus="first" data-parsley-validate>\n          <div class="row text-center">\n            <div class="row text-center">\n              <div class="col-xs-offset-3 col-xs-6" style="padding:1em;">\n                <div class="form-group">\n                  <select required id="data-type" name="data-type" title="' +
((__t = ( __('please-select-a-data-type') )) == null ? '' : __t) +
'"\n                    class="selectpicker form-control"></select>\n                </div>\n              </div>\n            </div>\n\n            <div id="buttonseldiv" class="row text-center hidden">\n              <h4>' +
((__t = ( __('choose-import') )) == null ? '' : __t) +
'</h4>\n              <div class="btn-group btn-group-margin">\n                <input type="button" id="bulk" class="btn btn-default" value="' +
((__t = (__('bulk') )) == null ? '' : __t) +
'">\n                <input type="button" id="by-patient" class="btn btn-default" value="' +
((__t = (__('by-patient') )) == null ? '' : __t) +
'">\n              </div>\n            </div>\n            <div id="bulk-message" class="row text-left hidden" style="font-size:12px">\n              <div>' +
((__t = (__('bulk-message') )) == null ? '' : __t) +
'</div>\n\n            </div>\n\n            <div class="row text-center selector-cnt hidden">\n              <div class="row">\n                <div class="col-xs-4" style="padding:1em;">\n                  <div class="form-group">\n                    <select id="subject-selector" name="subject-selector" data-live-search="true"\n                      title="' +
((__t = ( __('please-select-a-subject') )) == null ? '' : __t) +
'" class="selectpicker form-control"></select>\n                  </div>\n                </div>\n                <div class="col-xs-1" style="padding:1em;">\n                  <div class="form-group">\n                    <input type="button" id="new-subject" class="btn btn-primary" value="' +
((__t = (__('new-subject') )) == null ? '' : __t) +
'">\n                  </div>\n                </div>\n                <div class="col-xs-offset-1 col-xs-4" style="padding:1em;">\n                  <div class="form-group">\n                    <select disabled id="sample-selector" name="sample-selector" data-live-search="true"\n                      title="' +
((__t = ( __('please-select-a-sample') )) == null ? '' : __t) +
'" class="selectpicker form-control"></select>\n                  </div>\n                </div>\n                <div class="col-xs-1" style="padding:1em;">\n                  <div class="form-group">\n                    <input disabled type="button" id="new-sample" class="btn btn-primary"\n                      value="' +
((__t = (__('new-sample') )) == null ? '' : __t) +
'">\n                  </div>\n                </div>\n              </div>\n              <div class="row">\n                <div class="col-xs-3" style="padding:1em;">\n                  <div class="form-group">\n                    <select id="sample-type-selector" name="sample-type-selector" data-live-search="true"\n                      title="' +
((__t = ( __('please-select-a-sample-type') )) == null ? '' : __t) +
'" class="selectpicker form-control">\n                      <option value="BLOOD">' +
((__t = (__('blood') )) == null ? '' : __t) +
'</option>\n                      <option value="TISSUE">' +
((__t = (__('tissue') )) == null ? '' : __t) +
'</option>\n                      <option value="SWAB">' +
((__t = (__('swab') )) == null ? '' : __t) +
'</option>\n                      <option value="FIBROBLAST">' +
((__t = (__('fibroblast') )) == null ? '' : __t) +
'</option>\n                      <option value="URINE">' +
((__t = (__('urine') )) == null ? '' : __t) +
'</option>\n                    </select>\n                  </div>\n                </div>\n                <div class="col-xs-offset-1 col-xs-4" style="padding:1em;">\n                  <div class="form-group">\n                    <select id="machine-selector" name="machine-selector" data-live-search="true"\n                      title="' +
((__t = ( __('please-select-a-machine') )) == null ? '' : __t) +
'" class="selectpicker form-control">\n                      <option value="ILLUMINA">' +
((__t = (__('illumina') )) == null ? '' : __t) +
'</option>\n                      <option value="ION TORRENT">' +
((__t = (__('ion_torrent') )) == null ? '' : __t) +
'</option>\n                    </select>\n                  </div>\n                </div>\n                <div class="col-xs-offset-1 col-xs-3" style="padding:1em;">\n                  <div class="form-group">\n                    <input type="text" id="capture-input" class="form-control"\n                      placeholder="' +
((__t = ( __('please-insert-a-capture') )) == null ? '' : __t) +
'">\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n          <div class="row text-center">\n            <div class="col-xs-12">\n              <div class="dropzone" style="width: 18%;">\n                <div class="dz-default dz-message text-center">\n                  <span>' +
((__t = ( __('drop-files-here') )) == null ? '' : __t) +
'</span>\n                </div>\n                <div class="fallback">\n                  <input name="file" type="file">\n                </div>\n              </div>\n            </div>\n          </div>\n          <div id="buttonbardiv" class="row text-center">\n            <div class="btn-group btn-group-margin">\n              <input type="submit" id="save" class="btn btn-primary" value="' +
((__t = (__('save') )) == null ? '' : __t) +
'">\n            </div>\n          </div>\n      </div>\n      </form>\n    </div>\n  </div>\n</div>\n</div>\n\n<div class="row" style="margin-top: 2em;">\n  <h2>' +
((__t = ( __("customised-data-daemon") )) == null ? '' : __t) +
'</h2>\n  <div class="row text-center">\n    <div class="col-xs-12">\n      <div id="daemon-table-cnt" class="row" style="margin-top:2em;"></div>\n    </div>\n  </div>\n</div>\n</div>\n<div class="customised-data-modal"></div>';

}
return __p
};

this["JST"]["views/templates/dedicated-notprocessedrows-dialog-bootstrap.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="modal-body">\n  <div class="title-body">\n    ' +
((__t = ( __("file"))) == null ? '' : __t) +
': ' +
((__t = ( file)) == null ? '' : __t) +
'\n  </div>\n  <div class="row" style="margin-top: 2em;">\n      <div class="col-sm-12">\n          <div class="table-responsive">\n              <table class="table table-bordered table-striped table-hover">\n                  <thead>\n                      <tr>\n                          <th>' +
((__t = ( __("index") )) == null ? '' : __t) +
'</th>\n                          <th>' +
((__t = ( __("data") )) == null ? '' : __t) +
'</th>\n                          <th>' +
((__t = ( __("error") )) == null ? '' : __t) +
'</th>\n                      </tr>\n                  </thead>\n                  <tbody>\n                  ';
 _.each(data, function(datum) { ;
__p += '\n                    <tr class="content">\n                      <td>' +
((__t = ( datum.index ? datum.index : '' )) == null ? '' : __t) +
'</td>\n                      <td>' +
((__t = ( datum.data ? JSON.stringify(datum.data) : '' )) == null ? '' : __t) +
'</td>\n                      <td>' +
((__t = ( datum.error ? datum.error : '' )) == null ? '' : __t) +
'</td>\n                    </tr>\n                  ';
 }) ;
__p += '\n                  </tbody>\n              </table>\n          </div>\n      </div>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/dialog-bootstrap.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- BOOTSTRAP Dialog -->\n<div class="modal fade">\n    <div class="modal-dialog">\n        <div class="modal-content">\n\n            <div class="modal-header">\n                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n                <h4 class="modal-title">' +
((__t = (__('default-title') )) == null ? '' : __t) +
'</h4>\n            </div>\n\n            <div class="modal-body">' +
((__t = (__('default-body') )) == null ? '' : __t) +
'</div>\n\n            <div class="modal-footer">\n                <button type="button" class="btn btn-default" data-dismiss="modal">' +
((__t = ( __('close') )) == null ? '' : __t) +
'</button>\n            </div>\n\n        </div>\n    </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/field-description-button.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="metadata-descr-div">\n  <div id="decription-icon" class="fa fa-question-circle fa-2x ' +
((__t = (component.formattedName)) == null ? '' : __t) +
'" data-title="' +
((__t = (component.name)) == null ? '' : __t) +
'" data-content="' +
((__t = (component.description)) == null ? '' : __t) +
'" data-placement="right"></div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/filemanager-dropzone.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div name="stored-files-cnt" class="file-list">\n    ';
 _.each(files, function(file) {
          var uriFrags = file.uri && file.uri.split('/');
          var fileName = uriFrags && uriFrags[uriFrags.length - 1]; ;
__p += '\n        <div class="input-group margin-bottom-sm">\n            <span class="input-group-addon"><i class="fa fa-file"></i></span>\n            <span style="height:auto;" class="form-control">' +
((__t = ( fileName )) == null ? '' : __t) +
'</span>\n            <span id="delete-file" class="input-group-addon btn btn-danger" value= "' +
((__t = (file.id)) == null ? '' : __t) +
'"><i class="fa fa-trash"></i></span>\n        </div>\n    ';
}); ;
__p += '\n</div>\n<div class="dropzone">\n    <div class="dz-default dz-message text-center">\n        <span>' +
((__t = ( __('drop-files-here') )) == null ? '' : __t) +
'</span>\n    </div>\n    <div class="fallback">\n        <input name="file" type="file">\n    </div>\n</div>\n<div class="file-modal"></div>\n';

}
return __p
};

this["JST"]["views/templates/group-edit.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div id="group">\n    <form name = "Myform" class="form-horizontal edit-group-form" role="form" data-parsley-trigger="focusout" data-parsley-validate>\n\n        <legend class="legend"align="center">' +
((__t = ( group ? 'Edit' : 'New' )) == null ? '' : __t) +
' Group</legend>\n\n        <div class="form-group row">\n            <label for="name" class="col-md-3 control-label">' +
((__t = ( __("name") )) == null ? '' : __t) +
'</label>\n            <div class="col-md-6">\n                <input required class ="form-control" name="name" id="name" type="text" value="' +
((__t = ( group ? group.get('name') : '' )) == null ? '' : __t) +
'">\n            </div>\n        </div>\n\n        <div class="form-group row">\n            <label for="privilege-level" class="col-md-3 control-label">' +
((__t = ( __("privilege-level") )) == null ? '' : __t) +
'</label>\n            <div class="col-md-6">\n                <select required class ="form-control" name="privilege-level" id="privilege-level" ></select>\n            </div>\n        </div>\n\n        <div class="form-group row">\n            <label for="can-access-personal-data" class="checkbox-inline">\n                <input type="checkbox" name="can-access-personal-data" id="can-access-personal-data">\n                ' +
((__t = ( __("can-access-personal-data") )) == null ? '' : __t) +
'\n            </label>\n        </div>\n\n        <div class="form-group row">\n            <label for="can-access-sensitive-data" class="checkbox-inline">\n                <input type="checkbox" name="can-access-sensitive-data" id="can-access-sensitive-data">\n                ' +
((__t = ( __("can-access-sensitive-data") )) == null ? '' : __t) +
'\n            </label>\n        </div>\n\n        <hr />\n\n        <div id="buttonbardiv" class="row text-center">\n            <div class="btn-group btn-group-margin">\n            <input type="submit" id="save" class="btn btn-primary" value="' +
((__t = ( __('save-group') )) == null ? '' : __t) +
'" >\n            ';
 if(group) { ;
__p += '\n                <input type="hidden" name="id" value="' +
((__t = ( group.id )) == null ? '' : __t) +
'" />\n                <button id="delete" data-group-id="' +
((__t = ( group.id )) == null ? '' : __t) +
'" class="btn btn-danger delete">' +
((__t = ( __('delete') )) == null ? '' : __t) +
'</button>\n            ';
 }; ;
__p += '\n        </div>\n        </div>\n\n    </form>\n    <div class="group-modal"></div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/group-list.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2 class="legend" align="center">' +
((__t = ( __("group-list") )) == null ? '' : __t) +
'</h2>\n<div id="list">\n    <div class="table-container">\n        <table class="table striped">\n            <thead>\n                <tr>\n                    <th>' +
((__t = ( __("name") )) == null ? '' : __t) +
'</th>\n                    <th>' +
((__t = ( __("projects") )) == null ? '' : __t) +
'</th>\n                    <th>' +
((__t = ( __("actions") )) == null ? '' : __t) +
'</th>\n\n                </tr>\n            </thead>\n            <tbody>  ';
 _.each(groups, function(group) { ;
__p += '\n            <tr class="group_val">\n              <td>' +
((__t = ( group.get("name") )) == null ? '' : __t) +
'</td>\n              <td>' +
((__t = ( _.map(group.get("projects"), 'name').join(" ") )) == null ? '' : __t) +
'</td>\n              <td class="groups-actions">\n                <div class="btn-group btn-group-sm" role="group" style="margin-top:0.5vh;">\n                  <a type="button" class="btn btn-info" id="edit" href="#/groups/edit/' +
((__t = ( group.id )) == null ? '' : __t) +
'">' +
((__t = (__("edit") )) == null ? '' : __t) +
'</a>\n                  <a type="button" class="btn btn-primary" id="edit" href="#/groups/operator/' +
((__t = ( group.id )) == null ? '' : __t) +
'">' +
((__t = (__("member-operators") )) == null ? '' : __t) +
'</a>\n                  <a type="button" class="btn btn-primary" id="edit" href="#/datatypeprivileges?groupId=' +
((__t = ( group.id )) == null ? '' : __t) +
'">' +
((__t = (__("data-type-privileges") )) == null ? '' : __t) +
'</a>\n              </div>\n              </td>\n            </tr>\n            ';
 }) ;
__p += '\n            </tbody>\n        </table>\n    </div>\n    <div id="buttonbardiv" class="row text-center">\n        <a href="#/groups/new" class="btn btn-primary">' +
((__t = ( __("new-group"))) == null ? '' : __t) +
'</a>\n    </div>\n     </div>\n';

}
return __p
};

this["JST"]["views/templates/homepage.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h2 id="account" class="legend">Welcome, ' +
((__t = ( login )) == null ? '' : __t) +
'!</h2>\n';

}
return __p
};

this["JST"]["views/templates/login.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h2 id="account" class="legend">Account Login</h2>\n\n<style type="text/css">\ninput {\n    color: #555;\n    line-height: 1.428571429;\n    height: 34px;\n    vertical-align: middle;\n    background-color: #fff;\n    border: 1px solid #ccc;\n    border-radius: 4px;\n    max-width: 280px;\n    margin: 0;\n    padding-left:10px;\n}\n\n#nav2 {\n    display:none;\n}\n\nh2#account{\n    font-size:20px;\n    line-height: 30px;\n    color: #555;\n    font-family: \'Helvetica\',Gadget, sans-serif;\n    font-weight: normal;\n}\n.hidden-div {\n    display: none;\n}\n\n</style>\n\n<form name="login-form" id="login-form" class="form-horizontal login-form" role="form">\n    <div id="loginFailed" class="form-group has-error hidden-div">\n        <span class="control-label col-sm-4 col-sm-offset-2">\n            <strong> ' +
((__t = ( __("wrong-username-and-or-password!") )) == null ? '' : __t) +
'</strong>\n        </span>\n    </div>\n    <div class="form-group">\n        <label for="username" class="col-sm-2 control-label">' +
((__t = ( __('username') )) == null ? '' : __t) +
'</label>\n        <div class "col-sm-4">\n            <input name="user" type="text" id="username" class="form-control" placeholder="User Name" required>\n        </div>\n    </div>\n    <div class="form-group">\n        <label for="password" class="col-sm-2 control-label">' +
((__t = ( __('password') )) == null ? '' : __t) +
'</label>\n        <div class "col-sm-4">\n            <input type="password" id="password" class="form-control" placeholder="Password" required>\n        </div>\n    </div>\n\n    <div class="col-sm-offset-4">\n        <input type="submit" id="login" class="btn btn-primary" value="' +
((__t = (__('sign-in') )) == null ? '' : __t) +
'">\n    </div>\n</form>\n<div class="project-modal"></div>\n';

}
return __p
};

this["JST"]["views/templates/menu-navbar-login.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<nav class="navbar navbar-default">\n  <div class="container-fluid">\n    <div class="row">\n      <div class="col-md-6">\n        <div class="navbar-header">\n          <div class="row">\n            <div class="title-menu-cnt-login">\n              <h3><b>XTENS 2</b></h3>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class="col-md-6">\n        <div class="collapse navbar-collapse">\n          <ul class="nav navbar-nav navbar-right">\n            <li><a href="https://github.com/xtens-suite/xtens-app/blob/master/README.md" id="current">XTENS 2 Official\n                GitHub Page</a></li>\n            <!-- <li><a href="#">Page</a></li>\n        <li><a href="#">Page</a></li> -->\n          </ul>\n        </div>\n      </div>\n    </div>\n  </div>\n</nav>';

}
return __p
};

this["JST"]["views/templates/menu-navbar.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<nav id="menu-bar" class="navbar navbar-default" role="navigation">\n  <!-- Brand and toggle get grouped for better mobile display -->\n  <div class="container-fluid">\n    <div class="row">\n      <div class="col-md-2">\n        <div class="navbar-header">\n          <div class="row">\n            <a href="#homepage">\n              <div class="col-md-8 title-menu-cnt">\n                <h3><b>XTENS 2</b></h3>\n              </div>\n            </a>\n            <div class="col-md-2">\n              <button type="button" id="sidebarCollapse" class="navbar-btn toggle-bar" data-placement="right"\n                data-toggle="tooltip" title="' +
((__t = ( __('show-hide-bar'))) == null ? '' : __t) +
'">\n                <span></span>\n                <span></span>\n                <span></span>\n              </button>\n            </div>\n          </div>\n        </div>\n      </div>\n      <div class="col-md-10">\n        <!-- Collect the nav links, forms, and other content for toggling -->\n        <div class="collapse navbar-collapse row">\n          <ul class="nav navbar-nav" id="menubar-ul-item">\n            ';
 if (accessDashboard) {;
__p += '\n            <li>\n              <a href="#/' +
((__t = ( accessDashboard )) == null ? '' : __t) +
'">' +
((__t = ( __("project-dashboard"))) == null ? '' : __t) +
'</a>\n            </li>\n            ';
};
__p += '\n            ';
 if (session.get("isWheel") || session.get("isAdmin")) {;
__p += '\n            <li class="">\n              <a href="#" data-toggle="dropdown" class="dropdown-toggle"\n                aria-expanded="false">' +
((__t = ( __("administration"))) == null ? '' : __t) +
'\n                &nbsp;&nbsp;&nbsp;&nbsp;</a>\n              <ul class="dropdown-menu">\n                ';
 if (session.get("isWheel") || session.get("isAdmin")) {;
__p += '\n                <!-- <p id="title">' +
((__t = ( __("super-user"))) == null ? '' : __t) +
'</p> -->\n                <li> <a href="#/projects"> ' +
((__t = ( __("projects") )) == null ? '' : __t) +
'</a> </li>\n                <li> <a href="#/groups"> ' +
((__t = ( __("groups") )) == null ? '' : __t) +
'</a> </li>\n                <li> <a href="#/operators"> ' +
((__t = ( __("operators") )) == null ? '' : __t) +
'</a> </li>\n                <li> <a href="#/biobanks"> ' +
((__t = ( __("biobanks") )) == null ? '' : __t) +
'</a> </li>\n                <li> <a href="#/datatypes"> ' +
((__t = ( __("data-types") )) == null ? '' : __t) +
'</a> </li>\n                ';
}
                else {;
__p += '\n                <!-- <p id="title">' +
((__t = ( __("standard"))) == null ? '' : __t) +
'</p> -->\n                ';
};
__p += '\n                </ul>\n              </li>\n              ';
};
__p += '\n                <li>\n                  <a href="#" data-toggle="dropdown" class="dropdown-toggle"\n                    aria-expanded="false">' +
((__t = ( __("data-management"))) == null ? '' : __t) +
'\n                    &nbsp;&nbsp;&nbsp;&nbsp;</a>\n                  <ul class="dropdown-menu">\n                    <li> <a href="#/subjects"> ' +
((__t = ( __("subjects") )) == null ? '' : __t) +
'</a> </li>\n                    <li> <a href="#/samples"> ' +
((__t = ( __("samples") )) == null ? '' : __t) +
'</a> </li>\n                    <li> <a href="#/data"> ' +
((__t = ( __("data") )) == null ? '' : __t) +
'</a> </li>\n                    <li> <a href="#/data/dedicated"> ' +
((__t = ( __("customised-data") )) == null ? '' : __t) +
' </a> </li>\n                  </ul>\n                </li>\n                <li>\n                  <a href="#" data-toggle="dropdown" class="dropdown-toggle" aria-expanded="false">' +
((__t = ( __("search"))) == null ? '' : __t) +
'\n                    &nbsp;&nbsp;&nbsp;&nbsp;</a>\n                  <ul class="dropdown-menu">\n                    <li><a href="#/query">' +
((__t = ( __("advanced-search") )) == null ? '' : __t) +
'</a></li>\n                    <li> <a href="#/getFromBarCode"> ' +
((__t = ( __("get-from-bar-code") )) == null ? '' : __t) +
'</a></li>\n                  </ul>\n                </li>\n                <li>\n                  <a href="#" data-toggle="dropdown" class="dropdown-toggle" aria-expanded="false">' +
((__t = ( __("account"))) == null ? '' : __t) +
'\n                    &nbsp;&nbsp;&nbsp;&nbsp;</a>\n                  <ul class="dropdown-menu">\n                    <li><a href="#/operators/edit/' +
((__t = ( operatorId )) == null ? '' : __t) +
'"> ' +
((__t = ( __("edit-profile") )) == null ? '' : __t) +
'</a> </li>\n                    <li><a href="#/operators/updatePassword"> ' +
((__t = ( __("change-password") )) == null ? '' : __t) +
'</a> </li>\n                  </ul>\n                </li>\n              </ul>\n              <ul class="nav navbar-nav navbar-right">\n                <li style="margin-right:1em;">\n                  <a href="#/logout" type="button" id="sidebarCollapse" class="navbar-btn logout" style="float:right;"\n                    data-placement="left" data-toggle="tooltip" title="' +
((__t = ( __('logout'))) == null ? '' : __t) +
'">\n                    <i style="margin: -1em -0.2em;" class="fa fa-sign-out fa-2x" /></a>\n                </li>\n              </ul>\n        </div><!-- /.navbar-collapse -->\n      </div>\n    </div>\n  </div>\n</nav>';

}
return __p
};

this["JST"]["views/templates/menu-sidebar.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<nav id="sidebar">\n  <div class="sidebar-header">\n    <a href="#homepage">\n      <h1 style="margin: 0.2em 0 0 0;">XTENS 2</h1>\n    </a>\n  </div>\n\n  <ul class="list-unstyled components">\n    <p>' +
((__t = ( __("current-project") )) == null ? '' : __t) +
':</p>\n    <div class="p-data-comp">\n      <b>' +
((__t = ( currentProject )) == null ? '' : __t) +
'</b>\n      <i id="p-project-selector" for="project-selector" data-placement="right" data-toggle="tooltip"\n        title="' +
((__t = ( __('click-to-change-project'))) == null ? '' : __t) +
'" class="fa fa-cogs i-comp"></i>\n    </div>\n\n    <p>' +
((__t = ( __("user") )) == null ? '' : __t) +
': </p>\n    <div class="p-data-comp" style="margin-bottom:2vh;">\n      <b>' +
((__t = ( login )) == null ? '' : __t) +
'</b>\n      <a href="#/operators/edit/' +
((__t = ( operatorId )) == null ? '' : __t) +
'">\n        <i id="p-edit-operator" for="project-selector" data-placement="right" data-toggle="tooltip"\n          title="' +
((__t = ( __('edit-profile'))) == null ? '' : __t) +
'" class="fa fa-user i-comp"></i>\n      </a>\n    </div>\n    ';
 if (accessDashboard) {;
__p += '\n    <li class="">\n      <a href="#/' +
((__t = ( accessDashboard )) == null ? '' : __t) +
'" aria-expanded="false">' +
((__t = ( __("project-dashboard"))) == null ? '' : __t) +
'</a>\n    </li>\n    ';
};
__p += '\n    ';
 if (session.get("isWheel") || session.get("isAdmin")) {;
__p += '\n    <li class="">\n      <a href="#administration" data-toggle="collapse" aria-expanded="false">' +
((__t = ( __("administration"))) == null ? '' : __t) +
'</a>\n      <ul class="collapse list-unstyled" id="administration">\n        ';
 if (session.get("isWheel") || session.get("isAdmin")) {;
__p += '\n        <!-- <p id="title">' +
((__t = ( __("super-user"))) == null ? '' : __t) +
'</p> -->\n        <li> <a href="#/projects"> ' +
((__t = ( __("projects") )) == null ? '' : __t) +
'</a> </li>\n        <li> <a href="#/groups"> ' +
((__t = ( __("groups") )) == null ? '' : __t) +
'</a> </li>\n        <li> <a href="#/operators"> ' +
((__t = ( __("operators") )) == null ? '' : __t) +
'</a> </li>\n        <li> <a href="#/biobanks"> ' +
((__t = ( __("biobanks") )) == null ? '' : __t) +
'</a> </li>\n        <li> <a href="#/datatypes"> ' +
((__t = ( __("data-types") )) == null ? '' : __t) +
'</a> </li>\n        ';
}
      else {;
__p += '\n        <!-- <p id="title">' +
((__t = ( __("standard"))) == null ? '' : __t) +
'</p> -->\n        ';
};
__p += '\n      </ul>\n    </li>\n    ';
};
__p += '\n        <li>\n          <a href="#data-management" data-toggle="collapse" aria-expanded="false">' +
((__t = ( __("data-management") )) == null ? '' : __t) +
'</a>\n          <ul class="collapse list-unstyled" id="data-management">\n            <li> <a href="#/subjects"> ' +
((__t = ( __("subjects") )) == null ? '' : __t) +
'</a> </li>\n            <li> <a href="#/samples"> ' +
((__t = ( __("samples") )) == null ? '' : __t) +
'</a> </li>\n            <li> <a href="#/data"> ' +
((__t = ( __("data") )) == null ? '' : __t) +
'</a> </li>\n            <li> <a href="#/data/dedicated"> ' +
((__t = ( __("customised-data") )) == null ? '' : __t) +
' </a> </li>\n          </ul>\n        </li>\n        <li>\n          <a href="#search" data-toggle="collapse" aria-expanded="false">' +
((__t = ( __("search") )) == null ? '' : __t) +
'</a>\n          <ul class="collapse list-unstyled" id="search">\n            <li><a href="#/query">' +
((__t = ( __("advanced-search") )) == null ? '' : __t) +
'</a></li>\n            <li> <a href="#/getFromBarCode"> ' +
((__t = ( __("get-from-bar-code") )) == null ? '' : __t) +
'</a></li>\n          </ul>\n        </li>\n        <li>\n          <a href="#account" data-toggle="collapse" aria-expanded="false">' +
((__t = ( __("account") )) == null ? '' : __t) +
'</a>\n          <ul class="collapse list-unstyled" id="account">\n            <li><a href="#/operators/edit/' +
((__t = ( operatorId )) == null ? '' : __t) +
'"> ' +
((__t = ( __("edit-profile") )) == null ? '' : __t) +
'</a> </li>\n            <li><a href="#/operators/updatePassword"> ' +
((__t = ( __("change-password") )) == null ? '' : __t) +
'</a> </li>\n          </ul>\n        </li>\n      </ul>\n\n      <ul class="list-unstyled CTAs">\n        <li hidden><a class="btn btn-default" href="#/logout">' +
((__t = ( __("logout") )) == null ? '' : __t) +
'</a></li>\n      </ul>\n</nav>';

}
return __p
};

this["JST"]["views/templates/metadatafield-edit.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h4>\n    <a class="remove-me">\n        <span class="fa fa-times-circle"></span>\n    </a>\n    ' +
((__t = ( __("attribute") )) == null ? '' : __t) +
'\n    </br>\n</h4>\n<div class="metadataField-formgroup">\n    <div class="metadataField-row">\n        <div class="metadataField-third">\n            <label class="control-label">' +
((__t = ( __('type') )) == null ? '' : __t) +
'</label>\n            <select class="form-control input-sm field-type no-edit" name="fieldType">\n            </select>\n        </div>\n        <div class="metadataField-third">\n            <label class="control-label">' +
((__t = ( __('name') )) == null ? '' : __t) +
'</label>\n            <input text class="form-control input-sm no-edit" placeholder="Field Name" name="name" required data-parsley-length="[1, 64]">\n        </div>\n        <div class="metadataField-third">\n            <label class="control-label">' +
((__t = ( __('custom-value') )) == null ? '' : __t) +
'</label>\n            <input text class="form-control input-sm" placeholder="Custom Value" name="custom-value">\n        </div>\n    </div>\n</div>\n<div class="metadataField-formgroup">\n    <div class="metadataField-row">\n        <div class="metadataField-sixth">\n            <label class="checkbox-inline">\n                <input type="checkbox" name="visible" value="visible">\n                ' +
((__t = (__('visible') )) == null ? '' : __t) +
'\n            </label>\n        </div>\n        <div class="metadataField-sixth">\n            <label class="checkbox-inline">\n                <input type="checkbox" name="caseInsensitive" value="caseInsensitive" class="no-edit">\n                ' +
((__t = (__('case-insensitive') )) == null ? '' : __t) +
'\n            </label>\n        </div>\n        <div class="right metadataField-third">\n            <label class="control-label">' +
((__t = ( __('description') )) == null ? '' : __t) +
'</label>\n            <input text class="form-control input-sm no-edit" placeholder="Short Description" name="description" required>\n        </div>\n    </div>\n</div>\n<div class="metadataField-formgroup">\n    <div class="metadataField-row">\n        <div class="metadataField-sixth">\n            <label class="checkbox-inline">\n                <input type="checkbox" name="required" value="required" class="no-edit">\n                ' +
((__t = (__('required') )) == null ? '' : __t) +
'\n            </label>\n        </div>\n        <div class="metadataField-sixth">\n            <label class="checkbox-inline">\n                <input type="checkbox" name="sensitive" value="sensitive" >\n                ' +
((__t = (__('sensitive') )) == null ? '' : __t) +
'\n            </label>\n        </div>\n        <div class="metadataField-sixth">\n            <label class="checkbox-inline">\n                <input type="checkbox" name="hasRange" value="hasRange" >\n                ' +
((__t = (__('hasRange') )) == null ? '' : __t) +
'\n            </label>\n        </div>\n        <div class="metadataField-range">\n            <label class="control-label">' +
((__t = ( __('min') )) == null ? '' : __t) +
'</label>\n            <input text class="form-control input-sm" name="min" placeholder="Minimum Value" data-parsley-type="number">\n        </div>\n        <div class="metadataField-range">\n            <label class="control-label">' +
((__t = ( __('max') )) == null ? '' : __t) +
'</label>\n            <input text class="form-control input-sm" name="max" placeholder="Maximum Value" data-parsley-type="number">\n        </div>\n        <div class="metadataField-range">\n            <label class="control-label">' +
((__t = ( __('step') )) == null ? '' : __t) +
'</label>\n            <input text class="form-control input-sm" name="step" placeholder="Step" data-parsley-type="number">\n        </div>\n\n    </div>\n</div>\n<div class="metadataField-formgroup">\n    <div class="metadataField-row">\n        <div class="metadataField-third">\n            <label class="checkbox-inline">\n                <input type="checkbox" name="isList" value="isList" class="no-edit">\n                ' +
((__t = (__('is-list') )) == null ? '' : __t) +
'\n            </label>\n        </div>\n        <div class="metadataField-third">\n            <label class="checkbox-inline">\n                <input type="checkbox" name="hasUnit" value="hasUnit" class="no-edit">\n                ' +
((__t = (__('has-units') )) == null ? '' : __t) +
'\n            </label>\n        </div>\n        <div class="metadataField-third">\n            <label class="checkbox-inline">\n                <input type="checkbox" name="fromDatabaseCollection" value="fromDatabaseCollection" class="no-edit"> ' +
((__t = (__('has-database-connection') )) == null ? '' : __t) +
'\n            </label>\n        </div>\n    </div>\n</div>\n<div class="metadataField-formgroup">\n    <div class="metadataField-row">\n        <div class="metadataField-third">\n            <input type="hidden" name="possibleValues" class="form-control input-sm value-list">\n        </div>\n        <div class="metadataField-third">\n            <input type="hidden" name="possibleUnits" class="form-control input-sm unit-list">\n        </div>\n        <div class="metadataField-third">\n            <select class="form-control input-sm no-edit" name="dbCollection" name="dbCollection">\n            </select>\n        </div>\n    </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/metadatafieldcheckbox-form.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="form-group metadataform-group">\n    <span class="metadata-label">' +
((__t = ( component.name )) == null ? '' : __t) +
'</span>\n    <div class="metadata-value-div">\n        <input type="checkbox" name="fieldValue">\n    </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/metadatafieldinput-form.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="form-group metadataform-group">\n    <span class="metadata-label">' +
((__t = ( component.name )) == null ? '' : __t) +
'</span>\n    <div class="metadata-value-div">\n        <input text name="fieldValue" class="form-control" >\n    </div>\n    ';
 if (component.hasUnit) {;
__p += '\n    <div class="metadata-unit-div">\n        <select name="fieldUnit" class="form-control"></div>\n    </div>\n    ';
};
__p += '\n</div>\n';

}
return __p
};

this["JST"]["views/templates/metadatafieldrange-form.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="metadataform-group">\n        <label class="metadata-label">' +
((__t = ( component.name )) == null ? '' : __t) +
'</label>\n        <div class="metadata-value-div">\n            <input type="range" min="' +
((__t = ( component.min )) == null ? '' : __t) +
'" max="' +
((__t = ( component.max )) == null ? '' : __t) +
'" step="' +
((__t = ( component.step )) == null ? '' : __t) +
'" \n            name="fieldValue" class="form-control" >\n        </div>\n        ';
 if (component.hasUnit) {;
__p += '\n            <div class="metadata-unit-div">\n                <select name="fieldUnit" class="form-control"></div>\n            </div>\n        ';
};
__p += '\n</div>\n';

}
return __p
};

this["JST"]["views/templates/metadatafieldselect-form.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="form-group metadataform-group">\n    <label class="metadata-label">' +
((__t = ( component.name )) == null ? '' : __t) +
'</label>\n    <div class="metadata-value-div">\n        <select name="fieldValue" class="form-control"></select>\n    </div>\n    <div class="metadata-clear-div">\n        <a class="deselect"></a>\n    </div>\n    ';
 if (component.hasUnit) {;
__p += '\n    <div class="metadata-unit-div">\n        <select name="fieldUnit" class="form-control">\n    </div>\n</div>\n';
};
__p += '\n</div>';

}
return __p
};

this["JST"]["views/templates/metadatagroup-edit.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h4>\n\n    <a class="remove-me">\n        <span class="fa fa-times-circle"></span>\n    </a>\n\n    ' +
((__t = ( __("group") )) == null ? '' : __t) +
'\n    </br>\n</h4>\n<div class="form-group row">\n    <label for="groupName" class="col-xs-3 control-label">' +
((__t = ( __("metadata-group-name") )) == null ? '' : __t) +
'</label>\n    <div class="col-xs-9">\n        <input text class="form-control" name="name" placeholder="Metadata Group Name" required data-parsley-length"[2,\n            50]">\n    </div>\n</div>\n<div class=\'metadataGroup-body\'></div>\n<div class="row text-center">\n    <div class="btn-group btn-group-margin">\n        <input type="button" class="btn btn-default add-metadata-loop" value="' +
((__t = (__('add-loop') )) == null ? '' : __t) +
'">\n        <input type="button" class="btn btn-info add-metadata-field" value="' +
((__t = (__('add-attribute') )) == null ? '' : __t) +
'">\n    </div>\n</div>';

}
return __p
};

this["JST"]["views/templates/metadatagroup-form.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h4 class="metadatagroup-header">' +
((__t = ( component.name.toUpperCase() )) == null ? '' : __t) +
'</h4>\n<div class="metadatacomponent-body"></div>\n';

}
return __p
};

this["JST"]["views/templates/metadataloop-edit.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h4>\n    ';
 if (!component.name) {;
__p += '\n    <a class="remove-me">\n        <span class="fa fa-times-circle"></span>\n    </a>\n    ';
} ;
__p += '\n    ' +
((__t = ( __("loop") )) == null ? '' : __t) +
'\n    </br>\n</h4>\n<div class="form-group row">\n    <label class="col-xs-3 control-label">' +
((__t = ( __("metadata-loop-name") )) == null ? '' : __t) +
'</label>\n    <div class="col-xs-9">\n        <input text class="form-control" name="name" placeholder="Metadata Loop Name" required data-parsley-length="[2,32]">\n    </div>\n</div>\n<div class="metadataLoop-body"></div>\n<div class="row text-center">\n    <div class="btn-group btn-group-margin">\n        <input type="button" class="btn btn-info add-metadata-field" value="' +
((__t = (__('add-attribute') )) == null ? '' : __t) +
'">\n    </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/metadataloop-form.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h4 class="metadataloop-header">' +
((__t = ( component.name.toUpperCase() )) == null ? '' : __t) +
'</h4>\n<div class="metadataloop-body"></div>\n<div class="text-center">\n    <div class="btn-group btn-group-margin">\n        <input type="button" class="btn btn-info" value="' +
((__t = (__('add-loop') )) == null ? '' : __t) +
'">\n    </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/operator-edit.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h1>' +
((__t = ( __("operator-manager") )) == null ? '' : __t) +
'</h1>\n<h2>' +
((__t = ( data.id ? __("update-operator") : __("create-operator") )) == null ? '' : __t) +
'</h2>\n<div id="content">\n    <form class="form-horizontal edit-operator-form" data-parsley-trigger="focusout" data-parsley-validate role="form" >\n\n      <div class="form-group metadataform-group">\n          <label for="firstName" class="operator-label">' +
((__t = ( __('given-name') )) == null ? '' : __t) +
'</label>\n          <div class="operator-halfinput-div">\n              <input class="form-control" id="firstName" placeholder="Name" name="firstName" required></input>\n          </div>\n      <label for="lastName" class="operator-label">' +
((__t = ( __('surname') )) == null ? '' : __t) +
'</label>\n          <div class="operator-halfinput-div">\n              <input class="form-control" id="lastName" placeholder="Surname" name="lastName" required></input>\n          </div>\n      </div>\n      <div class="form-group metadataform-group">\n          <label for="birthDate" class="operator-label">' +
((__t = ( __('birth-date') )) == null ? '' : __t) +
'</label>\n          <div class="operator-halfinput-div">\n              <input class="form-control" id="birthDate" name="birthDate" placeholder="' +
((__t = ( __('please-select') )) == null ? '' : __t) +
'" required></input>\n          </div>\n      <label for="sex" class="operator-label">' +
((__t = ( __('sex') )) == null ? '' : __t) +
'</label>\n          <div class="operator-halfinput-div">\n            <input class="form-control" id="sex" name="sex">\n          </div>\n      </div>\n      <div class="form-group metadataform-group">\n          <label for="email" class="operator-label">' +
((__t = ( __('email') )) == null ? '' : __t) +
'</label>\n          <div class="operator-input-div">\n              <input name="email" type="email" data-parsley-type="email" class="form-control" id="email" placeholder="ex@example.com" required></input>\n          </div>\n      </div>\n      <div class="form-group metadataform-group">\n          <label for="login" class="operator-label">' +
((__t = ( __('login') )) == null ? '' : __t) +
'</label>\n          <div class="operator-input-div">\n              <input class="form-control" id="login" name="login" placeholder="' +
((__t = ( __('usernaem') )) == null ? '' : __t) +
'" required></input>\n          </div>\n      </div>\n\n      ';
 if(!data.id) { ;
__p += '\n        <div class="form-group metadataform-group">\n            <label for="password" class="operator-label">' +
((__t = ( __('password') )) == null ? '' : __t) +
'</label>\n            <div class="operator-halfinput-div">\n                <input type="password" class="form-control" id="password" name="password" data-parsley-minlength="8" data-parsley-pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})" placeholder="' +
((__t = ( __('min-8-characters')  )) == null ? '' : __t) +
'"></input>\n            </div>\n        <label for="confirmedPassword" class="operator-label">' +
((__t = ( __('confirm-password')  )) == null ? '' : __t) +
'</label>\n            <div class="operator-halfinput-div">\n               <input type="password" class="form-control" id="passwordConfirmed" placeholder="Confirm Password" data-parsley-errors-container=".with-errors" data-parsley-equalto="#password" data-parsley-error-message="Passwords don\'t match">\n              <div class="help-block with-errors"></div>\n            </div>\n        </div>\n\n     ';
 } ;
__p += '\n    <div id="address-information-cnt"></div>\n    <div id="buttonbardiv" class="row text-center">\n      <div class="btn-group btn-group-margin">\n        <input type="submit" id="save" class="btn btn-primary" value="' +
((__t = ( data.id ? __('update-operator') : __('create-operator') )) == null ? '' : __t) +
'" >\n        <!-- <button type="submit" id="save" class="btn btn-primary">' +
((__t = ( data.id ? __('update-operator') : __('create-operator') )) == null ? '' : __t) +
'</button> -->\n        ';
 if(data.id && isWheel) { ;
__p += '\n          <button class="btn btn-danger delete">' +
((__t = ( __('delete'))) == null ? '' : __t) +
'</button>\n          <button class="btn btn-warning password-reset">' +
((__t = ( __('password-reset-btn'))) == null ? '' : __t) +
'</button>\n        ';
 }; ;
__p += '\n      </div>\n    </div>\n</form>\n</div>\n<div class="operator-modal"></div>\n';

}
return __p
};

this["JST"]["views/templates/operator-list.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2 class="legend" align="center">' +
((__t = ( __("operator-list") )) == null ? '' : __t) +
'</h2>\n<div id="list">\n    <div class="table-container">\n        <table class="table striped">\n            <thead>\n                <tr>\n                    <th>' +
((__t = ( __("first-name") )) == null ? '' : __t) +
'</th>\n                    <th>' +
((__t = ( __("last-name") )) == null ? '' : __t) +
'</th>\n                    <th>' +
((__t = ( __("birth-date") )) == null ? '' : __t) +
'</th>\n                    <th>' +
((__t = ( __("sex") )) == null ? '' : __t) +
'</th>\n                    <th>' +
((__t = ( __("email") )) == null ? '' : __t) +
'</th>\n                    <th>' +
((__t = ( __("login") )) == null ? '' : __t) +
'</th>\n                    <th></th>\n                </tr>\n            </thead>\n            <tbody>  ';
 _.each(operators, function(operator) { ;
__p += '\n            <tr>\n                <td class="oper_val">' +
((__t = ( operator.get("firstName") )) == null ? '' : __t) +
'</td>\n                <td class="oper_val">' +
((__t = ( operator.get("lastName") )) == null ? '' : __t) +
'</td>\n                <td class="oper_val">' +
((__t = ( moment(operator.get("birthDate")).format("DD/MM/YYYY") )) == null ? '' : __t) +
'</td>\n                <td class="oper_val">' +
((__t = ( operator.get("sex") )) == null ? '' : __t) +
'</td>\n                <td class="oper_val">' +
((__t = ( operator.get("email") )) == null ? '' : __t) +
'</td>\n                <td class="oper_val">' +
((__t = ( operator.get("login") )) == null ? '' : __t) +
'</td>\n                <td>\n                  <div class="btn-group btn-group-sm" role="group" style="margin-top:0.5vh;">\n                  <a type="button" class="btn btn-info" id="edit" href="#/operators/edit/' +
((__t = ( operator.id )) == null ? '' : __t) +
'">' +
((__t = (__("edit") )) == null ? '' : __t) +
'</a>\n                </div>\n              </td>\n            </tr>\n            ';
 }) ;
__p += '\n            </tbody>\n        </table>\n    </div>\n    <div id="buttonbardiv" class="row text-center">\n        <a href="#/operators/new" class="btn btn-primary">' +
((__t = ( __("new-operator"))) == null ? '' : __t) +
'</a>\n    </div>\n     </div>\n';

}
return __p
};

this["JST"]["views/templates/pagination-bar.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="col-sm-6 text-left" style="margin-top:2%;">\n  ';
 if (headers['X-Total-Count'] !== 0 && (headers.notFiltered === DEFAULT_LIMIT || rowsLenght < DEFAULT_LIMIT) ){;
__p += '\n    Showing ' +
((__t = ( headers['startRow'])) == null ? '' : __t) +
' to\n    ';
 if (rowsLenght < DEFAULT_LIMIT) {;
__p += '\n      ' +
((__t = ( headers['X-Total-Count'])) == null ? '' : __t) +
'\n      ';
}
      else {;
__p += '\n        ' +
((__t = ( headers['endRow'])) == null ? '' : __t) +
'\n        ';
};
__p += '\n    of ' +
((__t = ( headers['X-Total-Count'])) == null ? '' : __t) +
' rows\n  ';
}
  else if (headers['X-Total-Count'] !== 0 && headers.notFiltered < DEFAULT_LIMIT && headers.notFiltered > 0 ){;
__p += '\n  Showing ' +
((__t = ( headers['startRow'])) == null ? '' : __t) +
' to ' +
((__t = ( headers['endRow'])) == null ? '' : __t) +
' of ' +
((__t = ( headers['X-Total-Count'])) == null ? '' : __t) +
' rows (' +
((__t = ( DEFAULT_LIMIT - headers.notFiltered )) == null ? '' : __t) +
' filtered by Project)\n  ';
}
  else{;
__p += '\n    ' +
((__t = ( headers['X-Total-Count'])) == null ? '' : __t) +
' rows\n  ';
};
__p += '\n\n</div>\n<div id="pagination" class="col-sm-6 text-right">\n  <ul class="pagination">\n    <li><a id="first" class="pagin btn btn-link">' +
((__t = ( __("first"))) == null ? '' : __t) +
'</a></li>\n    <li><a id="previous" class="pagin btn btn-link">' +
((__t = ( __("prev"))) == null ? '' : __t) +
'</a></li>\n    <li><a class="btn btn-default">\n      ';
 if (headers['X-Total-Count'] !== 0) {;
__p += '\n      ' +
((__t = ( headers['X-Current-Page'])) == null ? '' : __t) +
' of ' +
((__t = ( headers['X-Total-Pages'])) == null ? '' : __t) +
'\n      ';
}
      else{;
__p += '\n        ' +
((__t = ( headers['X-Total-Pages'])) == null ? '' : __t) +
'\n      ';
};
__p += '\n    </a></li>\n    <li><a id="next" class="pagin btn btn-link">' +
((__t = ( __("next"))) == null ? '' : __t) +
'</a></li>\n    <li><a id="last" class="pagin btn btn-link">' +
((__t = ( __("last"))) == null ? '' : __t) +
'</a></li>\n  </ul>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/personaldetails-details.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div class="row margin-row">\n    <label for="givenName" class="data-label">' +
((__t = ( __('given-name') )) == null ? '' : __t) +
'</label>\n    <div class="data-input-div">\n        <span  class="data-span" id="givenName" name="givenName" ></span>\n    </div>\n</div>\n<div class="row margin-row">\n    <label for="surname" class="data-label">' +
((__t = ( __('surname') )) == null ? '' : __t) +
'</label>\n    <div class="data-input-div">\n        <span  class="data-span" id="surname" name="surname" ></span>\n    </div>\n</div>\n<div class="row margin-row">\n    <label for="notes" class="data-label">' +
((__t = ( __('birth-date') )) == null ? '' : __t) +
'</label>\n    <div class="data-input-div">\n        <div id="birthDate" name="birthDate" class="data-span" ></div>\n    </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/personaldetails-edit.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="row text-center">\n  <h3>' +
((__t = ( __('personal-details'))) == null ? '' : __t) +
'</h3>\n</div>\n';
 if( !data.id) {;
__p += '\n<div class="row text-center">\n  <i style="margin-right:1em;" class="fa fa-info-circle"></i></i>' +
((__t = ( __('personal-details-info-message'))) == null ? '' : __t) +
'\n</div>\n';
};
__p += '\n<div class="form-group"></div>\n<div class="form-group metadataform-group">\n    <label for="givenName" class="data-label">' +
((__t = ( __('given-name') )) == null ? '' : __t) +
'</label>\n    <div class="data-input-div">\n        <input text class="form-control personaldetails-input" id="givenName" name="givenName"></input>\n    </div>\n</div>\n<div class="form-group metadataform-group">\n    <label for="surname" class="data-label">' +
((__t = ( __('surname') )) == null ? '' : __t) +
'</label>\n    <div class="data-input-div">\n        <input text class="form-control personaldetails-input" id="surname" name="surname"></input>\n    </div>\n</div>\n<div class="form-group metadataform-group">\n    <label for="birth-date" class="data-label">' +
((__t = ( __('birth-date') )) == null ? '' : __t) +
'</label>\n    <div class="data-input-div">\n        <input text class="form-control personaldetails-input" id="birthDate" name="birthDate" placeholder="' +
((__t = ( __('please-select') )) == null ? '' : __t) +
'"></input>\n    </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/progressbar.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div style="min-height:100px;" class="text-center">\n  <!-- <div class="progress-bar progress-bar-striped active" role="progressbar"\n      aria-valuenow="' +
((__t = ( valuenow || 100 )) == null ? '' : __t) +
'" aria-valuemin="' +
((__t = ( valuemin || 0 )) == null ? '' : __t) +
'" aria-valuemax="' +
((__t = ( valuemax || 100 )) == null ? '' : __t) +
'"\n      style="width:' +
((__t = ( valuenow || 100 )) == null ? '' : __t) +
'%">\n  </div> -->\n  <img draggable="false" src="/images/triangle-spinner.gif" width="300" height="200">\n</div>\n';

}
return __p
};

this["JST"]["views/templates/project-edit.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div id="project">\n\n  <form name="Myform" class="form-horizontal edit-project-form" role="form" data-parsley-trigger="focusout"\n    data-parsley-validate>\n\n    <legend class="legend text-center">\n      ' +
((__t = ( project ? 'Edit' : 'New' )) == null ? '' : __t) +
' Project</legend>\n    <div class="form-group row">\n\n      <div class="col-md-7">\n        <h4 class="text-center">' +
((__t = ( __("project"))) == null ? '' : __t) +
' ' +
((__t = ( __('details') )) == null ? '' : __t) +
'</h4>\n        <div class="form-group row">\n          <label for="name" class="col-md-3 control-label">' +
((__t = ( __("name") )) == null ? '' : __t) +
'</label>\n          <div class="col-md-6">\n            <input required class="form-control" name="name" id="name" type="text"\n              value="' +
((__t = ( project ? project.get('name') : '' )) == null ? '' : __t) +
'">\n          </div>\n        </div>\n\n        <div class="form-group row">\n          <label for="description" class="col-md-3 control-label">' +
((__t = ( __("description") )) == null ? '' : __t) +
'</label>\n          <div class="col-md-9">\n            <input class="form-control" name="description" id="description"></input>\n          </div>\n        </div>\n\n        <div class="form-group row">\n          <label for="biobanks" class="col-md-3 control-label">' +
((__t = ( __("biobanks") )) == null ? '' : __t) +
'</label>\n          <div class="col-md-9">\n            <select multiple class="form-control" id="biobanks" name="biobanks"></select>\n          </div>\n        </div>\n        <div class="form-group row">\n          <label for="owner" class="col-md-3 control-label">' +
((__t = ( __("owner") )) == null ? '' : __t) +
'</label>\n          <div class="col-md-9">\n            <select class="form-control" id="owner" name="owner"></select>\n          </div>\n        </div>\n      </div>\n\n      <div class="col-md-5">\n        <div class="form-group row">\n          <h4 class="text-center"> ' +
((__t = (assDt && assDt.length)) == null ? '' : __t) +
' ' +
((__t = ( __("associated"))) == null ? '' : __t) +
' ' +
((__t = ( __('data-types') )) == null ? '' : __t) +
'</h4>\n          <div class="center col-md-12 Table">\n            <div id="associatedDataTypes" class="targetDt">\n              ';
 if ( assDt && assDt.length > 0) {
                assDt.forEach(function(dt, i) { ;
__p += '\n              <a data-toggle="tooltip" data-placement="right" title="Edit ' +
((__t = (dt.name)) == null ? '' : __t) +
'" class="text-center"\n                value="' +
((__t = ( dt.id )) == null ? '' : __t) +
'" href="#/datatypes/edit/' +
((__t = ( dt.id)) == null ? '' : __t) +
' ">' +
((__t = ( dt.name )) == null ? '' : __t) +
'</a>\n              ';
 })} ;
__p += '\n            </div>\n          </div>\n        </div>\n      </div>\n\n    </div>\n\n    <div class="form-group row">\n      <h4 class="text-center"> ' +
((__t = ( __('groups') )) == null ? '' : __t) +
' </h4>\n      <div id="labelGroupNotAssociated" class="col-md-5 col-md-offset-1 text-center">\n        <p> <label for="noassociatedGroups" id="label" class="control-label">' +
((__t = ( __("no-associated"))) == null ? '' : __t) +
'</label></p>\n      </div>\n      <div id="labelGroupAssociated" class="col-md-5 col-md-offset-1 text-center">\n        <p> <label for="associatedGroups" class="control-label" id="label">' +
((__t = ( __("associated"))) == null ? '' : __t) +
'</label></p>\n      </div>\n    </div>\n\n    <div class="form-group row">\n\n      <div class="col-md-5 col-md-offset-1 Table">\n        <ul id="noassociatedGroups" class="source">\n          ';
 if (noAssGr && noAssGr.length > 0) {
                  noAssGr.forEach(function(gr, i) { ;
__p += '\n          <li class="text-center" draggable="true" value="' +
((__t = ( gr.id )) == null ? '' : __t) +
' ">' +
((__t = ( gr.name )) == null ? '' : __t) +
'</li>\n          ';
 })} ;
__p += '\n        </ul>\n      </div>\n      <div class="col-md-5 col-md-offset-1 Table">\n        <ul id="associatedGroups" class="target">\n          ';
 if ( assGr && assGr.length > 0) {
                  assGr.forEach(function(gr, i) { ;
__p += '\n          <li class="text-center" draggable="true" value="' +
((__t = ( gr.id )) == null ? '' : __t) +
' ">' +
((__t = ( gr.name )) == null ? '' : __t) +
'</li>\n          ';
 })} ;
__p += '\n        </ul>\n      </div>\n\n    </div>\n\n\n    <div id="buttonbardiv" class="row text-center">\n      <div class="btn-group btn-group-margin">\n        <input type="submit" id="save" class="btn btn-primary" value="' +
((__t = ( __('save-project') )) == null ? '' : __t) +
'">\n        ';
 if(project) { ;
__p += '\n        <input type="hidden" name="id" value="' +
((__t = ( project.id )) == null ? '' : __t) +
'" />\n        <button id="delete" data-project-id="' +
((__t = ( project.id )) == null ? '' : __t) +
'"\n          class="btn btn-danger delete">' +
((__t = ( __('delete') )) == null ? '' : __t) +
'</button>\n        ';
 }; ;
__p += '\n      </div>\n    </div>\n\n  </form>\n</div>\n<div class="project-modal"></div>';

}
return __p
};

this["JST"]["views/templates/project-list.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2 class="legend" align="center">' +
((__t = ( __("project-list") )) == null ? '' : __t) +
'</h2>\n<div id="list">\n  <div class="table-container">\n    <table class="table striped">\n      <thead>\n\n        <tr>\n          <th>\n            ' +
((__t = ( __("name") )) == null ? '' : __t) +
'\n          </th>\n          <th>' +
((__t = ( __("actions") )) == null ? '' : __t) +
'</th>\n        </tr>\n      </thead>\n      <script type="text/css">\n        tbody{ background-color:blue; }\n      </script>\n\n\n      <tbody>\n        ';
 _.each(projects, function(project) { ;
__p += '\n          <tr>\n            <td class="project_val">' +
((__t = ( project.get("name") )) == null ? '' : __t) +
'</td>\n            <td class="text-right">\n              <div class="btn-group btn-group-sm" role="group" style="margin-top:0.5vh;">\n              <a type="button" class="btn btn-info" id="edit" href="#/projects/edit/' +
((__t = ( project.id )) == null ? '' : __t) +
'">\n                ' +
((__t = (__("edit") )) == null ? '' : __t) +
'\n              </a>\n              <a type="button" class="btn btn-primary" id="groups" href="#/groups?projects=' +
((__t = ( project.get('name') )) == null ? '' : __t) +
'">\n                ' +
((__t = (__("member-groups") )) == null ? '' : __t) +
'\n              </a>\n\n              <a type="button" class="btn btn-primary" id="dataTypes" href="#/datatypes?project=' +
((__t = ( project.id )) == null ? '' : __t) +
'">\n                ' +
((__t = (__("associated-data-type") )) == null ? '' : __t) +
'\n              </a>\n            </div>\n\n            </td>\n\n\n          </tr>\n          ';
 }) ;
__p += '\n      </tbody>\n    </table>\n  </div>\n  <div id="buttonbardiv" class="row text-center">\n    <a href="#/projects/new" class="btn btn-primary">\n      ' +
((__t = ( __("new-project"))) == null ? '' : __t) +
'\n    </a>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/project-modal.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="modal fade">\n  <div class="modal-dialog">\n    <div class="modal-content">\n\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span\n            aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title">' +
((__t = (__('default-title') )) == null ? '' : __t) +
'</h4>\n      </div>\n\n      <div class="modal-body">\n\n        <div class="row text-center">\n\n          <i class=\'fa fa-exclamation-triangle fa-lg\' />\n          ' +
((__t = ( __('warning-change-project') )) == null ? '' : __t) +
'\n          <div class="checkbox">\n            <label>\n              <input id="checkbox" type="checkbox" value="">\n              ' +
((__t = ( __('ok') )) == null ? '' : __t) +
', ' +
((__t = ( __('i-confirm') )) == null ? '' : __t) +
'\n            </label>\n          </div>\n        </div>\n        <div class="row text-center">\n          <div class="col-md-offset-2 col-md-8">\n            <div class="form-group">\n              <select id=\'project-selector\' class="form-control selectpicker" title="' +
((__t = (__('please-select-a-project'))) == null ? '' : __t) +
'"\n                data-live-search="true">\n                ';
 if (xtens.session.get("isWheel") && xtens.session.get('activeProject')!=='all') {;
__p += '\n                <option value=\'all\'>' +
((__t = (__("all-projects"))) == null ? '' : __t) +
'</option>\n                ';
}
              _.each(projects, function(project) {
                  var name = project.name ? project.name : project.get("name");
                  if(name!==xtens.session.get('activeProject')){;
__p += '\n                <option value=\'' +
((__t = ( name )) == null ? '' : __t) +
'\'>' +
((__t = ( name )) == null ? '' : __t) +
'</option>\n                ';
};
__p += '\n              ';
}) ;
__p += '\n              </select>\n            </div>\n          </div>\n        </div>\n\n      </div>\n\n      <div class="modal-footer">\n        <button disabled id="confirm-project" type="button" class="btn btn-">' +
((__t = ( __('change-project') )) == null ? '' : __t) +
'</button>\n      </div>\n\n    </div>\n  </div>\n</div>';

}
return __p
};

this["JST"]["views/templates/query-builder-loop.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="form-group">\n    <span class="query-label">' +
((__t = ( __("loop-name") )) == null ? '' : __t) +
'</span>\n    <div class="query-field-div">\n        <select name="loop-name" class="form-control"></select>\n    </div>\n</div>\n<div class="query-loop-body"></div>\n';

}
return __p
};

this["JST"]["views/templates/query-builder.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="row">\n  <div class="col-md-6">\n    <h2>' +
((__t = ( __("query-builder") )) == null ? '' : __t) +
'</h2>\n  </div>\n  <div class="col-md-6" style="margin-top: 20px !important; padding: 0px !important;">\n    <div class="query-selector-cnt col-md-offset-3 col-md-9" style="padding: 0px !important;"></div>\n  </div>\n</div>\n\n<div id="content">\n  <div class="row">\n    <div class="query-builder">\n      <form id="query-form" class="form-horizontal query-form" role="form" data-parsley-focus="first" data-parsley-trigger="input" data-parsley-validate>\n        <div id="buttonbardiv" class="row text-center">\n          <div class="btn-group btn-group-margin">\n            <input type="submit" id="search" class="btn btn-primary" value="' +
((__t = (__('search') )) == null ? '' : __t) +
'">\n            <input type="submit" class="btn btn-default query-reset-all" value="' +
((__t = (__('reset') )) == null ? '' : __t) +
'">\n          </div>\n        </div>\n      </form>\n    </div>\n  </div>\n  <div id="result-table-cnt" class="row"></div>\n\n  <div id="queryNoResultCnt" class="has-warning query-hidden">\n    <span class="control-label col-sm-4">\n            <strong> ' +
((__t = ( __("no-data-was-found-to-match-your-search-options") )) == null ? '' : __t) +
' </strong> <br />\n            <strong> ' +
((__t = ( __("please-try-again-with-different-parameters") )) == null ? '' : __t) +
'</strong>\n        </span>\n  </div>\n\n  <div id="queryErrorCnt" class="has-error query-hidden">\n    <span class="control-label col-sm-4">\n            <strong> ' +
((__t = ( __("the-query-is-not-correctly-composed") )) == null ? '' : __t) +
' </strong> <br />\n            <strong> ' +
((__t = ( __("please-check-it-and-submit-it-again") )) == null ? '' : __t) +
'</strong>\n        </span>\n  </div>\n\n  <!-- Div for BOOTSTRAP Dialog -->\n  <div class="query-modal"></div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/query-composite.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="form-group query-row">\n    <span class="query-label">' +
((__t = ( __("search-for:") )) == null ? '' : __t) +
'</span>\n    <div class="query-field-div">\n        <select name="pivot-data-type" class="form-control"></select>\n    </div>\n    <span class="query-label">' +
((__t = ( __("matching:"))) == null ? '' : __t) +
'</span>\n    <div class="query-field-div-small">\n        <select name="junction" class="form-control"></select>\n    </div>\n    <div class="btn-group">\n        <button name="add-field" type="button" class="btn btn-info hidden">' +
((__t = ( __("add-field") )) == null ? '' : __t) +
'</button>\n        <button name="add-loop" type="button" class="btn btn-info hidden">' +
((__t = ( __("add-loop-condition") )) == null ? '' : __t) +
'</button>\n        <button name="add-nested" type="button" class="btn btn-primary hidden">' +
((__t = ( __("add-nested-condition") )) == null ? '' : __t) +
'</button>\n        ';
 if(isFirst){;
__p += '\n          <button name="multi-search" type="button" value ="False" class="btn btn-danger hidden">' +
((__t = ( __("multi-project-serach") )) == null ? '' : __t) +
'</button>\n        ';
}
        else { ;
__p += '\n          <button name="get-metadata" type="button" value ="False" class="btn btn-default hidden"><i class="fa fa-check"></i>' +
((__t = ( __("get-metadata") )) == null ? '' : __t) +
'</button>\n        ';
 } ;
__p += '\n        <button name="clear-me" class="btn clear-me hidden"><span class="fa fa-times-circle"></span></button>\n    </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/query-generic-row-unit.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<select multiple size="8" name="unit" data-live-search="true" data-selected-text-format="count > 2" data-actions-box="true" title="' +
((__t = (__('select-unit'))) == null ? '' : __t) +
'" class="selectpicker">\n';
_.each(data, function(d) {;
__p += '\n    <option value=\'' +
((__t = ( d.id )) == null ? '' : __t) +
'\'>' +
((__t = ( d.text )) == null ? '' : __t) +
'</option>\n';
});
__p += '\n</select>\n';

}
return __p
};

this["JST"]["views/templates/query-generic-row.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<span class="query-label">' +
((__t = ( __("field-name") )) == null ? '' : __t) +
'</span>\n<div class="query-field-div">\n    <select name="field-name" class="form-control"></select>\n</div>\n<div class="query-comparator">\n    <input type="text" name="comparator"  class="form-control hidden">\n</div>\n<div name="query-value-div" class="query-value-div"></div>\n<div class="query-unit-div"></div>\n<div class="btn-group">\n    <button class="btn remove-me-field"><span class="fa fa-times-circle"></span></button>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/query-personalinfo-fields.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="query-row form-group">\n    <span class="query-label">' +
((__t = ( __("surname") )) == null ? '' : __t) +
'</span>\n    <div class="query-comparator">\n        <input type="hidden" name="surname-comparator" class="form-control">\n    </div>\n    <div name="query-value-div" class="query-value-div">\n        <input text name="surname" class="form-control">\n    </div>\n    <span class="query-label">' +
((__t = ( __("given-name") )) == null ? '' : __t) +
'</span>\n    <div class="query-comparator">\n        <input type="hidden" name="given-name-comparator" class="form-control">\n    </div>\n    <div name="query-value-div" class="query-value-div">\n        <input text name="given-name" class="form-control">\n    </div>\n</div>\n<div class="query-row form-group">\n    <span class="query-label">' +
((__t = ( __("birth-date") )) == null ? '' : __t) +
'</span>\n    <div class="query-comparator">\n        <input type="hidden" name="birth-date-comparator" class="form-control">\n    </div>\n    <div name="bith-date-div" class="query-value-div">\n        <input text name="birth-date" class="form-control" placeholder="DD/MM/YYYY">\n    </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/query-sample-fields.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="query-row form-group">\n    <span class="query-label">' +
((__t = ( __("biobank") )) == null ? '' : __t) +
'</span>\n    <div class="query-comparator">\n        <input type="hidden" name="biobank-comparator" class="form-control">\n    </div>\n    <div name="biobank-div" class="query-value-div">\n        <select name="biobank" class="form-control"></select>\n    </div>\n    <span class="query-label">' +
((__t = ( __("biobank-code") )) == null ? '' : __t) +
'</span>\n    <div class="query-comparator">\n        <input type="hidden" name="biobank-code-comparator" class="form-control">\n    </div>\n    <div name="code-div" class="query-value-div">\n        <input text name="biobank-code" class="form-control">\n    </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/query-save-modal.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="modal fade">\n  <div class="modal-dialog">\n    <div class="modal-content">\n\n      <div class="modal-header">\n        <h4 class="modal-title">' +
((__t = (__('default-title') )) == null ? '' : __t) +
'</h4>\n      </div>\n\n      <div class="modal-body">\n\n        <div class="row text-center">\n          <div class="col-md-offset-2 col-md-8">\n            <div class="form-inline" style="margin-bottom: 5px;">\n              <label for="">' +
((__t = ( __('query-name'))) == null ? '' : __t) +
' </label>\n              <input type="text" class="form-control query-name">\n            </div>\n            <small id="inputHelpBlock" class="form-text text-muted text-warning" hidden>' +
((__t = ( __('name-yet-present'))) == null ? '' : __t) +
' </small>\n          </div>\n        </div>\n\n        <div class="modal-footer">\n          <button disabled type="button" class="btn btn-success query-confirm-save">' +
((__t = ( __('save') )) == null ? '' : __t) +
'</button>\n        </div>\n\n      </div>\n    </div>\n  </div>\n';

}
return __p
};

this["JST"]["views/templates/query-selector.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="input-group">\n  <div class="input-group-addon">\n    ' +
((__t = ( __("query-selector") )) == null ? '' : __t) +
'\n  </div>\n  <select class="form-control query-selector selectpicker" data-live-search="true" title="' +
((__t = (__('select-a-query'))) == null ? '' : __t) +
'">\n    ';
_.each(queries, function(obj) {
      if(obj.name && obj.query){;
__p += '\n      <option value=\'' +
((__t = ( obj.query  )) == null ? '' : __t) +
'\'>' +
((__t = ( obj.name )) == null ? '' : __t) +
'</option>\n      ';
};
__p += '\n    ';
}) ;
__p += '\n  </select>\n  <div class="input-group-btn">\n    <!-- <button class="btn btn-default load-query" data-toggle="tooltip" data-placement="top" title="' +
((__t = ( __('load-query'))) == null ? '' : __t) +
'"><i class="fa fa-download" aria-hidden="true"></i></button> -->\n    <button class="btn btn-danger delete-query" data-toggle="tooltip" data-placement="top" title="' +
((__t = ( __('delete-query'))) == null ? '' : __t) +
'"><i class="fa fa-trash" aria-hidden="true"></i></button>\n    <button class="btn btn-success save-query" data-toggle="tooltip" data-placement="top" title="' +
((__t = ( __('save-query'))) == null ? '' : __t) +
'"><i class="fa fa-floppy-o" aria-hidden="true"></i></button>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/query-subject-fields.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="query-row form-group">\n    <span class="query-label">' +
((__t = ( __("subject-code") )) == null ? '' : __t) +
'</span>\n    <div class="query-comparator">\n        <input type="hidden" name="code-comparator" class="form-control">\n    </div>\n    <div name="code-div" class="query-value-div">\n        <input text name="code" class="form-control">\n    </div>\n    <span class="query-label">' +
((__t = ( __("sex") )) == null ? '' : __t) +
'</span>\n    <div class="query-comparator">\n        <input type="hidden" name="sex-comparator" class="form-control">\n    </div>\n    <div name="query-value-div" class="query-value-div">\n        <input type="hidden" name="sex" class="form-control">\n    </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/sample-details.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h1>\n    ' +
((__t = ( __("data-details") )) == null ? '' : __t) +
'\n</h1>\n\n<div id="content">\n    <div class="container data-header-cnt">\n        <div id="data-header-row" class="row data-header-row">\n            <div id="data-header" class="col-md-offset-2 col-md-6">\n                <div class="row margin-row">\n                    <label for="biobank" class="data-label">\n                        ' +
((__t = ( __("biobank") )) == null ? '' : __t) +
': </label>\n                    <span class="data-span">\n                        ' +
((__t = ( data.get("biobank").acronym )) == null ? '' : __t) +
'\n                    </span>\n                </div>\n\n                <div class="row margin-row">\n                    <label for="biobank-code" class="data-label">\n                        ' +
((__t = ( __("biobank-code") )) == null ? '' : __t) +
': </label>\n                    <span class="data-span">\n                        ' +
((__t = ( data.get("biobankCode") )) == null ? '' : __t) +
'\n                    </span>\n                </div>\n\n                <div class="row margin-row">\n\n                    ';
 if (data.get("donor") && data.get("donor").length > 0) {;
__p += '\n                    <label for="donor" class="data-label">\n                        ' +
((__t = (  data.get("donor").length === 1 ? __("donor") : __("donors") )) == null ? '' : __t) +
': </label>\n                    <span class="data-span">\n                        ' +
((__t = (_.map(data.get("donor"), "code").join(",") )) == null ? '' : __t) +
'\n                    </span>\n                    ';
} ;
__p += '\n\n                    ';
 if (data.get("parentSample") && data.get("parentSample").length > 0) {;
__p += '\n                    <label for="parentSample" class="data-label">\n                        ' +
((__t = ( data.get("parentSample").length === 1 ?  __("sample") :  __("samples") )) == null ? '' : __t) +
': </label>\n                    <span class="data-span">\n                        ' +
((__t = ( _.map(data.get("parentSample"), "biobankCode").join(",") )) == null ? '' : __t) +
'\n                    </span>\n                    ';
} ;
__p += '\n\n                </div>\n                <div class="row margin-row">\n                    <label for="dataType" class="data-label">\n                        ' +
((__t = ( __("data-type") )) == null ? '' : __t) +
'\n                    </label>\n                    <div class="data-input-div">\n                        <div class="" id="dataType" name="dataType">\n                            ' +
((__t = ( data.get("type").name )) == null ? '' : __t) +
'\n                        </div>\n                    </div>\n                </div>\n                <div class="row margin-row">\n                    <label for="date" class="data-label">\n                        ' +
((__t = ( __('date') )) == null ? '' : __t) +
'\n                    </label>\n                    <div class="data-input-div">\n                        <div text class="" id="date" name="date"></div>\n                    </div>\n                </div>\n                <div class="row margin-row">\n                    <label for="tags" class="data-label">\n                        ' +
((__t = ( __('tags') )) == null ? '' : __t) +
'\n                    </label>\n                    <div class="data-input-div">\n                        <div type="hidden" class="" id="tags" name="tags"></div>\n                    </div>\n                </div>\n                <div class="row margin-row">\n                    <label for="notes" class="data-label">\n                        ' +
((__t = ( __('notes') )) == null ? '' : __t) +
'\n                    </label>\n                    <div class="data-input-div">\n                        <div class="" id="notes" name="notes" rows="4"></div>\n                    </div>\n                </div>\n            </div>\n            <div id="file-header" class="col-md-4">\n                ';
 var files = data.get("files"); ;
__p += '\n                ';
 if (files.length) { ;
__p += '\n                <h4>\n                    ' +
((__t = (__("file-list"))) == null ? '' : __t) +
'\n                </h4>\n                ';
 _.each(files, function(file) {;
__p += '\n                <div class="input-group margin-bottom-sm">\n                    <span class="input-group-addon"><i class="fa fa-file"></i></span>\n                    <div class="form-control" type="text">\n                        ';
 var fileFragments = file.uri.split(PATH_SEPARATOR); ;
__p += '\n                        ' +
((__t = ( fileFragments[fileFragments.length - 1 ] )) == null ? '' : __t) +
'\n                    </div>\n                </div>\n                ';
});
                };
__p += '\n            </div>\n        </div>\n    </div>\n    <div id="metadata-schema" class="metadata-schema">\n        <div id="metadata-body" class="metadata-body">\n            ';
 var metadata = data.get("metadata"), value, values, unit;
                var fieldsGroups = _.groupBy(fields, '_group');
                _.forEach(fieldsGroups, function(fields, groupName) {;
__p += '\n            <div class="metadatagroup span7 center">\n                <h4 class="metadatagroup-header text-uppercase">\n                    ' +
((__t = ( groupName )) == null ? '' : __t) +
'\n                </h4>\n                <div class="metadatacomponent-body">\n                    ';
 
                        var loopsGroups = _.groupBy(fields, '_loop');
                        if (loopsGroups['undefined'] && loopsGroups['undefined'].length > 0) { 
                        _.each(loopsGroups['undefined'], function(field,index) {;
__p += '\n                    <!--\n          ';
 var groupname = field._group ;
__p += '\n            -->\n\n                    ';
 if (!field.sensitive || xtens.session.get('canAccessSensitiveData') ) {;
__p += '\n                    <div class="row margin-row">\n                        <span name="metadata-name" class="col-md-4 text-right" style="padding-left:29px">\n                            ' +
((__t = (field.name)) == null ? '' : __t) +
'\n                        </span>\n                        <div class="col-md-5 text-left">\n\n                            ';
 value =  metadata[field.formattedName] ? metadata[field.formattedName].value : null;
                                if (field.fieldType==="Date" && value != null){value=moment(value).lang("it").format('L');}
                                unit = metadata[field.formattedName] ? metadata[field.formattedName].unit : null; ;
__p += '\n                            <div name="metadata-value" class="data-value">\n                                ' +
((__t = ( value && unit ? value + " [" + unit + "]" :
                                    value ? value : "" )) == null ? '' : __t) +
'\n                            </div>\n                        </div>\n                    </div>\n                    ';
}});;
__p += '\n                </div>\n            </div>\n            ';

            } 
            if (loopsGroups['true'] && loopsGroups['true'].length > 0) {
                var maxLoopNumber = _.max(_.map(_.filter(metadata, function(m) {return m.group == groupName && m.loop; }), function (a) {return a.values ? a.values.length : 0})) 
                maxLoopNumber = maxLoopNumber > 0 ? maxLoopNumber : 1;
                for (let index = 1; index <= maxLoopNumber; index++) {;
__p += '\n\n            <div class="metadatagroup span7 center">\n                ';
var loopGroupName = _.filter(metadata, function(m) {return m.group == groupName && m.loop; })
                            if(loopGroupName.length > 0) {;
__p += '\n                <h4 class="metadatagroup-header text-uppercase">\n                    ' +
((__t = ( _.filter(metadata, function(m) {return m.group == groupName && m.loop; })[0].loop )) == null ? '' : __t) +
'\n                    #' +
((__t = (index )) == null ? '' : __t) +
'\n                </h4>\n                <div class="metadatacomponent-body">\n                    ';
};
__p += '\n    \n                                ';

    
                                _.each(loopsGroups['true'], function(field) {;
__p += '\n                    <!--\n                      ';
 var groupname = field._group ;
__p += '\n                        -->\n\n                    ';
 if (!field.sensitive || xtens.session.get('canAccessSensitiveData') ) {;
__p += '\n                    <div class="row margin-row">\n                        <span name="metadata-name" class="col-md-4 text-right" style="padding-left:29px">\n                            ' +
((__t = (field.name)) == null ? '' : __t) +
'\n                        </span>\n                        <div class="col-md-5 text-left">\n\n                            ';
 values = metadata[field.formattedName] ? metadata[field.formattedName].values : null;;
__p += '\n                            <div name="metadata-value" class="data-value">\n                                ' +
((__t = ( values && values[index-1] ? values[index-1] : null )) == null ? '' : __t) +
'\n                            </div>\n                        </div>\n                    </div>\n                    ';
}
                                });
                                if(loopGroupName.length > 0) {;
__p += '\n                </div>\n                ';
};
__p += '\n                        </div>\n    \n                        ';
  }}
                                });;
__p += '\n            </div>\n        </div>\n    </div>';

}
return __p
};

this["JST"]["views/templates/sample-edit.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h1>' +
((__t = ( __("sample-manager") )) == null ? '' : __t) +
'</h1>\n<h2>' +
((__t = ( data.id ? __("edit-sample") : __("create-sample") )) == null ? '' : __t) +
'</h2>\n<div id="content">\n    <form class="form-horizontal edit-sample-form" role="form" data-parsley-focus="first"\n        data-parsley-trigger="focusout" data-parsley-validate>\n        <div class="container data-header-cnt">\n            <div id="data-header-row" class="row data-header-row">\n                <div id="data-header" class="data-header-col">\n                    <div class="form-group"></div>\n                    <!-- Biobank Selection -->\n                    <div class="form-group metadataform-group">\n                        <label for="type" class="data-label">' +
((__t = ( __('biobank') )) == null ? '' : __t) +
'</label>\n                        <div class="data-input-div">\n                            <select class="form-control" id="biobank" name="biobank"></select>\n                        </div>\n                    </div>\n                    <div class="form-group metadataform-group">\n                        <label for="type" class="data-label">' +
((__t = ( __('data-type') )) == null ? '' : __t) +
'</label>\n                        <div class="data-input-div">\n                            <select class="form-control" id="data-type" name="data-type" required></select>\n                        </div>\n                    </div>\n                    <div class="form-group metadataform-group">\n                        <label for="biobank-code" class="data-label">' +
((__t = ( __('biobank-code') )) == null ? '' : __t) +
'</label>\n                        <div class="data-input-div" style="width:auto;">\n                            <input text class="form-control" id="biobank-code" name="biobank-code"></input>\n                        </div>\n                        <div class="input-group-append">\n                            <span class="input-group-text barcode-cnt" data-toggle="tooltip" title="Print Barcode"\n                                id="basic-addon2"><img style="height: 6vh; cursor:pointer;" id="barcode"></span>\n                        </div>\n                    </div>\n                    <div class="form-group metadataform-group">\n                        <label for="owner" class="col-md-2 data-label">' +
((__t = ( __("owner") )) == null ? '' : __t) +
'</label>\n                        <div class="data-input-div">\n                            <select disabled class="form-control" id="owner" name="owner" required></select>\n                        </div>\n                    </div>\n                    <div class="form-group metadataform-group">\n                        <label for="donor"\n                            class="data-label">' +
((__t = ( data.get("donor") && data.get("donor").length > 0 ? __('donor') : __('donors') )) == null ? '' : __t) +
'</label>\n                        <span\n                            class="data-span">' +
((__t = ( data.get("donor") && data.get("donor").length > 0 ? _.map(data.get("donor"), "code").join(",") : __("select-a-type") )) == null ? '' : __t) +
'</span>\n                        <button disabled id="editDonor" class="btn btn-danger">' +
((__t = ( __("edit-donor") )) == null ? '' : __t) +
'</button>\n                    </div>\n                    ';
 if (data.get("parentSample") && data.get("parentSample").length > 0) {;
__p += '\n                    <div class="form-group metadataform-group">\n                        <label for="parent-sample"\n                            class="data-label">' +
((__t = ( data.get("parentSample").length === 1 ?  __("parent-sample") :  __("parent-samples") )) == null ? '' : __t) +
'\n                        </label>\n                        <span class="data-span">' +
((__t = ( _.map(data.get("parentSample"), "biobankCode").join(",") )) == null ? '' : __t) +
'</span>\n                    </div>\n                    ';
} ;
__p += '\n                    <div class="form-group metadataform-group">\n                        <label for="tags" class="data-label">' +
((__t = ( __('tags') )) == null ? '' : __t) +
'</label>\n                        <div class="data-input-div">\n                            <input type="hidden" class="form-control" id="tags" name="tags"></input>\n                        </div>\n                    </div>\n                    <div class="form-group metadataform-group">\n                        <label for="notes" class="data-label">' +
((__t = ( __('notes') )) == null ? '' : __t) +
'</label>\n                        <div class="data-input-div">\n                            <textarea class="form-control" id="notes" name="notes" rows="4"></textarea>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n\n        <div id="buttonbardiv" class="row text-center">\n            <div class="btn-group btn-group-margin">\n                <input type="submit" id="save" class="btn btn-primary" data-target-route="samples"\n                    value="' +
((__t = (__('save') )) == null ? '' : __t) +
'">\n                ';
 if (data.id) { ;
__p += '\n                <input type="hidden" id="id" name="id" value="' +
((__t = ( data.id )) == null ? '' : __t) +
'" />\n                <button data-data-id="' +
((__t = ( data.id )) == null ? '' : __t) +
'" data-target-route="samples"\n                    class="btn btn-danger delete">' +
((__t = ( __("delete") )) == null ? '' : __t) +
'</button>\n                ';
} ;
__p += '\n            </div>\n        </div>\n    </form>\n</div>\n<div class="sample-modal"></div>';

}
return __p
};

this["JST"]["views/templates/sample-get-from-barcode.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h2 id="bar-code" class="legend">Scan your bar code!</h2>\n<div class="form-group metadataform-group">\n  <label for="biobank-code" class="data-label col-md-2">' +
((__t = ( __('biobank-code') )) == null ? '' : __t) +
'</label>\n  <div class="data-input-div col-md-2" disabled=\'' +
((__t = (disabled)) == null ? '' : __t) +
'\'>\n    <input text class="form-control" id="biobank-code" name="biobank-code"></input>\n  </div>\n</div>\n<span text class="error-cnt hidden text-warning" id="biobank-code" name="biobank-code-project">Please select a project first.</span>\n<span text class="text-danger" id="bc-mess-err" name="bc-mess-err" style="display:none;">Sample not found. Please Retry!</span>\n<span text class="text-success" id="bc-mess-succ" name="bc-mess-succ" style="display:none;">Sample found! Redirecting...</span>\n';

}
return __p
};

this["JST"]["views/templates/sample-list.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2>' +
((__t = ( __("samples-list") )) == null ? '' : __t) +
'</h2>\n\n<div id="content">\n    <div class="row">\n        <div class="col-sm-12">\n            <div class="table-responsive">\n                <table class="table">\n                    <thead>\n                        <tr>\n                            <th>' +
((__t = ( __("biobank") )) == null ? '' : __t) +
'</th>\n                            <th>' +
((__t = ( __("arrival-code") )) == null ? '' : __t) +
'</th>\n                            <th>' +
((__t = ( __("biobank-code") )) == null ? '' : __t) +
'</th>\n                            <th>' +
((__t = ( __("type") )) == null ? '' : __t) +
'</th>\n                            <th>' +
((__t = ( __("donor") )) == null ? '' : __t) +
'</th>\n                            <th>' +
((__t = ( __("diagnosis") )) == null ? '' : __t) +
'</th>\n                            <th>' +
((__t = ( __("anatomical-position"))) == null ? '' : __t) +
'</th>\n                            <th style="display: none;">' +
((__t = ( __("project") )) == null ? '' : __t) +
'</th>\n                            <th></th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                    ';
 _.each(samples, function(sample) {
                    var metadata = sample.get("metadata")
                    var dataType = _.find(dataTypes, {id : sample.get('type')});
                    var sampleProject = _.find(xtens.session.get("projects"), {id :  dataType.get("project")}); ;
__p += '\n\n                    <tr class="content">\n                        <td>' +
((__t = ( sample.get("acronym") )) == null ? '' : __t) +
'</td>\n                        <td>' +
((__t = ( metadata.arrival_code && metadata.arrival_code.value )) == null ? '' : __t) +
'</td>\n                        <td>' +
((__t = ( sample.get("biobankCode") )) == null ? '' : __t) +
'</td>\n                        <td>' +
((__t = ( dataType.get("name") )) == null ? '' : __t) +
'</td>\n                        <td>' +
((__t = ( sample.get("code") )) == null ? '' : __t) +
'</td>\n                        <td>' +
((__t = ( metadata.pathology &&  metadata.pathology.value )) == null ? '' : __t) +
'</td>\n                        <td>' +
((__t = ( metadata.sample_codification && metadata.sample_codification.value )) == null ? '' : __t) +
'</td>\n                        <td style="display:none;">' +
((__t = ( sampleProject ? sampleProject.name : null )) == null ? '' : __t) +
'</td>\n                        <td  class="text-right">\n                          <div class="btn-group btn-group-sm" role="group" style="margin-top:0.5vh;">\n                          ';
 var privilege = dataTypePrivileges.find(function(model) {
                            return model.get('dataType') === sample.get("type"); });
                           if(privilege && privilege.get("privilegeLevel") === "edit" ){ ;
__p += '\n                            <a type="button" class="btn btn-primary" href="' +
((__t = ( sample.get("editLink") )) == null ? '' : __t) +
'">' +
((__t = (__("edit") )) == null ? '' : __t) +
'</a>\n                            ';
} ;
__p += '\n                            ';
 if (sample.get("newDerivativeLink") && sample.get("newDerivativeLink").length > 0) {;
__p += '\n                            <a type="button" class="btn btn-default" href="' +
((__t = ( sample.get("newDerivativeLink") )) == null ? '' : __t) +
'">' +
((__t = (__("new-derivative-sample") )) == null ? '' : __t) +
'</a>\n                            ';
} ;
__p += '\n                            ';
 if (sample.get("newDataLink") && sample.get("newDataLink").length > 0) {;
__p += '\n                            <a type="button" class="btn btn-default" href="' +
((__t = ( sample.get("newDataLink") )) == null ? '' : __t) +
'">' +
((__t = ( __("new-data") )) == null ? '' : __t) +
'</a>\n                            ';
} ;
__p += '\n                          </div>\n                        </td>\n                      </tr>\n                    ';
 }) ;
__p += '\n                    </tbody>\n                </table>\n            </div>\n            <div id="pagination" class="row"></div>\n            <div id="buttonbardiv" class="row text-center">\n              <div class="btn-group btn-group-margin">\n                <a href="" id="newSample" class="btn btn-primary">' +
((__t = ( __("new-sample"))) == null ? '' : __t) +
'</a>\n              </div>\n            </div>\n        </div>\n    </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/subject-dashboard.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h2>' +
((__t = ( __("subject-dashboard") )) == null ? '' : __t) +
'</h2>\n<div class="row">\n  <div class="col-md-12">\n    <div class="graph-cnt"></div>\n  </div>\n</div>';

}
return __p
};

this["JST"]["views/templates/subject-details.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h1>' +
((__t = ( __("subject-details") )) == null ? '' : __t) +
'</h1>\n\n<div id="content">\n    <div class="container data-header-cnt">\n        <div id="data-header-row" class="row data-header-row">\n            <div id="data-header" class="col-md-offset-2 col-md-6">\n\n                <div id="personal-details">\n                    <!--\n                  <button id="add-personal-details" class="btn btn-info">' +
((__t = ( __('add-personal-details') )) == null ? '' : __t) +
'</button>\n                  -->\n                </div>\n                <div class="row margin-row">\n                    <label for="code" class="data-label">' +
((__t = ( __("code") )) == null ? '' : __t) +
'</label>\n                    <div class="data-input-div">\n                        <span id="code" class="data-span">' +
((__t = ( data.get("code") )) == null ? '' : __t) +
'</span>\n                    </div>\n                </div>\n                <div class="row margin-row">\n                    <label for="sex" class="data-label">' +
((__t = ( __("sex") )) == null ? '' : __t) +
'</label>\n                    <div class="data-input-div">\n                        <div id="sex" name="sex" class="data-span">' +
((__t = ( data.get("sex") )) == null ? '' : __t) +
'</div>\n                    </div>\n                </div>\n                <div class="row margin-row">\n                    <label for="dataType" class="data-label">' +
((__t = ( __("data-type") )) == null ? '' : __t) +
'</label>\n                    <div class="data-input-div">\n                        <div id="dataType" name="dataType" class="data-span">' +
((__t = ( data.get("type").name )) == null ? '' : __t) +
'</div>\n                    </div>\n                </div>\n                <div class="row margin-row">\n                    <label for="tags" class="data-label">' +
((__t = ( __('tags') )) == null ? '' : __t) +
'</label>\n                    <div class="data-input-div">\n                        <div type="hidden" class="data-span" id="tags" name="tags">\n                            ' +
((__t = ( _.isEmpty(data.get('tags')) ? '' : data.get('tags').join(', ') )) == null ? '' : __t) +
'\n                        </div>\n                    </div>\n                </div>\n                <div class="row margin-row">\n                    <label for="notes" class="data-label">' +
((__t = ( __('notes') )) == null ? '' : __t) +
'</label>\n                    <div class="data-input-div">\n                        <div class="data-span" id="notes" name="notes" rows="4">' +
((__t = ( data.get('notes') || "" )) == null ? '' : __t) +
'</div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n    <div id="metadata-schema" class="metadata-schema">\n        <div id="metadata-body" class="metadata-body">\n            ';
 var metadata = data.get("metadata"), value, values, unit;
                var fieldsGroups = _.groupBy(fields, '_group');
                _.forEach(fieldsGroups, function(fields, groupName) {;
__p += '\n            <div class="metadatagroup span7 center">\n                <h4 class="metadatagroup-header text-uppercase">\n                    ' +
((__t = ( groupName )) == null ? '' : __t) +
'\n                </h4>\n                <div class="metadatacomponent-body">\n                    ';
 
                        var loopsGroups = _.groupBy(fields, '_loop');
                        if (loopsGroups['undefined'] && loopsGroups['undefined'].length > 0) { 
                        _.each(loopsGroups['undefined'], function(field,index) {;
__p += '\n\n                    ';
 if (!field.sensitive || xtens.session.get('canAccessSensitiveData') ) {;
__p += '\n                    <div class="row margin-row">\n                        <span name="metadata-name" class="col-md-4 text-right" style="padding-left:29px">\n                            ' +
((__t = (field.name)) == null ? '' : __t) +
'\n                        </span>\n                        <div class="col-md-5 text-left">\n\n                            ';
 value =  metadata[field.formattedName] ? metadata[field.formattedName].value : null;
                                if (field.fieldType==="Date" && value != null){value=moment(value).lang("it").format('L');}
                                unit = metadata[field.formattedName] ? metadata[field.formattedName].unit : null; ;
__p += '\n                            <div name="metadata-value" class="data-value">\n                                ' +
((__t = ( value && unit ? value + " [" + unit + "]" :
                                    value ? value : "" )) == null ? '' : __t) +
'\n                            </div>\n                        </div>\n                    </div>\n                    ';
}});;
__p += '\n                </div>\n            </div>\n            ';

            } 
            if (loopsGroups['true'] && loopsGroups['true'].length > 0) {
                var maxLoopNumber = _.max(_.map(_.filter(metadata, function(m) {return m.group == groupName && m.loop; }), function (a) {return a.values ? a.values.length : 0})) 
                maxLoopNumber = maxLoopNumber > 0 ? maxLoopNumber : 1;
                for (let index = 1; index <= maxLoopNumber; index++) {;
__p += '\n\n            <div class="metadatagroup span7 center">\n                ';
var loopGroupName = _.filter(metadata, function(m) {return m.group == groupName && m.loop; })
                            if(loopGroupName.length > 0) {;
__p += '\n                <h4 class="metadatagroup-header text-uppercase">\n                    ' +
((__t = ( _.filter(metadata, function(m) {return m.group == groupName && m.loop; })[0].loop )) == null ? '' : __t) +
'\n                    #' +
((__t = (index )) == null ? '' : __t) +
'\n                </h4>\n                <div class="metadatacomponent-body">\n                    ';
};
__p += '\n    \n                    ';
_.each(loopsGroups['true'], function(field) {
                     if (!field.sensitive || xtens.session.get('canAccessSensitiveData') ) {;
__p += '\n                    <div class="row margin-row">\n                        <span name="metadata-name" class="col-md-4 text-right" style="padding-left:29px">\n                            ' +
((__t = (field.name)) == null ? '' : __t) +
'\n                        </span>\n                        <div class="col-md-5 text-left">\n\n                            ';
 values = metadata[field.formattedName] ? metadata[field.formattedName].values : null;;
__p += '\n                            <div name="metadata-value" class="data-value">\n                                ' +
((__t = ( values && values[index-1] ? values[index-1] : null )) == null ? '' : __t) +
'\n                            </div>\n                        </div>\n                    </div>\n                    ';
}
                });
                if(loopGroupName.length > 0) {;
__p += '\n                </div>\n                ';
};
__p += '\n                        </div>\n    \n                        ';
  }}
                                });;
__p += '\n            </div>\n        </div>\n    </div>';

}
return __p
};

this["JST"]["views/templates/subject-edit-partial.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="form-group"></div>\n<div class="form-group metadataform-group">\n    <label for="code" class="data-label">' +
((__t = ( __('code') )) == null ? '' : __t) +
'</label>\n    <div class="data-input-div">\n        <input text class="form-control" id="code" name="code"></input>\n    </div>\n</div>\n<div class="form-group metadataform-group">\n    <label for="project" class="data-label">' +
((__t = ( __('project') )) == null ? '' : __t) +
'</label>\n    <div class="data-input-div">\n        <select class="form-control" id="project" name="project"></select>\n    </div>\n</div>\n<div class="form-group metadataform-group">\n    <label for="tags" class="data-label">' +
((__t = ( __('tags') )) == null ? '' : __t) +
'</label>\n    <div class="data-input-div">\n        <input type="hidden" class="form-control" id="tags" name="tags"></input>\n    </div>\n</div>\n<div class="form-group metadataform-group">\n    <label for="notes" class="data-label">' +
((__t = ( __('notes') )) == null ? '' : __t) +
'</label>\n    <div class="data-input-div">\n        <textarea class="form-control" id="notes" name="notes" rows="4"></textarea>\n    </div>\n</div>\n<div class="metadatacomponent-body"></div>\n';

}
return __p
};

this["JST"]["views/templates/subject-edit.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h1>' +
((__t = ( __("subject-manager") )) == null ? '' : __t) +
'</h1>\n<h2>' +
((__t = ( data.id ? __("update-subject") : __("create-subject") )) == null ? '' : __t) +
'</h2>\n<div id="content">\n    <form class="form-horizontal edit-subject-form" role="form" data-parsley-focus="first" data-parsley-trigger="focusout" data-parsley-validate>\n        <!--\n        <div class="form-group">\n            <label for="dataType" class="data-label">' +
((__t = ( __("select-a-data-type") )) == null ? '' : __t) +
'</label>\n            <div class="data-input-div">\n                <select class="form-control" id="dataType" name="dataType">\n                </select>\n            </div>\n        </div>\n        -->\n        <div class="row bg-diff" id="personal-details">\n            <!--\n            <button id="add-personal-details" class="btn btn-info">' +
((__t = ( __('add-personal-details') )) == null ? '' : __t) +
'</button>\n            -->\n        </div>\n        <div id="metadataform-group-cnt" class="row" style="margin-top:2em;">\n\n        <div class="form-group metadataform-group">\n            <label for="code" class="data-label">' +
((__t = ( __('code') )) == null ? '' : __t) +
'</label>\n            <div class="data-input-div">\n              <div class="input-group">\n                  <input text class="form-control" id="code" name="code"></input>\n                  <span id="get-next-code" class="input-group-addon ">Example: PREFIX-NUMBER (AA-1)</span>\n              </div>\n            </div>\n        </div>\n        <div class="form-group metadataform-group">\n            <label for="sex" class="data-label">' +
((__t = ( __('sex') )) == null ? '' : __t) +
'</label>\n            <div class="data-input-div">\n                <input type="hidden" class="form-control" id="sex" name="sex"></select>\n            </div>\n        </div>\n        <div class="form-group metadataform-group">\n            <label for="owner" class="data-label">' +
((__t = ( __("owner") )) == null ? '' : __t) +
'</label>\n            <div class="data-input-div">\n                <select disabled class="form-control" id="owner" name="owner" required></select>\n            </div>\n        </div>\n        <div class="form-group metadataform-group">\n            <label for="tags" class="data-label">' +
((__t = ( __('tags') )) == null ? '' : __t) +
'</label>\n            <div class="data-input-div">\n                <input type="hidden" class="form-control" id="tags" name="tags"></input>\n            </div>\n        </div>\n        <div class="form-group metadataform-group">\n            <label for="notes" class="data-label">' +
((__t = ( __('notes') )) == null ? '' : __t) +
'</label>\n            <div class="data-input-div">\n                <textarea class="form-control" id="notes" name="notes" rows="4"></textarea>\n            </div>\n        </div>\n        <div id="buttonbardiv" class="row text-center">\n            <div class="btn-group btn-group-margin">\n                <input type="submit" id="save" class="btn btn-primary" value="' +
((__t = (__('save') )) == null ? '' : __t) +
'" >\n                ';
 if (data.id) { ;
__p += '\n                    <input type="hidden" id="id" name="id" value="' +
((__t = ( data.id )) == null ? '' : __t) +
'" />\n                    <button data-data-id="' +
((__t = ( data.id )) == null ? '' : __t) +
'" data-target-route="subjects" class="btn btn-danger delete">' +
((__t = ( __("delete") )) == null ? '' : __t) +
'</button>\n                ';
} ;
__p += '\n            </div>\n        </div>\n      </div>\n    </form>\n</div>\n<div class="subject-modal"></div>\n';

}
return __p
};

this["JST"]["views/templates/subject-graph.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<style>\n  svg .subject-node {\n    fill: #ffffff;\n    stroke-width: 3px;\n    cursor: pointer;\n    stroke-opacity: 1;\n    transition: stroke-opacity .4s ease;\n  }\n\n  svg .subject-node:hover {\n    stroke-opacity: 0.5;\n  }\n\n  .node text {\n    font: 12px;\n  }\n\n  .link {\n    fill: none;\n    stroke: #ccc;\n    stroke-width: 2px;\n  }\n\n  .d3-tip {\n    line-height: 1;\n    font-weight: bold;\n    padding: 12px;\n    background: rgba(0, 0, 0, 0.8);\n    color: #fff;\n    border-radius: 2px;\n    position: absolute;\n    text-align: center;\n    margin-left: 20px;\n  }\n\n  .d3-tip.n:after {\n    margin: 0 0 0 0;\n    top: 100%;\n  }\n\n  #tip-subj-title {\n    font-size: 22px;\n    background-color: rgba(255, 255, 255, 0.8);\n    border-radius: 8px;\n  }\n</style>\n<div id="content">\n  <label for="subject-selector" class="text-uppercase">' +
((__t = ( __("select-a-patient") )) == null ? '' : __t) +
':</label>\n  <div class="row">\n    <div class="col-md-5">\n      <select id=\'subject-selector\' class="form-group selectpicker" data-live-search="true" data-width="100%">\n        ';
 _.each(subjects, function(subject) {
              var label = subject.givenName && subject.surname ? subject.surname + " " + subject.givenName + " - " + subject.code : subject.code; ;
__p += '\n        <option value=\'' +
((__t = ( subject.id )) == null ? '' : __t) +
'\'>' +
((__t = ( label )) == null ? '' : __t) +
'</option>\n        ';
 }) ;
__p += '\n      </select>\n    </div>\n  </div>\n</div>';

}
return __p
};

this["JST"]["views/templates/subject-list.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<h2>' +
((__t = ( __("subject-list") )) == null ? '' : __t) +
'</h2>\n\n<div id="content">\n    <div class="row">\n        <div class="col-sm-12">\n            <div class="table-responsive">\n                <table class="table">\n                    <thead>\n                        <tr class="text-center">\n                            <th>' +
((__t = ( __("code") )) == null ? '' : __t) +
'</th>\n                            ';
 if (xtens.session.get("canAccessPersonalData")) {;
__p += '\n                            <th>' +
((__t = ( __("given-name") )) == null ? '' : __t) +
'</th>\n                            <th>' +
((__t = ( __("surname") )) == null ? '' : __t) +
'</th>\n                            <th>' +
((__t = ( __("birth-date") )) == null ? '' : __t) +
'</th>\n                            ';
} ;
__p += '\n                            <th>' +
((__t = ( __("sex") )) == null ? '' : __t) +
'</th>\n                            <th style="display:none;">' +
((__t = ( __("project") )) == null ? '' : __t) +
'</th>\n                            <th></th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        ';
 var date; ;
__p += '\n                        ';
 _.each(subjects, function(subject) {
                      var dataType = _.find(dataTypes, {id : subject.get('type')});
                      var subjProject = _.find(xtens.session.get("projects"), {id : dataType.get('project')}); ;
__p += '\n                        <tr class="content">\n                            <td>' +
((__t = ( subject.get("code") )) == null ? '' : __t) +
'</td>\n                            ';
 if (xtens.session.get("canAccessPersonalData")) {;
__p += '\n                            <td>' +
((__t = ( subject.get("givenName") && subject.get("givenName") )) == null ? '' : __t) +
'</td>\n                            <td>' +
((__t = ( subject.get("surname") && subject.get("surname") )) == null ? '' : __t) +
'</td>\n                            <td>\n                                ';
 date = subject.get("birthDate") && subject.get("birthDate"); ;
__p += '\n                                ' +
((__t = ( date ? moment(date).lang("it").format('L') : ' ' )) == null ? '' : __t) +
'\n                            </td>\n                            ';
} ;
__p += '\n                            <td>' +
((__t = ( subject.get("sex") )) == null ? '' : __t) +
'</td>\n                            <td style="display:none;">' +
((__t = ( subjProject ? subjProject.name : null )) == null ? '' : __t) +
'</td>\n                            <td class="text-right">\n                                <div class="btn-group btn-group-sm" role="group" style="margin-top:0.5vh;">\n                                    ';
 var privilege = dataTypePrivileges.find(function(model) {
                            return model.get('dataType') === subject.get("type"); });
                           if(privilege && privilege.get("privilegeLevel") === "edit" ){ ;
__p += '\n                                    <a type="button" class="btn btn-primary"\n                                        href="' +
((__t = ( subject.get("editLink") )) == null ? '' : __t) +
'">' +
((__t = (__("edit") )) == null ? '' : __t) +
'</a>\n                                    ';
} ;
__p += '\n                                    ';
 if (subject.get("newSampleLink") && subject.get("newSampleLink").length) {;
__p += '\n                                    <a type="button" class="btn btn-default"\n                                        href="' +
((__t = ( subject.get("newSampleLink") )) == null ? '' : __t) +
'">' +
((__t = (__("new-derivative-sample") )) == null ? '' : __t) +
'</a>\n                                    ';
} ;
__p += '\n                                    ';
 if (subject.get("newDataLink") && subject.get("newDataLink").length) {;
__p += '\n                                    <a type="button" class="btn btn-default"\n                                        href="' +
((__t = ( subject.get("newDataLink") )) == null ? '' : __t) +
'">' +
((__t = (__("new-data") )) == null ? '' : __t) +
'</a>\n                                    ';
} ;
__p += '\n                                </div>\n                            </td>\n                        </tr>\n                        ';
 }) ;
__p += '\n                    </tbody>\n                </table>\n            </div>\n            <div id="pagination" class="row"></div>\n            <div id="buttonbardiv" class="row text-center">\n                <div class="btn-group btn-group-margin">\n                    <a href="#/subjects/dashboard" class="btn btn-default moreData">' +
((__t = ( __("subject-dashboard"))) == null ? '' : __t) +
'</a>\n                    <a href="#/subjects/new" class="btn btn-primary">' +
((__t = ( __("new-subject"))) == null ? '' : __t) +
'</a>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>';

}
return __p
};

this["JST"]["views/templates/supertype-edit.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h4>' +
((__t = ( __("schema-details") )) == null ? '' : __t) +
'</h4>\n<div class="form-group row">\n    <label for="st-name" class="col-md-2 control-label">' +
((__t = (__("name") )) == null ? '' : __t) +
'</label>\n    <div class="col-md-3">\n        <input class="form-control" id="st-name" name="st-name" placeholder="' +
((__t = ( __('super-type-name') )) == null ? '' : __t) +
'" required></input>\n    </div>\n    <label for="uri" class="col-md-2 control-label">' +
((__t = (__("uri") )) == null ? '' : __t) +
'</label>\n    <div class="col-md-4">\n      <input class="form-control" id="uri" name="uri" placeholder="' +
((__t = ( __('super-type-uri') )) == null ? '' : __t) +
'" type="url" data-parsley-type="url" required/>\n    </div>\n</div>\n';

}
return __p
};

this["JST"]["views/templates/update-password.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h1>' +
((__t = ( __("operator-manager") )) == null ? '' : __t) +
'</h1>\n<h2>' +
((__t = ( expired ? __("update-exp-password") : __("update-password"))) == null ? '' : __t) +
'</h2>\n<div id="content">\n  <form id="form" class="form-horizontal edit-password-form" data-parsley-trigger="focusout" data-parsley-validate role="form">\n    <div class="form-group metadataform-group " >\n      <label for="username" class="data-label">\n        ' +
((__t = ( __('username') )) == null ? '' : __t) +
'\n      </label>\n      <div class="data-input-div">\n        <input required input class="form-control" id="username" placeholder="Username" name="username" disabled></input>\n      </div>\n    </div>\n    <div class="form-group metadataform-group">\n      <label for="oldPassword" class="data-label">\n        ' +
((__t = ( __('old-password') )) == null ? '' : __t) +
'\n      </label>\n      <div class="data-input-div">\n        <input required input type="password" class="form-control" id="oldPassword" placeholder="Old Password" data-parsley-minlength="8" name="oldPassword"></input>\n      </div>\n    </div>\n    <div class="form-group metadataform-group">\n      <label for="newPassword" class="data-label">\n        ' +
((__t = ( __('new-password-at-least') )) == null ? '' : __t) +
'\n      </label>\n      <div class="data-input-div">\n        <input required type="password" class="form-control" id="newPassword" name="password" data-parsley-minlength="8" data-parsley-pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})"\n         data-parsley-error-message="' +
((__t = (__('password-complexity-error'))) == null ? '' : __t) +
'" placeholder="New Password"></input>\n      </div>\n    </div>\n    <div class="form-group metadataform-group">\n      <label for="confirmNewPass" class="data-label">\n        ' +
((__t = ( __('cnew-password') )) == null ? '' : __t) +
'\n      </label>\n      <div class="data-input-div">\n        <input required type="password" class="form-control" id="confirmNewPass" placeholder="Confirm Password" data-parsley-errors-container=".with-errors" data-parsley-equalto="#newPassword" data-parsley-error-message="Passwords don\'t match" placeholder="Confirm New Password">\n        <div class="help-block with-errors"></div>\n      </div>\n\n      <div id="buttonbardiv" class="row text-center">\n        <div class="btn-group btn-group-margin">\n          <input type="submit" id="update" class="btn btn-primary" value="' +
((__t = ( __('update-password'))) == null ? '' : __t) +
'">\n        </div>\n      </div>\n  </form>\n  </div>\n  <div class="updated-password-modal"></div>\n';

}
return __p
};

this["JST"]["views/templates/xtenstable-buttongroup.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<!-- <div class="btn-group" role="group" aria-label="...">\n  ';
 switch(privilegeLevel){
     case "view_overview":;
__p += '\n     <button type="button" class="btn btn-xs btn-default xtenstable-derivedsamples">' +
((__t = ( __('derived-samples') )) == null ? '' : __t) +
'</button>\n     <button type="button" class="btn btn-xs btn-default xtenstable-deriveddata">' +
((__t = ( __('derived-data') )) == null ? '' : __t) +
'</button>\n  ';
 break;

     case "view_details":;
__p += '\n    <button type="button" class="btn btn-xs btn-default xtenstable-details">' +
((__t = ( __('details') )) == null ? '' : __t) +
'</button>\n    <button type="button" class="btn btn-xs btn-default xtenstable-derivedsamples">' +
((__t = ( __('derived-samples') )) == null ? '' : __t) +
'</button>\n    <button type="button" class="btn btn-xs btn-default xtenstable-deriveddata">' +
((__t = ( __('derived-data') )) == null ? '' : __t) +
'</button>\n  ';
 break;

     case "download":;
__p += '\n    <button type="button" class="btn btn-xs btn-default xtenstable-details">' +
((__t = ( __('details') )) == null ? '' : __t) +
'</button>\n    ';
 if(fileUpload){ ;
__p += '\n      <button type="button" class="btn btn-xs btn-default xtenstable-files">' +
((__t = ( __('files') )) == null ? '' : __t) +
'</button>\n    ';
};
__p += '\n    <button type="button" class="btn btn-xs btn-default xtenstable-derivedsamples">' +
((__t = ( __('derived-samples') )) == null ? '' : __t) +
'</button>\n    <button type="button" class="btn btn-xs btn-default xtenstable-deriveddata">' +
((__t = ( __('derived-data') )) == null ? '' : __t) +
'</button>\n  ';
 break;

  case "edit":;
__p += '\n    <button type="button" class="btn btn-xs btn-default xtenstable-details">' +
((__t = ( __('details') )) == null ? '' : __t) +
'</button>\n    ';
 if(fileUpload){ ;
__p += '\n    <button type="button" class="btn btn-xs btn-default xtenstable-files">' +
((__t = ( __('files') )) == null ? '' : __t) +
'</button>\n    ';
};
__p += '\n    ';
 if(xtens.session.get("canAccessSensitiveData") || !hasDataSensitive){ ;
__p += '\n      <button type="button" class="btn btn-xs btn-default xtenstable-edit">' +
((__t = ( __('edit') )) == null ? '' : __t) +
'</button>\n      ';
};
__p += '\n    <button type="button" class="btn btn-xs btn-default xtenstable-derivedsamples">' +
((__t = ( __('derived-samples') )) == null ? '' : __t) +
'</button>\n    <button type="button" class="btn btn-xs btn-default xtenstable-deriveddata">' +
((__t = ( __('derived-data') )) == null ? '' : __t) +
'</button>\n  ';
 break;

     default: ;
__p += '\n     <button type="button" class="btn btn-xs btn-default xtenstable-derivedsamples">' +
((__t = ( __('derived-samples') )) == null ? '' : __t) +
'</button>\n     <button type="button" class="btn btn-xs btn-default xtenstable-deriveddata">' +
((__t = ( __('derived-data') )) == null ? '' : __t) +
'</button>\n  ';
};
__p += '\n</div> -->\n\n\n<div class="btn-group" role="group" aria-label="...">\n  ';
 if(privilegeLevel && privilegeLevel !== "view_overview"){ ;
__p += '\n  <button type="button" class="btn btn-xs btn-default xtenstable-details">' +
((__t = ( __('details') )) == null ? '' : __t) +
'</button>\n\n  ';
 if(privilegeLevel === "edit" && (xtens.session.get("canAccessSensitiveData") || !hasDataSensitive)){ ;
__p += '\n  <button type="button" class="btn btn-xs btn-default xtenstable-edit">' +
((__t = ( __('edit') )) == null ? '' : __t) +
'</button>\n  ';
};
__p += '\n  ';
};
__p += '\n  ';
 if(hasSampleChildren){ ;
__p += '\n  <button type="button" class="btn btn-xs btn-default xtenstable-derivedsamples">' +
((__t = ( __('derived-samples') )) == null ? '' : __t) +
'</button>\n  ';
};
__p += '\n    ';
 if(hasDataChildren){ ;
__p += '\n  <button type="button" class="btn btn-xs btn-default xtenstable-deriveddata">' +
((__t = ( __('derived-data') )) == null ? '' : __t) +
'</button>\n  ';
};
__p += '\n    ';
 if(dataTypeModel === "Subject"){ ;
__p += '\n  <button type="button" class="btn btn-xs btn-default xtenstable-subjectgraph">' +
((__t = ( __('subject-dashboard') )) == null ? '' : __t) +
'</button>\n  ';
};
__p += '\n    ';
 if((privilegeLevel === "download" || privilegeLevel === "edit") && fileUpload){ ;
__p += '\n  <button type="button" class="btn btn-xs btn-default xtenstable-files">' +
((__t = ( __('files') )) == null ? '' : __t) +
'</button>\n  ';
};
__p += '\n</div>';

}
return __p
};