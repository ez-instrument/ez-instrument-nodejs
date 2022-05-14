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
        enableConsoleExporter: false
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