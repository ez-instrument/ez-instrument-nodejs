const { otelAutoInstrumentationMap } = require('./AutoInstrumentMap')

/**
 * Configuration model class for {@link EZInstrument}.
 * All input methods such as environment variables, yaml file, constructor, etc. need to return
 * an object of this class which will later be processed by the {@link FinalOptionsBuilder}.
 */
class EZInstrumentOptions {
    /**
     * Flag to disable or enable tracing. This is a mandatory field.
     * @default false
     * @type {boolean}
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
             * Timeout value in milliseconds for each export. This is the maximum time after which the export is cancelled.
             * @default 30000
             * @type {number}
             */
            exportTimeoutMillis: 30000,
            /**
             * The maximum batch size in spans of every export. After this, a new batch is created. It must be smaller or equal to maxQueueSize.
             * @default 512
             * @type {number}
             */
            maxExportBatchSize: 512,
            /**
             * The maximum queue size in spans beyond which the spans are dropped.
             * @default 2048
             * @type {number}
             */
            maxQueueSize: 2048,
            /**
             * The delay in milliseconds between two consecutive exports.
             * @default 5000
             * @type {number}
             */
            scheduledDelayMillis: 5000
        }
    };

    /**
     * Log level (none, info, debug, warn, error, verbose, all).
     *
     * @default "error"
     * @type {("none" | "info" | "debug" | "warn" | "error" | "verbose" | "all")}
     */
    logLevel = "error";

    /**
     * Configure the various official OpenTelemetry automatic instrumentation libraries.
     * 
     * Check out the individual automatic instrumentation library for full documentation.
     * @type {otelAutoInstrumentationMap}
     */
    autoInstrumentationOptions = otelAutoInstrumentationMap;

    /**
     * Captures host related information like OS name, type, version, etc. & appends it all created spans.
     * 
     * If your application is running inside a linux docker container, this option will append container related data as well.
     * This will not work with windows containers however.
     * 
     * @default false
     * @type {boolean}
     */
    captureHostInformation = false;
}

exports.EZInstrumentOptions = EZInstrumentOptions;
