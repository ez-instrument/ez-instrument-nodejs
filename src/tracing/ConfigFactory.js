const { EZInstrumentOptions } = require('./EZInstrumentOptions');

/**
 * Class to fetch configurations from different sources. All methods should only return objects of class EZInstrumentOptions.
 */
class ConfigFactory {
    /**
     * Method to read configuration from environment variables.
     * @returns {EZInstrumentOptions}
     */
     getConfigFromEnvironment() {
        const environmentConfig = new EZInstrumentOptions();
        environmentConfig.service.name = process.env.EZ_SERVICE_NAME;
        environmentConfig.service.namespace = process.env.EZ_SERVICE_NAMESPACE;
        environmentConfig.service.version = process.env.EZ_SERVICE_VERSION;

        environmentConfig.deployment.environment = process.env.EZ_DEPLOYMENT_ENVIRONMENT;

        environmentConfig.export.url = process.env.EZ_EXPORT_URL;
        environmentConfig.export.exporterType = process.env.EZ_EXPORTER_TYPE;
        environmentConfig.export.enableConsoleExporter = process.env.EZ_ENABLE_CONSOLE_EXPORTER;
        environmentConfig.export.batchSpanProcessorConfig.exportTimeoutMillis = process.env.EZ_EXPORT_TIMEOUT_MILLIS;
        environmentConfig.export.batchSpanProcessorConfig.maxExportBatchSize = process.env.EZ_MAX_EXPORT_BATCH_SIZE;
        environmentConfig.export.batchSpanProcessorConfig.maxQueueSize = process.env.EZ_MAX_QUEUE_SIZE;
        environmentConfig.export.batchSpanProcessorConfig.scheduledDelayMillis = process.env.EZ_SCHEDULED_DELAY_MILLIS;

        return environmentConfig;
    }
}

exports.ConfigFactory = ConfigFactory;