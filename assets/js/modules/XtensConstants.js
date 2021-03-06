// TODO: retrieve this info FROM DATABASE ideally or from the server-side anyway

(function (xtens, XtensConstants) {
    XtensConstants.DefaultLimit = 10;
    XtensConstants.DefaultLimitPrivileges = 10000;

    XtensConstants.Constants = {
        DATA: 'DATA',
        DATA_TYPE: 'DATA TYPE',
        METADATA_FIELD: 'METADATA FIELD',
        METADATA_LOOP: 'METADATA LOOP',
        METADATA_GROUP: 'METADATA GROUP',
        STRING: 'string',
        PERSONAL_DETAILS: 'Personal Details',
        SUBJECT_PROPERTIES: ['code', 'sex'],
        SAMPLE_PROPERTIES: ['biobank', 'biobankCode'],
        PATH_SEPARATOR: '/' // path separator for Unix-like systems
    };

    XtensConstants.DataTypeClasses = {
        SUBJECT: 'Subject',
        SAMPLE: 'Sample',
        // GENERIC: 'Data',
        DATA: 'Data'
    };

    XtensConstants.Procedures = [
        { label: 'CGH', value: 'CGH', superType: 6, owner: 28 },
        { label: 'NB Clinical information', value: 'CBINFO', superType: 16, owner: 28 },
        { label: 'VCF', value: 'VCF', superType: 134, owner: undefined },
        { label: 'Biochemistry Analysis', value: 'BIOAN', superType: 132, owner: 40 },
        { label: 'NK Cells Phenotype and Function Analysis', value: 'NKCELL', superType: 144, owner: 42 },
        { label: 'NGS Patient', value: 'NGSPAT', superType: [111, 113], owner: 45 },
        { label: 'NGS Analysis', value: 'NGSAN', superType: 114, rewritePath: undefined, owner: 45 }

    ];

    XtensConstants.FieldTypes = {
        TEXT: 'Text',
        LINK: 'Link',
        INTEGER: 'Integer',
        FLOAT: 'Float',
        BOOLEAN: 'Boolean',
        DATE: 'Date'
    };

    XtensConstants.SexOptions = {
        MALE: 'M',
        FEMALE: 'F',
        UNKNOWN: 'N.A.' /*,
        UNDIFFERENTIATED: 'UNDIFFERENTIATED' */
    };
    XtensConstants.SexOptions = {
        MALE: 'M',
        FEMALE: 'F',
        UNKNOWN: 'N.A.' /*,
        UNDIFFERENTIATED: 'UNDIFFERENTIATED' */
    };
    /**
     * @description available Group privilege statuses
     */
    XtensConstants.GroupPrivilegeLevels = {
        WHEEL: 'wheel', // superusers
        ADMIN: 'admin', // can edit DataTypes/Biobanks and so on
        STANDARD: 'standard'
    };

    XtensConstants.DataTypePrivilegeLevels = {
        VIEW_OVERVIEW: 'view_overview', // level 0
        VIEW_DETAILS: 'view_details', // level 1
        DOWNLOAD: 'download', // level 2
        EDIT: 'edit' // level 3
    };

    XtensConstants.useFormattedMetadataFieldNames = true;
}(xtens, xtens.module("xtensconstants")));
