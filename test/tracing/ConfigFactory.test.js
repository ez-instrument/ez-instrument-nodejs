/* global describe, it */

const { assert } = require('chai');

describe('ConfigFactory.js', () => {
    const { ConfigFactory } = require('../../src/tracing/ConfigFactory');
    
    it('can import', ()=>{
        const obj = new ConfigFactory();
        assert.exists(obj);
    });

    describe('environment', () => {
        it('returns env config', ()=>{
            const obj = new ConfigFactory().getConfigFromEnvironment();
            assert.exists(obj);
        });

        describe('service', ()=>{
            
            describe('name', ()=>{
                it('name env does not exist', ()=>{
                    const envConf = new ConfigFactory().getConfigFromEnvironment();
                    assert.equal(null, envConf.service.name);
                });

                it('name env is blank', ()=>{
                    process.env.EZ_SERVICE_NAME="";
                    const envConf = new ConfigFactory().getConfigFromEnvironment();
                    assert.equal("", envConf.service.name);
                });

                it('name env has value', ()=>{
                    process.env.EZ_SERVICE_NAME="service-name";
                    const envConf = new ConfigFactory().getConfigFromEnvironment();
                    assert.equal("service-name", envConf.service.name);
                });
            });

            describe('namespace', ()=>{
                it('namepspace env does not exist', ()=>{
                    const envConf = new ConfigFactory().getConfigFromEnvironment();
                    assert.equal(null, envConf.service.namespace);
                });

                it('namespace env is blank', ()=>{
                    process.env.EZ_SERVICE_NAMESPACE="";
                    const envConf = new ConfigFactory().getConfigFromEnvironment();
                    assert.equal("", envConf.service.namespace);
                });

                it('namespace env has value', ()=>{
                    process.env.EZ_SERVICE_NAMESPACE="service-namespace";
                    const envConf = new ConfigFactory().getConfigFromEnvironment();
                    assert.isString(envConf.service.namespace);
                    assert.equal("service-namespace", envConf.service.namespace);
                });
            });

            describe('version', ()=>{
                it('version env does not exist', ()=>{
                    const envConf = new ConfigFactory().getConfigFromEnvironment();
                    assert.equal(null, envConf.service.version);
                });

                it('version env is blank', ()=>{
                    process.env.EZ_SERVICE_VERSION="";
                    const envConf = new ConfigFactory().getConfigFromEnvironment();
                    assert.equal("", envConf.service.version);
                });

                it('version env has value', ()=>{
                    process.env.EZ_SERVICE_VERSION="1.2.3";
                    const envConf = new ConfigFactory().getConfigFromEnvironment();
                    assert.isString(envConf.service.version);
                    assert.equal("1.2.3", envConf.service.version);
                });
            });
        });
    });
});
