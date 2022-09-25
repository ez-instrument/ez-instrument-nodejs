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

        describe('deployment', ()=>{

            describe('environment', ()=>{
                it('deployment env does not exist', ()=>{
                    const envConf = new ConfigFactory().getConfigFromEnvironment();
                    assert.equal(null, envConf.deployment.environment);
                });

                it('deployment env is blank', ()=>{
                    process.env.EZ_DEPLOYMENT_ENVIRONMENT="";
                    const envConf = new ConfigFactory().getConfigFromEnvironment();
                    assert.equal("", envConf.deployment.environment);
                });

                it('deployment env has value', ()=>{
                    process.env.EZ_DEPLOYMENT_ENVIRONMENT="production";
                    const envConf = new ConfigFactory().getConfigFromEnvironment();
                    assert.equal("production", envConf.deployment.environment);
                });
            });
        });

        describe('export', ()=>{

            describe('url', ()=>{
                it('url env does not exist', ()=>{
                    const envConf = new ConfigFactory().getConfigFromEnvironment();
                    assert.equal(null, envConf.export.url);
                });

                it('url env is blank', ()=>{
                    process.env.EZ_EXPORT_URL="";
                    const envConf = new ConfigFactory().getConfigFromEnvironment();
                    assert.equal("", envConf.export.url);
                });

                it('url env has value', ()=>{
                    process.env.EZ_EXPORT_URL="http://localhost:5678";
                    const envConf = new ConfigFactory().getConfigFromEnvironment();
                    assert.equal("http://localhost:5678", envConf.export.url);
                });
            });

            describe('exporter type', ()=>{
                it('exporter type env does not exist', ()=>{
                    const envConf = new ConfigFactory().getConfigFromEnvironment();
                    assert.equal(null, envConf.export.exporterType);
                });

                it('exporter type env is blank', ()=>{
                    process.env.EZ_EXPORTER_TYPE="";
                    const envConf = new ConfigFactory().getConfigFromEnvironment();
                    assert.equal("", envConf.export.exporterType);
                });

                it('exporter type env has value', ()=>{
                    process.env.EZ_EXPORTER_TYPE="http";
                    const envConf = new ConfigFactory().getConfigFromEnvironment();
                    assert.equal("http", envConf.export.exporterType);
                });
            });

            describe('enable console exporter', ()=>{
                it('enable console exporter env does not exist', ()=>{
                    const envConf = new ConfigFactory().getConfigFromEnvironment();
                    assert.equal(null, envConf.export.enableConsoleExporter);
                });

                it('enable console exporter env is blank', ()=>{
                    process.env.EZ_ENABLE_CONSOLE_EXPORTER="";
                    const envConf = new ConfigFactory().getConfigFromEnvironment();
                    assert.equal("", envConf.export.enableConsoleExporter);
                });

                it('enable console exporter env has value', ()=>{
                    process.env.EZ_ENABLE_CONSOLE_EXPORTER="true";
                    const envConf = new ConfigFactory().getConfigFromEnvironment();
                    assert.equal("true", envConf.export.enableConsoleExporter);
                });
            });

            describe('batch span processor', ()=>{
                describe('export timeout', ()=>{
                    it('export timeout env does not exist', ()=>{
                        const envConf = new ConfigFactory().getConfigFromEnvironment();
                        assert.equal(null, envConf.export.batchSpanProcessorConfig.exportTimeoutMillis);
                    });
    
                    it('export timeout env is blank', ()=>{
                        process.env.EZ_EXPORT_TIMEOUT_MILLIS="";
                        const envConf = new ConfigFactory().getConfigFromEnvironment();
                        assert.equal("", envConf.export.batchSpanProcessorConfig.exportTimeoutMillis);
                    });
    
                    it('export timeout env has value', ()=>{
                        process.env.EZ_EXPORT_TIMEOUT_MILLIS="5000";
                        const envConf = new ConfigFactory().getConfigFromEnvironment();
                        assert.equal("5000", envConf.export.batchSpanProcessorConfig.exportTimeoutMillis);
                    });
                });

                describe('max export batch size', ()=>{
                    it('max export batch size env does not exist', ()=>{
                        const envConf = new ConfigFactory().getConfigFromEnvironment();
                        assert.equal(null, envConf.export.batchSpanProcessorConfig.maxExportBatchSize);
                    });
    
                    it('max export batch size env is blank', ()=>{
                        process.env.EZ_MAX_EXPORT_BATCH_SIZE="";
                        const envConf = new ConfigFactory().getConfigFromEnvironment();
                        assert.equal("", envConf.export.batchSpanProcessorConfig.maxExportBatchSize);
                    });
    
                    it('max export batch size env has value', ()=>{
                        process.env.EZ_MAX_EXPORT_BATCH_SIZE="5000";
                        const envConf = new ConfigFactory().getConfigFromEnvironment();
                        assert.equal("5000", envConf.export.batchSpanProcessorConfig.maxExportBatchSize);
                    });
                });

                describe('max queue size', ()=>{
                    it('max queue size env does not exist', ()=>{
                        const envConf = new ConfigFactory().getConfigFromEnvironment();
                        assert.equal(null, envConf.export.batchSpanProcessorConfig.maxQueueSize);
                    });
    
                    it('max queue size env is blank', ()=>{
                        process.env.EZ_MAX_QUEUE_SIZE="";
                        const envConf = new ConfigFactory().getConfigFromEnvironment();
                        assert.equal("", envConf.export.batchSpanProcessorConfig.maxQueueSize);
                    });
    
                    it('max queue size env has value', ()=>{
                        process.env.EZ_MAX_QUEUE_SIZE="5000";
                        const envConf = new ConfigFactory().getConfigFromEnvironment();
                        assert.equal("5000", envConf.export.batchSpanProcessorConfig.maxQueueSize);
                    });
                });

                describe('scheduled delay', ()=>{
                    it('scheduled delay env does not exist', ()=>{
                        const envConf = new ConfigFactory().getConfigFromEnvironment();
                        assert.equal(null, envConf.export.batchSpanProcessorConfig.scheduledDelayMillis);
                    });
    
                    it('scheduled delay env is blank', ()=>{
                        process.env.EZ_SCHEDULED_DELAY_MILLIS="";
                        const envConf = new ConfigFactory().getConfigFromEnvironment();
                        assert.equal("", envConf.export.batchSpanProcessorConfig.scheduledDelayMillis);
                    });
    
                    it('scheduled delay env has value', ()=>{
                        process.env.EZ_SCHEDULED_DELAY_MILLIS="5000";
                        const envConf = new ConfigFactory().getConfigFromEnvironment();
                        assert.equal("5000", envConf.export.batchSpanProcessorConfig.scheduledDelayMillis);
                    });
                });
            });
        });

        describe('capture host information', ()=>{
            it('capture host info env does not exist', ()=>{
                const envConf = new ConfigFactory().getConfigFromEnvironment();
                assert.equal(null, envConf.captureHostInformation);
            });

            it('capture host info env is blank', ()=>{
                process.env.EZ_CAPTURE_HOST_INFO="";
                const envConf = new ConfigFactory().getConfigFromEnvironment();
                assert.equal("", envConf.captureHostInformation);
            });

            it('capture host info env has value', ()=>{
                process.env.EZ_CAPTURE_HOST_INFO="true";
                const envConf = new ConfigFactory().getConfigFromEnvironment();
                assert.equal("true", envConf.captureHostInformation);
            });
        });
    });
});
