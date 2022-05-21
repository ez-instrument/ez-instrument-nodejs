# CHANGELOG

<br/>

## `0.4.2-beta`
- Bug fix: all service related environment variables were getting assigned to `service.name` value making `service.namespace` & `service.version` to be blank strings.

## `0.4.1-beta`
- Updated README.md with more info on configuration and other stuff.
- Restructured codebase with a new class: `FinalOptionsBuilder`.

## `0.4.0-beta`
- Added support for environment variables as an input source.
- Restructured codebase with a new class: `ConfigFactory`.

## `0.3.3-beta`
- Implemented better logging.
- Implemented better error handling.
- Implemented better final option building logic.
- Added support for two env vars: `EZ_ENABLE_TRACING` & `EZ_LOGLEVEL`.
- Added support for batch span processor configuration.

## `0.2.0-beta`
- Initial code driven API ready (`EZInstrument` & `EZInstrumentOptions`).

## `0.1.0-alpha`
- Added support for manual instrumentation via global tracer provider.
- Added support for basic automatic instrumentation.
- Added usage examples in README.md.

## `0.0.0-alpha.1`
- Initial user facing class API defined.
- Updated README.md.

## `0.0.0-alpha`
- Project initialised.
- Selected license (LGPL-v3).