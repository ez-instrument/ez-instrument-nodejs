# ez-instrument-nodejs
##### _Part of the EZ-Instrument family of libraries._

---
<br/>

## About

EZ-Instrument is a wrapper library for OpenTelemetry. Using this library, you can easily instrument your Node.JS application for traces without worrying about setting up OpenTelemetry tracing yourself.

EZ-Instrument is a quick and easy way to instrument your application (especially if you are dealing with tons of microservices!).

<br/>

[Learn more about OpenTelemetry.](https://opentelemetry.io)

<br/>

### Instrumentations
EZ-Instrument supports both automatic & manual instrumentations.

However, by default automatic instrumentation is enabled & supported only for:
- [@opentelemetry/instrumentation-http](https://github.com/open-telemetry/opentelemetry-js/tree/main/experimental/packages/opentelemetry-instrumentation-http)
- [@opentelemetry/instrumentation-express](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/node/opentelemetry-instrumentation-express)

> _There is currently no way to customize them as well. This library is currently a work-in-progress project. Future versions will allow for greater flexibility in dealing with automatic instrumentation libraries._

<br/>

## Installation

> _This project has not been published to the npm public registry yet._

<br/>

## Usage

### Automatic Instrumentation

Auto-instrumentation requires tracing to be initialized via the `EZInstrument` class for configuring as well as exporting traces.

```js
// import
const { EZInstrument } = require('ez-instrument');

// configure
const tracing = new EZInstrument({
    enableTracing: true,
    service: {
        name: "My Awesome Service"
    }
});

// init
tracing.initTracing();
```

<br/>

### Manual Instrumentation

Manual instrumentation requires tracing to be initialized via the `EZInstrument` class for exporting traces. Import the `globalTracer` to start creating spans manually.

```js
// use globalTracer to create spans manually
// use getSpanContext() to nest spans
const { EZInstrument, globalTracer: tracer, getSpanContext } = require('ez-instrument');

const tracing = new EZInstrument({
    enableTracing: true,
    service: {
        name: "My Awesome Service"
    }
});

tracing.initTracing();



let span = tracer.startSpan("my span name");    // start span

// do some work

span.end()                                      // always end spans



let anotherSpan = tracer.startSpan("another span");
// spans can be nested by passing context of the parent span to the child
let childSpan = tracer.startSpan("child span", {}, getSpanContext(anotherSpan));

// do some more work

childSpan.end();
anotherSpan.end();
```

<br/>

## Configuration

`EZInstrument` requires some settings to be changed before tracing can be initialized.

Setting options can be configured in the following ways:
1. Via environment variables.
2. Via YAML vonfiguration file _(not implemented in code yet)_.
3. Via `EZInstrumentOptions` class.

The different input ways are listed above in the order of precedence. For example, if you have used `EZInstrumentOptions` as well as environment variables, the environment variables will override any setting defined in `EZInstrumentOptions`.

> _While a few setting options are mandatory, almost all of them are optional._

<br/>

### Environment Variables

> _Entries marked with **`>`** are mandatory! Rest all are optional._

| Name | Acceptable values | Default | Description |
| --- | --- | --- | --- |
| **_> EZ_ENABLE_TRACING_** | `true`, `false` | `false` | Toggle to enable/disable tracing. |
| **_> EZ_SERVICE_NAME_** | string | `null` | A name for your service. E.g. `Database Writer`, `Session Master` |
| EZ_SERVICE_NAMESPACE | string | `null` | A namespace for your service. E.g. `authorization`, `database` |
| EZ_SERVICE_VERSION | string | `null` | Version of your service. E.g. `1.2.3`, `v3.2.1` |
 EZ_DEPLOYMENT_ENVIRONMENT | string | `null` | Name of environment where your service is deployed in. E.g. `staging`, `production` |
| EZ_EXPORT_URL | string, full qualified URL | depends on the exporter | The export URL where the collected telemetry will be exported to for processing and/or storage. E.g. `https://my.telemetry-collector.net:4567/v1/traces`|
| EZ_EXPORTER_TYPE | `http`, `grpc`, `otel-http`, `otel-grpc` | `http` | Type of exporter which will be used to export telemetry. |
| EZ_ENABLE_CONSOLE_EXPORTER | `true`, `false` | `false` | Toggle to enable/disable the Console Span Exporter which will print out the created spans to stdout. |
| EZ_EXPORT_TIMEOUT_MILLIS | number | 30000 | How long the export can run before it is cancelled. |
| EZ_MAX_EXPORT_BATCH_SIZE | number | 512 | The maximum batch size of every export. It must be smaller or equal to `EZ_MAX_QUEUE_SIZE`. |
| EZ_MAX_QUEUE_SIZE | number | 2048 | The maximum queue size. After the size is reached spans are dropped. |
| EZ_SCHEDULED_DELAY_MILLIS | number | 5000 | The delay interval in milliseconds between two consecutive exports. |
| EZ_LOGLEVEL | `none`, `info`, `debug`, `warn`, `error`, `verbose`, `all` | `error` | Set log level. This option affects the OpenTelemetry log level as well. |


### `EZInstrumentOptions` class

You can either import this class, manipulate its properties & pass it to `EZInstrument`, or initialize it straight in the `EZInstrument` class constructor.

> _If you use tools like VS Code or NVIM (with Coc plugin), intellisense will prove to be very useful._

```js
const { EZInstrument, EZInstrumentOptions } = require('ez-instrument');

const options = new EZInstrumentOptions();
options.enableTracing = true;
options.service.name = "My service name";

const tracing = new EZInstrument(options);
tracing.initTracing();
```
or
```js
const { EZInstrument } = require('ez-instrument');

const tracing = new EZInstrument({
    enableTracing: true,
    service: {
        name: "My serivce name"
    }
});
tracing.initTracing();
```

<br/>

## Contributions

Contributions are not welcomed at the moment and will be accepted only after version `1.0.0` has been released. In the meanwhile, do feel free to raise issues.

<br/>

## License

GNU Lesser General Public License version 3 - see [LICENSE](https://github.com/Pro19/ez-instrument-nodejs/blob/master/LICENSE) for more information.

---

<br/>

## Planned Changes
> _This is a list of planned changes which could either be a new feature or an improvement to the project. Please feel free to raise a PR to contribute to this project. Do read the [Contributions](#contributions) section above before raising a PR._

<br/>

- [x] Initial working basic intrumentation.
- [x] Manual instrumentation support.
- [ ] Support for opentelemery automatic instrumentation libraries.
- [x] Environment variable support.
- [ ] YAML config file support.
- [ ] CLI to generate a template YAML config file and/or a `.env` file.
- [ ] Unit tests.
- [ ] Setup CI/CD for publishing to npm & for running tests when merging to master branch.