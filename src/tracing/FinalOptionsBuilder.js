const { EZInstrumentOptions } = require('./EZInstrumentOptions');
const { FinalOptions } = require('./FinalOptions');
const { GeneralUtils } = require('../utils/GeneralUtils');
const { DiagAPI } = require('@opentelemetry/api');

/**
 * Class to build the final options which will be used to initialize OpenTelemetry tracing.
 * This class should take {@link EZInstrumentOptions} as input & return only {@link FinalOptions} as output.
 */
class FinalOptionsBuilder {
    /**
     * @param {DiagAPI} logger
     * @param {EZInstrumentOptions} constructorOptions
     * @param {EZInstrumentOptions} environmentOptions
     */
    constructor(logger, constructorOptions, environmentOptions) {
        this._utils = new GeneralUtils();
        
        this.log = logger;
        if(this._utils.isNullOrUndefined(this.log)) {
            throw "ez-instrument: @opentelemetry/api logger not provided to FinalOptionsBuilder.";
        }

        this._finalOptions = this.buildFinalOptions(constructorOptions, environmentOptions);
    }

    /**
     * @public
     * @returns {FinalOptions}
     */
     getFinalOptions() {
        return this._finalOptions;
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
     * This function is way too big.
     * Split this function into classes.
     * @private
     * @param {EZInstrumentOptions} constructorOptions 
     * @param {EZInstrumentOptions} environmentOptions 
     * @returns {FinalOptions}
     */
    buildFinalOptions(constructorOptions, environmentOptions) {
        let finalOptions = new FinalOptions();

        // make a ServiceOptionsConfigBuilder class for this section
        finalOptions.service.name = this._utils.returnNextIfNullOrUndefined([
            constructorOptions.service.name,
            environmentOptions.service.name
        ], finalOptions.service.name);
        finalOptions.service.namespace = this._utils.returnNextIfNullOrUndefined([
            constructorOptions.service.namespace,
            environmentOptions.service.namespace
        ], finalOptions.service.namespace);
        finalOptions.service.version = this._utils.returnNextIfNullOrUndefined([
            constructorOptions.service.version,
            environmentOptions.service.version
        ], finalOptions.service.version);

        // make a DeploymentOptionsConfigBuilder class for this section
        finalOptions.deployment.environment = this._utils.returnNextIfNullOrUndefined([
            constructorOptions.deployment.environment,
            environmentOptions.deployment.environment
        ], finalOptions.deployment.environment);
        
        // make a ExportOptionsConfigBuilder class for this section
        // ExportOptionsConfigBuilder will depend on BatchSpanProcessorConfigBuilder class
        finalOptions.export.url = this._utils.returnNextIfNullOrUndefined([
            constructorOptions.export.url,
            environmentOptions.export.url
        ], finalOptions.export.url);
        finalOptions.export.enableConsoleExporter = this._utils.returnNextIfNullOrUndefined([
            constructorOptions.export.enableConsoleExporter,
            environmentOptions.export.enableConsoleExporter
        ], finalOptions.export.enableConsoleExporter);
        finalOptions.export.exporterType = this._utils.returnNextIfNullOrUndefined([
            constructorOptions.export.exporterType,
            environmentOptions.export.exporterType
        ], finalOptions.export.exporterType);
        finalOptions.export.exporter = this.getExporter(finalOptions.export.exporterType, finalOptions.export.url);

        // make a BatchSpanProcessorConfigBuilder class for this section
        finalOptions.export.batchSpanProcessorConfig.exportTimeoutMillis = this._utils.returnNextIfNullOrUndefined([
            constructorOptions.export.batchSpanProcessorConfig.exportTimeoutMillis,
            environmentOptions.export.batchSpanProcessorConfig.exportTimeoutMillis
        ], finalOptions.export.batchSpanProcessorConfig.exportTimeoutMillis);

        finalOptions.export.batchSpanProcessorConfig.maxExportBatchSize = this._utils.returnNextIfNullOrUndefined([
            constructorOptions.export.batchSpanProcessorConfig.maxExportBatchSize,
            environmentOptions.export.batchSpanProcessorConfig.maxExportBatchSize
        ], finalOptions.export.batchSpanProcessorConfig.maxExportBatchSize);

        finalOptions.export.batchSpanProcessorConfig.maxQueueSize = this._utils.returnNextIfNullOrUndefined([
            constructorOptions.export.batchSpanProcessorConfig.maxQueueSize,
            environmentOptions.export.batchSpanProcessorConfig.maxQueueSize
        ],
            finalOptions.export.batchSpanProcessorConfig.maxQueueSize);
        finalOptions.export.batchSpanProcessorConfig.scheduledDelayMillis = this._utils.returnNextIfNullOrUndefined([
            constructorOptions.export.batchSpanProcessorConfig.scheduledDelayMillis,
            environmentOptions.export.batchSpanProcessorConfig.scheduledDelayMillis
        ], finalOptions.export.batchSpanProcessorConfig.scheduledDelayMillis);

        // FinalOptions verification should either be its own function or class
        (finalOptions.service.name === "") ? 
            this._utils.logAndThrowException(this.log, "ez-instument: Cannot initialize tracing without service name.")
            : this.log.debug('ez-instrument: Final options verified');

        return finalOptions;
    }
}

exports.FinalOptionsBuilder = FinalOptionsBuilder;