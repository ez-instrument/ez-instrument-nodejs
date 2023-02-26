# CHANGELOG

<br/>

## `0.10.1`
- Added `none` exporter type.
- Bug fix: Fixed incorrect return type for verifyOptions().

## `0.9.0`

- Added unit tests for `ConfigFactory.js` & `AutoInstrumentMap.js`.
- Bug fix: `EZInstrument` would throw exceptions if some options were not given to the constructor input.
- Fixed an incorrect log message.
- Optimized `GeneralUtils`.
  - Removed `isNullOrUndefinedOrEmpty()`.
  - Optimized `isNullOrUndefined()`.
  - Optimized `returnNextIfNullOrUndefined()`.

## `0.8.2`

- Added basic initial automatic instrumentation library support.
- Added support for capturing host, os & container related information to the semantic resource attributes.
- Bug fix: using the `verbose` log level was throwing exceptions as it was not implemented in code.
- Improved the way logger is used throughout the library.

## `0.7.0`

- Exposed `@opentelemetry/semantic-conventions`'s `SemanticAttributes` object via `ez-instrument`.

## `0.6.10`

- Replaced `console.log` with OpenTelemetry logger.

## `0.6.9`

- Added first batch of unit tests (using mocha & chai).
  - 20 tests covering `ConfigFactory.js` & `index.js` primarily.
- Setup code coverage reporting (using nyc).
  - Initial coverage percentage set to 30% overall.
  - Target for `v1.0.0` release is overall coverage of 50% or higher.
- Setup linting & style support (using eslint & prettier).
- Setup pre-commit hook for running unit tests before committing (using husky).
- Changes to code comments and minor cosmetic changes.
- Bug fix: '==' was being used instead of '===' in `EZInstrument.getLogLevel()`.
- Bug fix: Incorrert order of config selection was being done in `FinalOptionsBuilder.buildFinalOptions()`.
- Project goals defined more clearly in the 'Planned Changes' section in `README.md`.

## `0.5.0-beta`

- Added support for nesting spans via `getSpanContext()` method.
- Exposed `@opentelemetry/api`'s `SpanStatusCode` enum via `ez-instrument`.

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
