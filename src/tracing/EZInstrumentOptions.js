/**
 * Code driven configuration class for EZInstrument.
 */
class EZInstrumentOptions {
    /**
     * Flag to disable or enable tracing. This is a mandatory field.
     * @type {boolean}
     * @default false - Defaults to false.
     */
    enableTracing = false;

    /**
     * Service related config.
     */
    service = {
        /**
         * Service name. This is a mandatory field.
         * @type {string}
         */
        name: "",
        /**
         * Service namespace
         * @type {string}
         */
        namespace: "",
        /**
         * Service version
         * @type {string}
         */
        version: ""
    };

    /**
     * Deployment related config.
     */
    deployment = {
        /**
         * Deployment environment name.
         * @type {string}
         */
        environment: ""
    };

    /**
     * Trace export related config.
     */
    export = {
        /**
         * Export URL where your collector is available.
         * 
         * Provide the full URL with protocol, port & endpoints if any.
         * @type {string}
         */
        url: "",
        /**
         * Choose your type of exporter (http, grpc, etc.).
         * 
         * Defaults to OpenTelemetry's http exporter.
         * @default "http"
         * @type {("http" | "grpc" | "otel-http" | "otel-grpc")}
         */
        exporterType: "http",
        /**
         * Enables the ConsoleSpanExporter which prints all spans to the console.
         * @type {boolean}
         */
        enableConsoleExporter: false,
        /**
         * Config for OpenTelemetry's batch span processor that batches spans exported by
         * the SDK then pushes them to the exporter pipeline.
         */
        batchSpanProcessorConfig: {
            /**
             * How long the export can run before it is cancelled.
             * @default 30000
             * @type {number}
             */
            exportTimeoutMillis: 30000,
            /**
             * The maximum batch size of every export. It must be smaller or equal to maxQueueSize.
             * @default 512
             * @type {number}
             */
            maxExportBatchSize: 512,
            /**
             * The maximum queue size. After the size is reached spans are dropped.
             * @default 2048
             * @type {number}
             */
            maxQueueSize: 2048,
            /**
             * The delay interval in milliseconds between two consecutive exports.
             * @default 5000
             * @type {number}
             */
            scheduledDelayMillis: 5000
        }
    };

    /**
     * Log level (none, info, debug, warn, error, verbose, all).
     * 
     * @default "error" - Defaults to error logs.
     * @type {("none" | "info" | "debug" | "warn" | "error" | "verbose" | "all")}
     */
    logLevel = "error";
}

exports.EZInstrumentOptions = EZInstrumentOptions;