class GeneralUtils {
    isNullOrEmptyOrUndefined (input) {
        if(input === null || input === "" || typeof(input) === 'undefined') {
            return true;
        } else {
            return false;
        }
    }
}

exports.GeneralUtils = GeneralUtils;