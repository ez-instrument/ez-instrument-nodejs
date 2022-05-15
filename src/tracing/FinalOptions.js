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
        enableConsoleExporter: false,
        batchSpanProcessorConfig: {
            /**
             * @type {number|null}
             */
            exportTimeoutMillis: null,
            /**
             * @type {number|null}
             */
            maxExportBatchSize: null,
            /**
             * @type {number|null}
             */
            maxQueueSize: null,
            /**
             * @type {number|null}
             */
            scheduledDelayMillis: null
        }
    };

    /**
     * @type {DiagLogLevel}
     */
    logLevel = DiagLogLevel.ERROR;
}

exports.FinalOptions = FinalOptions;