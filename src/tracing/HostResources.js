const { diag: logger } = require('@opentelemetry/api');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const os = require('node:os');
const fs = require('node:fs');

class HostResources {
    /**
     * @private
     * @returns {Resource | null}
     */
    getContainerSemanticResources() {
        if(fs.existsSync('/.dockerenv')) {
            logger.debug(`ez-instrument: Application is in a docker container.`);
            logger.debug(`ez-instrument: Semantic resource attributes for containers will be added.`);
            
            let containerResources = new Resource({
                [SemanticResourceAttributes.CONTAINER_RUNTIME]: 'docker',
                [SemanticResourceAttributes.CONTAINER_ID]: os.hostname()
            });
    
            return containerResources;
        } else {
            return null;
        }
    }

    /**
     * @private
     * @returns {Resource | null}
     */
    getLinuxDistroSemanticResources() {
        if(fs.existsSync('/etc/os-release')) {
            let osReleaseData = fs.readFileSync('/etc/os-release');
            let lines = osReleaseData.toString().split('\n');
            let distroName = lines[0].split('=')[1];
            let distroVersion = lines[1].split('=')[1];
            
            let OSReleaseResources = new Resource({
                [SemanticResourceAttributes.OS_NAME]: distroName.slice(1, (distroName.length - 1)),
                [SemanticResourceAttributes.OS_VERSION]: distroVersion.slice(1, (distroVersion.length - 1))
            });

            return OSReleaseResources;
        } else {
            return null;
        }
    }

    /**
     * @public
     * @returns {Resource}
     */
    getHostSemanticResources() {
        let hostResources = new Resource({
            [SemanticResourceAttributes.HOST_NAME]: os.hostname(),
            [SemanticResourceAttributes.HOST_ARCH]: os.arch(),
            [SemanticResourceAttributes.OS_TYPE]: os.platform(),
            [SemanticResourceAttributes.OS_NAME]: os.type(),
            [SemanticResourceAttributes.OS_VERSION]: os.version()
        });

        if(os.platform() === 'linux') {
            let containerResources = this.getContainerSemanticResources();
            if(containerResources) {
                hostResources = hostResources.merge(containerResources);
            }

            let distroResources = this.getLinuxDistroSemanticResources();
            if(distroResources) {
                hostResources = hostResources.merge(distroResources);
            }
        } else {
            logger.debug(`ez-instrument: win32 platform detected. ez-instrument cannot determine if application is containerized.`);
            logger.debug(`ez-instrument: Semantic resource attributes for containers will not be added.`);
        }

        return hostResources;
    }
}

module.exports = {
    HostResources
};
