const { DiagLogLevel } = require('@opentelemetry/api');

class FinalOptions {

    service = {
        /**
         * @type {string|null}
         */
        name: null,
        /**
         * @type {string|null}
         */
        namespace: null,
        /**
         * @type {string|null}
         */
        version: null
    };

    deployment = {
        /**
         * @type {string|null}
         */
        environment: null
    };

    export = {
        /**
         * @type {string|null}
         */
        url: null,
        /**
         * @type {string|null}
         */
        exporterType: null,
        exporter: null,
        /**
         * @type {boolean}
         */
        enableConsoleExporter: false
    };

    /**
     * @type {DiagLogLevel}
     */
    logLevel = DiagLogLevel.ERROR;
}

exports.FinalOptions = FinalOptions;