const { diag: logger } = require("@opentelemetry/api");
const { DnsInstrumentation } = require("@opentelemetry/instrumentation-dns");
const { ExpressInstrumentation } = require("@opentelemetry/instrumentation-express");
const { GraphQLInstrumentation } = require("@opentelemetry/instrumentation-graphql");
const { GrpcInstrumentation } = require("@opentelemetry/instrumentation-grpc");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { IORedisInstrumentation } = require("@opentelemetry/instrumentation-ioredis");
const { MemcachedInstrumentation } = require("@opentelemetry/instrumentation-memcached");
const { MongoDBInstrumentation } = require("@opentelemetry/instrumentation-mongodb");
const { MySQL2Instrumentation } = require("@opentelemetry/instrumentation-mysql2");
const { MySQLInstrumentation } = require("@opentelemetry/instrumentation-mysql");
const { NetInstrumentation } = require("@opentelemetry/instrumentation-net");
const { PgInstrumentation } = require("@opentelemetry/instrumentation-pg");
const { RedisInstrumentation } = require("@opentelemetry/instrumentation-redis");
const { RedisInstrumentation: Redis4Instrumentation } = require("@opentelemetry/instrumentation-redis-4");

const { GeneralUtils } = require('../utils/GeneralUtils');

const otelAutoInstrumentationMap = {
    '@opentelemetry/instrumentation-dns': DnsInstrumentation,
    '@opentelemetry/instrumentation-express': ExpressInstrumentation,
    '@opentelemetry/instrumentation-graphql': GraphQLInstrumentation,
    '@opentelemetry/instrumentation-grpc': GrpcInstrumentation,
    '@opentelemetry/instrumentation-http': HttpInstrumentation,
    '@opentelemetry/instrumentation-ioredis': IORedisInstrumentation,
    '@opentelemetry/instrumentation-memcached': MemcachedInstrumentation,
    '@opentelemetry/instrumentation-mongodb': MongoDBInstrumentation,
    '@opentelemetry/instrumentation-mysql2': MySQL2Instrumentation,
    '@opentelemetry/instrumentation-mysql': MySQLInstrumentation,
    '@opentelemetry/instrumentation-net': NetInstrumentation,
    '@opentelemetry/instrumentation-pg': PgInstrumentation,
    '@opentelemetry/instrumentation-redis': RedisInstrumentation,
    '@opentelemetry/instrumentation-redis-4': Redis4Instrumentation
};

function loadAutoInstrumentation(input = {}) {
    // Check if input contains the correct instrumentation libaries from the map
    for(const inputLibrary of Object.keys(input)) {
        if(!Object.prototype.hasOwnProperty.call(otelAutoInstrumentationMap, inputLibrary)) {
            new GeneralUtils().logAndThrowException(`ez-instrument: ${inputLibrary} not found.`);
        }
    }
    
    const selectedLibraries = [];
    
    // Disable libraries with empty config else use user config for selected instrumentation
    for (const library of Object.keys(otelAutoInstrumentationMap)) {
        let currentLibrary = otelAutoInstrumentationMap[library];
        let userInput = input[library];
        let libraryConfig = (userInput !== null && userInput !== void 0 ? userInput : { enabled: false });
        if (libraryConfig.enabled === true) {
            try {
                selectedLibraries.push(new currentLibrary(libraryConfig));
                logger.debug(`ez-instrument: ${library} selected.`);
            } catch (error) {
                logger.error(error);
            }
        } else {
            logger.debug(`ez-instrument: ${library} not selected.`);
        }
    }

    return selectedLibraries;
}

module.exports = {
    loadAutoInstrumentation,
    otelAutoInstrumentationMap
}
