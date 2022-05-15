const { EZInstrumentOptions } = require('./EZInstrumentOptions');
const { FinalOptions } = require('./FinalOptions');
const { GeneralUtils } = require('../utils/GeneralUtils');

const { DiagConsoleLogger, diag, DiagLogLevel } = require('@opentelemetry/api');

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
        this.utils = new GeneralUtils();
        
        this.tracingOptions = options;
        
        this.log = diag;
        this.log.setLogger(new DiagConsoleLogger(), this.getLogLevel(this.tracingOptions.logLevel));
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
     * Will add check for YAML config file later.
     * @private
     * @param {boolean} fromConstructor 
     */
    shouldEnableTracing(constructorOption) {
        const enableTracing = this.utils.returnNextIfNullOrUndefined([process.env.EZ_ENABLE_TRACING, constructorOption], "false");

        return (enableTracing.toString().toLowerCase() === "true") ? true : false;
    }

    /**
     * @private
     * @param {string} logLevel
     * @returns {DiagLogLevel}
     */
    getLogLevel(constructorOption) {
        const logLevel = this.utils.returnNextIfNullOrUndefined([process.env.EZ_LOGLEVEL, constructorOption], "error");
        
        if(logLevel == "all") {
            return DiagLogLevel.ALL;
        } else if(logLevel == "info") {
            return DiagLogLevel.INFO;
        } else if(logLevel == "debug") {
            return DiagLogLevel.DEBUG;
        } else if(logLevel == "warn") {
            return DiagLogLevel.WARN;
        } else if(logLevel == "error") {
            return DiagLogLevel.ERROR;
        } else if(logLevel == "none") {
            return DiagLogLevel.NONE;
        } else {
            this.utils.logAndThrowException(this.log, "ez-instrument: Invalid log level.");
        }
    }

    /**
     * @private
     * @param {string} exporterType
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
            this.utils.logAndThrowException(this.log, "ez-instrument: Invalid exporter type.");
        }
    }

    /**
     * @private
     * @param {EZInstrumentOptions} constructorOptions
     * @returns {FinalOptions}
     */
    getFinalOptions(constructorOptions) {
        let finalOptions = new FinalOptions();

        finalOptions.service.name = this.utils.returnNextIfNullOrUndefined([constructorOptions.service.name], finalOptions.service.name);
        finalOptions.service.namespace = this.utils.returnNextIfNullOrUndefined([constructorOptions.service.namespace], finalOptions.service.namespace);
        finalOptions.service.version = this.utils.returnNextIfNullOrUndefined([constructorOptions.service.version], finalOptions.service.version);

        finalOptions.deployment.environment = this.utils.returnNextIfNullOrUndefined([constructorOptions.deployment.environment], finalOptions.deployment.environment);
        
        finalOptions.export.url = this.utils.returnNextIfNullOrUndefined([constructorOptions.export.url], finalOptions.export.url);
        finalOptions.export.enableConsoleExporter = this.utils.returnNextIfNullOrUndefined([constructorOptions.export.enableConsoleExporter], finalOptions.export.enableConsoleExporter);
        finalOptions.export.exporterType = this.utils.returnNextIfNullOrUndefined([constructorOptions.export.exporterType], finalOptions.export.exporterType);
        finalOptions.export.exporter = this.getExporter(finalOptions.export.exporterType, finalOptions.export.url);

        finalOptions.export.batchSpanProcessorConfig.exportTimeoutMillis = this.utils.returnNextIfNullOrUndefined([constructorOptions.export.batchSpanProcessorConfig.exportTimeoutMillis], 
            finalOptions.export.batchSpanProcessorConfig.exportTimeoutMillis);
        finalOptions.export.batchSpanProcessorConfig.maxExportBatchSize = this.utils.returnNextIfNullOrUndefined([constructorOptions.export.batchSpanProcessorConfig.maxExportBatchSize],
            finalOptions.export.batchSpanProcessorConfig.maxExportBatchSize);
        finalOptions.export.batchSpanProcessorConfig.maxQueueSize = this.utils.returnNextIfNullOrUndefined([constructorOptions.export.batchSpanProcessorConfig.maxQueueSize],
            finalOptions.export.batchSpanProcessorConfig.maxQueueSize);
        finalOptions.export.batchSpanProcessorConfig.scheduledDelayMillis = this.utils.returnNextIfNullOrUndefined([constructorOptions.export.batchSpanProcessorConfig.scheduledDelayMillis],
            finalOptions.export.batchSpanProcessorConfig.scheduledDelayMillis);


        (finalOptions.service.name === "") ? 
            this.utils.logAndThrowException(this.log, "ez-instument: Cannot initialize tracing without service name.")
            : this.log.debug('ez-instrument: Final options verified');

        return finalOptions;
    }

    /**
     * @private
     * @param {FinalOptions} finalOptions 
     */
    logFinalOptions(finalOptions) {
        this.log.info(`ez-instrument: service.name = ${finalOptions.service.name}`);
        this.log.info(`ez-instrument: service.namespace = ${finalOptions.service.namespace}`);
        this.log.info(`ez-instrument: service.version = ${finalOptions.service.version}`);

        this.log.info(`ez-instrument: deployment.environment = ${finalOptions.deployment.environment}`);

        this.log.info(`ez-instrument: export.exporterType = ${finalOptions.export.exporterType}`);
        this.log.info(`ez-instrument: export.url = ${finalOptions.export.url}`);
        this.log.info(`ez-instrument: export.enableConsoleExporter = ${finalOptions.export.enableConsoleExporter}`);

        this.log.info(`ez-instrument: batchSpanProcessorConfig.exportTimeoutMillis = ${finalOptions.export.batchSpanProcessorConfig.exportTimeoutMillis}`);
        this.log.info(`ez-instrument: batchSpanProcessorConfig.maxExportBatchSize = ${finalOptions.export.batchSpanProcessorConfig.maxExportBatchSize}`);
        this.log.info(`ez-instrument: batchSpanProcessorConfig.maxQueueSize = ${finalOptions.export.batchSpanProcessorConfig.maxQueueSize}`);
        this.log.info(`ez-instrument: batchSpanProcessorConfig.scheduledDelayMillis = ${finalOptions.export.batchSpanProcessorConfig.scheduledDelayMillis}`);
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

            this.log.info("ez-instrument: Initializing OpenTelemetry tracing.");

            const serviceResources = new Resource({
                [SemanticResourceAttributes.SERVICE_NAME]: finalOptions.service.name,
                [SemanticResourceAttributes.SERVICE_NAMESPACE]: finalOptions.service.namespace,
                [SemanticResourceAttributes.SERVICE_VERSION]: finalOptions.service.version,

                [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: finalOptions.deployment.environment
            });

            const nodeTraceProvider = new NodeTracerProvider({
                resource: serviceResources
            });

            nodeTraceProvider.addSpanProcessor(new BatchSpanProcessor(finalOptions.export.exporter, {
                exportTimeoutMillis: finalOptions.export.batchSpanProcessorConfig.exportTimeoutMillis,
                maxExportBatchSize: finalOptions.export.batchSpanProcessorConfig.maxExportBatchSize,
                maxQueueSize: finalOptions.export.batchSpanProcessorConfig.maxQueueSize,
                scheduledDelayMillis: finalOptions.export.batchSpanProcessorConfig.scheduledDelayMillis
            }));

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

            this.log.info('ez-instrument: Initialized OpenTelemetry tracing.');

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