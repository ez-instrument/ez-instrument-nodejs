const { diag: logger } = require('@opentelemetry/api');

class GeneralUtils {
    /**
     * @param {*} input 
     * @returns {boolean}
     */
    isNullOrUndefined(input) {
        return (input === null || typeof(input) === 'undefined');
    }

    /**
     * @param {Array} listOfValues 
     * @param {*} defaultValue 
     */
    returnNextIfNullOrUndefined(listOfValues, defaultValue) {
        let selectedValues = listOfValues
            .filter((value) => !(typeof(value) === 'undefined'))
            .filter((value) => !(value === null));
        if(selectedValues.length === 0) {
            return defaultValue;
        } else {
            return selectedValues[0];
        }
    }

    /**
     * @param {string} errorMessage 
     */
    logAndThrowException(errorMessage) {
        logger.error(errorMessage);
        throw errorMessage;
    }
}

exports.GeneralUtils = GeneralUtils;
