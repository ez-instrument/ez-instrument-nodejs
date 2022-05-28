const { EZInstrumentOptions } = require('./EZInstrumentOptions');
const { FinalOptions } = require('./FinalOptions');
const { GeneralUtils } = require('../utils/GeneralUtils');
const { ConfigFactory } = require('./ConfigFactory');
const { FinalOptionsBuilder } = require('./FinalOptionsBuilder');

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
        
        if(!this.utils.isNullOrUndefined(options)) {
            this.constructorOptions = options;
        } else {
            this.constructorOptions = new EZInstrumentOptions();
        }
        
        this.log = diag;
        this.log.setLogger(new DiagConsoleLogger(), this.getLogLevel(this.constructorOptions.logLevel));
    }

    /**
     * Initialize tracing.
     * @public
     * @returns {void}
     */
    initTracing() {
        try {
            // fetch enableTracing flag YAML file as well
            if(this.shouldEnableTracing()) {
                const configFactory = new ConfigFactory();
                const environmentOptions = configFactory.getConfigFromEnvironment();
                
                const builder = new FinalOptionsBuilder(this.log, this.constructorOptions, environmentOptions);
                const finalOptions = builder.getFinalOptions();
                
                this.logFinalOptions(finalOptions);
                
                this.setOpenTelemetryTracing(finalOptions);
            }
        } catch (error) {
            this.log.error(error);
        }
    }

    /**
     * Will add check for YAML config file later.
     * @private
     */
    shouldEnableTracing() {
        const enableTracing = this.utils.returnNextIfNullOrUndefined([process.env.EZ_ENABLE_TRACING, this.constructorOptions.enableTracing], "false");

        return (enableTracing.toString().toLowerCase() === "true") ? true : false;
    }

    /**
     * @private
     * @param {string} logLevel
     * @returns {DiagLogLevel}
     */
    getLogLevel(constructorOption) {
        const logLevel = this.utils.returnNextIfNullOrUndefined([process.env.EZ_LOGLEVEL, constructorOption], "error");
        
        if(logLevel === "all") {
            return DiagLogLevel.ALL;
        } else if(logLevel === "info") {
            return DiagLogLevel.INFO;
        } else if(logLevel === "debug") {
            return DiagLogLevel.DEBUG;
        } else if(logLevel === "warn") {
            return DiagLogLevel.WARN;
        } else if(logLevel === "error") {
            return DiagLogLevel.ERROR;
        } else if(logLevel === "none") {
            return DiagLogLevel.NONE;
        } else {
            this.utils.logAndThrowException(this.log, "ez-instrument: Invalid log level.");
        }
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
     * @private
     * @param {FinalOptions} finalOptions
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
                this.log.info('ez-instrument: Shutting down gracefully.');
                process.on(signal, ()=>{
                    unloadInstrumentations();
                    nodeTraceProvider.shutdown()
                    .catch(
                        (error) => {
                            this.log.error(error);
                        }
                    );
                });
            });

        } catch (error) {
            this.log.error(error);
        }
    }
}

exports.EZInstrument = EZInstrument;
