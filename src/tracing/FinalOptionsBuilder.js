const { EZInstrumentOptions } = require('./EZInstrumentOptions');
const { FinalOptions } = require('./FinalOptions');
const { GeneralUtils } = require('../utils/GeneralUtils');
const { diag: logger } = require('@opentelemetry/api');

/**
 * Class to build the final options which will be used to initialize OpenTelemetry tracing.
 * This class should take {@link EZInstrumentOptions} as input & return only {@link FinalOptions} as output.
 */
class FinalOptionsBuilder {
    /**
     * @param {EZInstrumentOptions} constructorOptions
     * @param {EZInstrumentOptions} environmentOptions
     */
    constructor(constructorOptions, environmentOptions) {
        this._utils = new GeneralUtils();
        let _constructorOptions = this.verifyOptions(constructorOptions);
        this._finalOptions = this.buildFinalOptions(_constructorOptions, environmentOptions);
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
     * @param {EZInstrumentOptions} inputOptions
     * @returns {EZInstrumentOptions}
     */
    verifyOptions(inputOptions) {
        let _finalOptions = new EZInstrumentOptions();
        if(inputOptions) {
            if(inputOptions.service) {
                _finalOptions.service = inputOptions.service;
            }
            if(inputOptions.deployment) {
                _finalOptions.deployment = inputOptions.deployment;
            }
            if(inputOptions.export) {
                _finalOptions.export = inputOptions.export;
                if(inputOptions.export.batchSpanProcessorConfig) {
                    _finalOptions.export.batchSpanProcessorConfig = inputOptions.export.batchSpanProcessorConfig;
                }
            }
            if(inputOptions.autoInstrumentationOptions) {
                _finalOptions.autoInstrumentationOptions = inputOptions.autoInstrumentationOptions;
            }
        }

        return _finalOptions;
    }

    /**
     * @private
     * @param {string} exporterType
     * @param {string | null} exportUrl
     * @returns {null | OTLPTraceExporterHttp | OTLPTraceExporterGrpc}
     */
     getExporter(exporterType, exportUrl) {
        exporterType = exporterType.toLowerCase();
        if(exporterType === "none") {
            logger.warn("ez-instrument: No exporter has been selected.");
            return null;
        } else if(exporterType === 'http' || exporterType === 'otel-http') {
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
            this._utils.logAndThrowException("ez-instrument: Invalid exporter type.");
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
            environmentOptions.service.name,
            constructorOptions.service.name
        ], finalOptions.service.name);
        finalOptions.service.namespace = this._utils.returnNextIfNullOrUndefined([
            environmentOptions.service.namespace,
            constructorOptions.service.namespace
        ], finalOptions.service.namespace);
        finalOptions.service.version = this._utils.returnNextIfNullOrUndefined([
            environmentOptions.service.version,
            constructorOptions.service.version
        ], finalOptions.service.version);

        // make a DeploymentOptionsConfigBuilder class for this section
        finalOptions.deployment.environment = this._utils.returnNextIfNullOrUndefined([
            environmentOptions.deployment.environment,
            constructorOptions.deployment.environment
        ], finalOptions.deployment.environment);
        
        // make a ExportOptionsConfigBuilder class for this section
        // ExportOptionsConfigBuilder will depend on BatchSpanProcessorConfigBuilder class
        finalOptions.export.url = this._utils.returnNextIfNullOrUndefined([
            environmentOptions.export.url,
            constructorOptions.export.url
        ], finalOptions.export.url);
        finalOptions.export.enableConsoleExporter = this._utils.returnNextIfNullOrUndefined([
            environmentOptions.export.enableConsoleExporter,
            constructorOptions.export.enableConsoleExporter
        ], finalOptions.export.enableConsoleExporter);
        finalOptions.export.exporterType = this._utils.returnNextIfNullOrUndefined([
            environmentOptions.export.exporterType,
            constructorOptions.export.exporterType
        ], finalOptions.export.exporterType);
        finalOptions.export.exporter = this.getExporter(finalOptions.export.exporterType, finalOptions.export.url);

        // make a BatchSpanProcessorConfigBuilder class for this section
        finalOptions.export.batchSpanProcessorConfig.exportTimeoutMillis = this._utils.returnNextIfNullOrUndefined([
            environmentOptions.export.batchSpanProcessorConfig.exportTimeoutMillis,
            constructorOptions.export.batchSpanProcessorConfig.exportTimeoutMillis
        ], finalOptions.export.batchSpanProcessorConfig.exportTimeoutMillis);

        finalOptions.export.batchSpanProcessorConfig.maxExportBatchSize = this._utils.returnNextIfNullOrUndefined([
            environmentOptions.export.batchSpanProcessorConfig.maxExportBatchSize,
            constructorOptions.export.batchSpanProcessorConfig.maxExportBatchSize
        ], finalOptions.export.batchSpanProcessorConfig.maxExportBatchSize);

        finalOptions.export.batchSpanProcessorConfig.maxQueueSize = this._utils.returnNextIfNullOrUndefined([
            environmentOptions.export.batchSpanProcessorConfig.maxQueueSize,
            constructorOptions.export.batchSpanProcessorConfig.maxQueueSize
        ],
            finalOptions.export.batchSpanProcessorConfig.maxQueueSize);
        finalOptions.export.batchSpanProcessorConfig.scheduledDelayMillis = this._utils.returnNextIfNullOrUndefined([
            environmentOptions.export.batchSpanProcessorConfig.scheduledDelayMillis,
            constructorOptions.export.batchSpanProcessorConfig.scheduledDelayMillis
        ], finalOptions.export.batchSpanProcessorConfig.scheduledDelayMillis);

        finalOptions.autoInstrumentationOptions = constructorOptions.autoInstrumentationOptions;

        finalOptions.captureHostInformation = this._utils.returnNextIfNullOrUndefined([
            environmentOptions.captureHostInformation,
            constructorOptions.captureHostInformation
        ], finalOptions.captureHostInformation);

        // FinalOptions verification should either be its own function or class
        (finalOptions.service.name === "") ? 
            this._utils.logAndThrowException("ez-instument: Cannot initialize tracing without service name.")
            : logger.debug('ez-instrument: Final options verified');

        return finalOptions;
    }
}

exports.FinalOptionsBuilder = FinalOptionsBuilder;
