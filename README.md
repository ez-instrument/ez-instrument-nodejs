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

## Usage

### Automatic Instrumentation

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

```js
// Manual instrumentation requires tracing to be initialized via EZInstrument class for exporting traces


// use globalTracer to create spans manually
const { EZInstrument, globalTracer: tracer } = require('ez-instrument');

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
```


<br/>

## Contributions

Contributions are not welcomed at the moment. I do intend to involve the community for contributions only after v1.0.0 has been publicly released.

---

<br/>

## Planned Changes
> _This is a list of planned changes which could either be a new feature or an improvement to an existing feature. Please feel free to raise a PR to contribute to this project. Do read the [Contributions](#contributions) section above before raising a PR._

<br/>

- [x] Initial working basic intrumentation.
- [x] Manual instrumentation support.
- [ ] Support for opentelemery automatic instrumentation libraries.
- [ ] Environment variable support.
- [ ] YAML config file support.
- [ ] CLI to generate a template YAML config file and/or a `.env` file.
- [ ] Unit tests.