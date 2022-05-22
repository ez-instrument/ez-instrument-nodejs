/* global describe, it */

const { assert } = require('chai');

describe('index.js', ()=>{
    const { EZInstrument, EZInstrumentOptions, SpanStatusCode, getSpanContext, globalTracer } = require('../src/index.js');
    
    describe('classes', ()=>{
        it('should import EZInstrument', ()=>{
            assert.exists(new EZInstrument());
        });

        it('should import EZInstrumentOptions', ()=>{
            assert.exists(new EZInstrumentOptions());
        });        
    });

    describe('functions', ()=>{
        it('should import getSpanContext', ()=>{
            assert.exists(getSpanContext(null));
        });
    });

    describe('objects', ()=>{
        it('should import SpanStatusCode', ()=>{
            assert.exists(SpanStatusCode);
        });

        it('should import globalTracer', ()=>{
            assert.exists(globalTracer);
        });
    });
});
