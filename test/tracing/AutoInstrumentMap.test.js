/* global describe, it */

const { assert } = require('chai');

describe('AutoInstrumentMap.js', ()=>{

    it('can import', ()=>{
        const obj = require('../../src/tracing/AutoInstrumentMap');
        assert.exists(obj.loadAutoInstrumentation());
        assert.exists(obj.otelAutoInstrumentationMap);
    });

    describe('otelAutoInstrumentationMap', ()=>{
        const { otelAutoInstrumentationMap } = require('../../src/tracing/AutoInstrumentMap');
        
        it('map has 14 libraries', ()=>{
            const libCount = Object.keys(otelAutoInstrumentationMap).length;
            assert.equal(libCount, 14);
        });

        it('all libraries are from opentelemetry', ()=>{
            Object.keys(otelAutoInstrumentationMap).forEach(library =>{
                assert.include(library, "@opentelemetry/instrumentation-");
            });
        });
    });

    describe('loadAutoInstrumentation()', ()=>{
        const { loadAutoInstrumentation } = require('../../src/tracing/AutoInstrumentMap');

        it('no input results in empty output', ()=>{
            assert.isArray(loadAutoInstrumentation());
            assert.isEmpty(loadAutoInstrumentation());
        });

        it('empty input results in empty output', ()=>{
            assert.isArray(loadAutoInstrumentation({}));
            assert.isEmpty(loadAutoInstrumentation({}));
        });

        it('correct input library is selected', ()=>{
            const input = {
                '@opentelemetry/instrumentation-dns': { enabled: true },
                '@opentelemetry/instrumentation-express': { enabled: true },
                '@opentelemetry/instrumentation-http': { enabled: false }
            }
            const output = loadAutoInstrumentation(input);
            assert.isArray(output);
            assert.isNotEmpty(output);
            assert.lengthOf(output, 2);
            assert.propertyVal(output[0], 'instrumentationName', '@opentelemetry/instrumentation-dns');
            assert.propertyVal(output[0], '_enabled', true);
            assert.propertyVal(output[1], 'instrumentationName', '@opentelemetry/instrumentation-express');
            assert.propertyVal(output[1], '_enabled', true);
        });

        it('incorrect input library is rejected', ()=>{
            const input = {
                '@opentelemetry/instrumentation-abcdefghijk': { enabled: true }
            }
            assert.throws(()=>{
                loadAutoInstrumentation(input);
            }, 'ez-instrument: @opentelemetry/instrumentation-abcdefghijk not found.');
        });
    });
});
