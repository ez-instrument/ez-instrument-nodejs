const { EZInstrument } = require('./tracing/EZInstrument');
const { EZInstrumentOptions } = require('./tracing/EZInstrumentOptions');
const { trace, context, SpanStatusCode } = require('@opentelemetry/api');
const { Span } = require('@opentelemetry/sdk-trace-base');

/**
 * Tracer from the OpenTelemetry global tracer provider which lets you creates spans manually.
 */
const globalTracer = trace.getTracer();

/**
 * Returns span context for nesting spans.
 * @param {Span} span
 */
function getSpanContext(span) {
    const ctx = trace.setSpan(context.active(), span);
    return ctx;
}

module.exports = {
    EZInstrument,
    EZInstrumentOptions,
    globalTracer,
    getSpanContext,
    SpanStatusCode
}
