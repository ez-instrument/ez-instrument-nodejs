/* global describe, it */

const { assert } = require('chai');

describe('EZInstrument.js', () => { 
    const { EZInstrument } = require('../../src/tracing/EZInstrument');

    it('should import empty constructor', ()=>{
        let obj = new EZInstrument();
        assert.exists(obj);
    });

    it('should import empty object input', ()=>{
        let obj = new EZInstrument({});
        assert.exists(obj);
    });

    it('should import default EZInstrumentOptions object input', ()=>{
        const { EZInstrumentOptions } = require('../../src/tracing/EZInstrumentOptions');
        let options = new EZInstrumentOptions();
        let obj = new EZInstrument(options);
        assert.exists(obj);
    });

    describe('should enable tracing', ()=>{
        describe('using class constructor', () => {
            it('enable with minimal config', ()=>{
                assert.ok('pass')
            });
        });
    });
});
