const { diag: logger } = require('@opentelemetry/api');

class GeneralUtils {
    /**
     * @param {*} input 
     * @returns {boolean}
     */
    isNullOrUndefinedOrEmpty(input) {
        return (input === "") ? true : false;
    }

    /**
     * @param {*} input 
     * @returns {boolean}
     */
    isNullOrUndefined(input) {
        if(input === null || typeof(input) === 'undefined') {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param {Array} listOfValues 
     * @param {*} defaultValue 
     */
    returnNextIfNullOrUndefined(listOfValues, defaultValue) {
        let result = defaultValue || null;
        listOfValues.forEach(element => {
            if(!this.isNullOrUndefined(element)) {
                result = element;
            }
        });

        return result;
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
