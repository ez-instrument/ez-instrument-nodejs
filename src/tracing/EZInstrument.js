const { EZInstrumentOptions } = require('./EZInstrumentOptions');
const { FinalOptions } = require('./FinalOptions');
const { DiagConsoleLogger, diag: log } = require('@opentelemetry/api');

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
        this.tracingOptions = options;
    }

    /**
     * Initialize tracing.
     * @public
     * @returns {void}
     */
    initTracing() {
        try {
            // fetch enableTracing flag from ENV var & YAML file as well
            if(this.shouldEnableTracing(this.tracingOptions.enableTracing)) {
                const finalOptions = this.getFinalOptions(this.tracingOptions);
                this.logFinalOptions(finalOptions);
                this.setOpenTelemetryTracing(finalOptions);
            }
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Just returning the arg for now. Will add checks for ENV var & YAML config file later.
     * @private
     * @param {boolean} fromConstructor 
     */
    shouldEnableTracing(fromConstructor) {
        return fromConstructor;
    }

    /**
     * @private
     * @param {string} logLevel
     * @returns {DiagLogLevel}
     */
    getLogLevel(logLevel) {
        const { DiagLogLevel, diag } = require('@opentelemetry/api');
        let resultLogLevel = null;
        if(logLevel == "all") {
            resultLogLevel = DiagLogLevel.ALL;
        } else if(logLevel == "info") {
            resultLogLevel = DiagLogLevel.INFO;
        } else if(logLevel == "debug") {
            resultLogLevel = DiagLogLevel.DEBUG;
        } else if(logLevel == "warn") {
            resultLogLevel = DiagLogLevel.WARN;
        } else if(logLevel == "error") {
            resultLogLevel = DiagLogLevel.ERROR;
        } else if(logLevel == "none") {
            resultLogLevel = DiagLogLevel.NONE;
        } else {
            resultLogLevel = DiagLogLevel.ERROR;
        }
        return resultLogLevel;
    }

    /**
     * @private
     * @param {string|null} exporterType
     * @param {string|null} exportUrl
     */
    getExporter(exporterType, exportUrl) {
        exporterType = exporterType.toLowerCase();
        if(exporterType === 'http' || exporterType === 'otel-http') {
            const { OTLPTraceExporter: OTLPTraceExporterHttp } = require('@opentelemetry/exporter-trace-otlp-http');
            const httpExporter = new OTLPTraceExporterHttp({
                url: exportUrl
            });
            return httpExporter;

        } else if(exporterType === 'grpc' || exporterType === 'otel-grpc') {
            const { OTLPTraceExporter: OTLPTraceExporterGrpc } = require('@opentelemetry/exporter-trace-otlp-grpc');
            const grpcExporter = new OTLPTraceExporterGrpc({
                url: exportUrl
            });
            return grpcExporter;
        } else {
            return null;
        }
    }

    /**
     * @private
     * @param {EZInstrumentOptions} constructorOptions
     * @returns {FinalOptions}
     */
    getFinalOptions(constructorOptions) {
        let finalOptions = new FinalOptions();

        finalOptions.logLevel = this.getLogLevel(constructorOptions.logLevel);
        log.setLogger(new DiagConsoleLogger(), finalOptions.logLevel);

        finalOptions.service.name = constructorOptions.service.name;
        finalOptions.service.namespace = constructorOptions.service.namespace;
        finalOptions.service.version = constructorOptions.service.version;

        finalOptions.deployment.environment = constructorOptions.deployment.environment;
        
        finalOptions.export.url = constructorOptions.export.url;
        finalOptions.export.enableConsoleExporter = constructorOptions.export.enableConsoleExporter;
        finalOptions.export.exporterType = constructorOptions.export.exporterType;
        finalOptions.export.exporter = this.getExporter(finalOptions.export.exporterType, finalOptions.export.url);

        const { GeneralUtils } = require('../utils/GeneralUtils');
        const utils = new GeneralUtils();

        if(utils.isNullOrEmptyOrUndefined(finalOptions.service.name)) {
            let errorMessage = "ez-instument: Cannot initialize tracing without service name.";
            log.error(errorMessage);
            throw errorMessage;
        }

        return finalOptions;
    }

    /**
     * @private
     * @param {FinalOptions} finalOptions 
     */
    logFinalOptions(finalOptions) {
        log.info(`ez-instrument: service.name = ${finalOptions.service.name}`);
        log.info(`ez-instrument: service.namespace = ${finalOptions.service.namespace}`);
        log.info(`ez-instrument: service.version = ${finalOptions.service.version}`);

        log.info(`ez-instrument: deployment.environment = ${finalOptions.deployment.environment}`);

        log.info(`ez-instrument: export.exporterType = ${finalOptions.export.exporterType}`);
        log.info(`ez-instrument: export.url = ${finalOptions.export.url}`);
        log.info(`ez-instrument: export.enableConsoleExporter = ${finalOptions.export.enableConsoleExporter}`);
    }

    /**
     * @param {FinalOptions} finalOptions
     * @private
     */
    setOpenTelemetryTracing(finalOptions) {
        try {
            const { BatchSpanProcessor, ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
            const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
            
            const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
            const { Resource } = require('@opentelemetry/resources');

            const { registerInstrumentations } = require('@opentelemetry/instrumentation');
            const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
            const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');

            log.info("ez-instrument: Initializing OpenTelemetry tracing.");

            const serviceResources = new Resource({
                [SemanticResourceAttributes.SERVICE_NAME]: finalOptions.service.name,
                [SemanticResourceAttributes.SERVICE_NAMESPACE]: finalOptions.service.namespace,
                [SemanticResourceAttributes.SERVICE_VERSION]: finalOptions.service.version,

                [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: finalOptions.deployment.environment
            });

            const nodeTraceProvider = new NodeTracerProvider({
                resource: serviceResources
            });

            nodeTraceProvider.addSpanProcessor(new BatchSpanProcessor(finalOptions.export.exporter));

            if(finalOptions.export.enableConsoleExporter === true) {
                nodeTraceProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
            }

            nodeTraceProvider.register();

            // load instrumentations
            const unloadInstrumentations = registerInstrumentations({
                tracerProvider: nodeTraceProvider,
                instrumentations: [
                    new HttpInstrumentation({               // remove both of these from here
                        enabled: true
                    }),
                    new ExpressInstrumentation({
                        enabled: true
                    })
                ]
            });

            log.info('ez-instrument: Initialized OpenTelemetry tracing.');

            // graceful shutdown
            ['SIGINT', 'SIGTERM'].forEach(signal => {
                process.on(signal, ()=>{
                    unloadInstrumentations();
                    nodeTraceProvider.shutdown()
                    .catch(
                        (error) => {
                            console.error(error);
                        }
                    );
                });
            });

        } catch (error) {
            console.error(error);
        }
    }
}

exports.EZInstrument = EZInstrument;