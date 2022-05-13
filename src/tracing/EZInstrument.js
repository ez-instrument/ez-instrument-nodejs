const { EZInstrumentOptions } = require('./EZInstrumentOptions')

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
        console.info(options);
        this.tracingOptions = options;
    }

    /**
     * Initialize tracing.
     * @public
     * @returns {void}
     */
    initTracing() {
        if(this.tracingOptions.enableTracing === true) {
            this.setOpenTelemetryTracing();
        }
    }

    /**
     * @private
     */
    setOpenTelemetryTracing() {
        try {
            const { BatchSpanProcessor, ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
            const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
            
            const { OTLPTraceExporter: OTLPTraceExporterHttp } = require('@opentelemetry/exporter-trace-otlp-http');
            const { OTLPTraceExporter: OTLPTraceExporterGrpc } = require('@opentelemetry/exporter-trace-otlp-grpc');
            
            const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
            const { Resource } = require('@opentelemetry/resources');

            const { registerInstrumentations } = require('@opentelemetry/instrumentation');
            const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');
            const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');

            const { DiagConsoleLogger, DiagLogLevel, diag } = require('@opentelemetry/api');
            diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.VERBOSE);

            diag.info("EZ-Instrumentation is initializing OpenTelemetry tracing");

            const serviceResources = new Resource({
                [SemanticResourceAttributes.SERVICE_NAME]: this.tracingOptions.service.name,
                [SemanticResourceAttributes.SERVICE_NAMESPACE]: this.tracingOptions.service.namespace,
                [SemanticResourceAttributes.SERVICE_VERSION]: this.tracingOptions.service.version,

                [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: this.tracingOptions.deployment.environment
            });

            const nodeTraceProvider = new NodeTracerProvider({
                resource: serviceResources
            });

            const httpExporter = new OTLPTraceExporterHttp({
                url: this.tracingOptions.export.url
            });

            const grpcExporter = new OTLPTraceExporterGrpc({
                url: this.tracingOptions.export.url
            });

            let traceExporter = null;
            if(this.tracingOptions.export.exporterType === "http") {
                traceExporter = httpExporter;
            } else if(this.tracingOptions.export.exporterType === "grpc") {
                traceExporter = grpcExporter;
            } else {
                traceExporter = httpExporter;
            }

            nodeTraceProvider.addSpanProcessor(new BatchSpanProcessor(traceExporter));

            if(this.tracingOptions.export.enableConsoleExporter === true) {
                nodeTraceProvider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
            }

            nodeTraceProvider.register();

            const unloadInstrumentation = registerInstrumentations({
                tracerProvider: nodeTraceProvider,
                instrumentations: [
                    new HttpInstrumentation({
                        enabled: true
                    }),
                    new ExpressInstrumentation({
                        enabled: true
                    })
                ]
            });

            ['SIGINT', 'SIGTERM'].forEach(signal => {
                process.on(signal, ()=>{
                    unloadInstrumentation();
                    nodeTraceProvider.shutdown();
                });
            });

        } catch (error) {
            console.error(error);
        }
    }
}

exports.EZInstrument = EZInstrument;