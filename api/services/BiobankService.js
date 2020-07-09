/**
 *  @author Massimiliano Izzo - Nicolò Zanardi
 */
var BluebirdPromise = require('bluebird');

const coroutines = {

    getBiobanksToEditProject: BluebirdPromise.coroutine(function *(idProject) {
        let biobanks = yield Biobank.find().populate('projects');

        for (var i = biobanks.length - 1; i >= 0; i--) {
            if(_.indexOf(_.map(biobanks[i].projects,'id'), _.parseInt(idProject))>=0){
                biobanks.splice(i, 1);
            }
        }

        return biobanks;

    }),

    getBiobanksByProject: BluebirdPromise.coroutine(function *(idProject) {
        let biobanks = yield Biobank.find().populate('projects');

        if (!idProject) {
            return biobanks;
        }else {

            for (var i = biobanks.length - 1; i >= 0; i--) {
                if(_.indexOf(_.map(biobanks[i].projects,'id'), _.parseInt(idProject)) < 0){
                    biobanks.splice(i, 1);
                }
            }

            return biobanks;
        }
    })
};

var BiobankService = BluebirdPromise.promisifyAll({

  /**
   * @method
   * @name getBiobanksToEditProject
   * @param{ineger} id Project
   * @description return an array containing biobanks do not yet associate with project
   * @return {Array} - biobanks not yet associated with a project
   */
    getBiobanksToEditProject: function(idProject) {
        return coroutines.getBiobanksToEditProject(idProject)
        .catch(/* istanbul ignore next */ function(err) {
            sails.log.error(err);
            return err;
        });
    },

/**
 * @method
 * @name getBiobanksByProject
 * @param{ineger} id Project
 * @description return array containing biobanks associate with project
 * @return {Array} - biobanks not yet associated with a project
 */
    getBiobanksByProject: function(idProject) {
        return coroutines.getBiobanksByProject(idProject)
        .catch(/* istanbul ignore next */ function(err) {
            sails.log.error(err);
            return err;
        });
    },
    /**
     * @description find a list of Biobanks
     * @return {Array} - list of found Biobanks
     */
    get: function(params, next) {
        var criteriaObj = {};
        if (params.idBiobanks) {
            var ids = params.idBiobanks.split(",");
            criteriaObj.id = ids;
        }
        Biobank.find(criteriaObj).exec(next);
    }

});



module.exports = BiobankService;
