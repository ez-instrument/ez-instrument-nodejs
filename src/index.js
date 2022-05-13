const { EZInstrument } = require('./tracing/EZInstrument');
const { EZInstrumentOptions } = require('./tracing/EZInstrumentOptions');
const { trace } = require('@opentelemetry/api');

/**
 * Tracer from the OpenTelemetry global tracer provider which lets you creates spans manually.
 */
const globalTracer = trace.getTracer();

module.exports = {
    EZInstrument,
    EZInstrumentOptions,
    globalTracer
}