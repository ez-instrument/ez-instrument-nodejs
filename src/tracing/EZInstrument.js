const { EZInstrumentOptions } = require('./EZInstrumentOptions')

/**
 * Instruments your service for tracing.
 * Please provide correct settings in the constructor.
 * @public
 * @example
 * const { EZInstrument } = require('ez-instrument');
 * 
 * const tracing = new EZInstrument({
 *      enableTracing: true,
 *      service: {
 *          name: "My Awesome Service"
 *      }
 * });
 * 
 * tracing.initTracing();
 */
class EZInstrument {
    /**
     * Instruments your service for tracing.
     * Please provide correct settings in the constructor.
     * @param {EZInstrumentOptions} options
     * @example
     * const { EZInstrument } = require('ez-instrument');
     * 
     * const tracing = new EZInstrument({
     *      enableTracing: true,
     *      service: {
     *          name: "My Awesome Service"
     *      }
     * });
     * 
     * tracing.initTracing();
     */
    constructor(options) {
        console.info(options);
    }

    /**
     * Initialize tracing.
     * @public
     * @returns {void}
     */
    initTracing() {

    }
}

exports.EZInstrument = EZInstrument;