let rawtotalDataUsed = 0;
const byteGbConversion = 1000000000;

// Operational Values
const avgEnergyDataCenterCsmpOP = 0.055;
const avgEnergyNetworkInfCsmpOP = 0.059;
const avgEnergyDeviceViewOP = 0.080;

// Embodied Values
const avgEnergyDataCenterCsmpEM = 0.012;
const avgEnergyNetworkInfCsmpEM = 0.013;
const avgEnergyDeviceViewEM = 0.081;


const avgGCo2PerkWh = 494;

// Listen for completed network requests
chrome.webRequest.onCompleted.addListener(
    (details) => {
        const contentLengthHeader = details.responseHeaders?.find(
            (header) => header.name.toLowerCase() === "content-length"
        );

        if (contentLengthHeader) {
            const dataUsed = parseInt(contentLengthHeader.value, 10) || 0;
            rawtotalDataUsed += bytesToGB(dataUsed);
            let totalDataUsed = parseFloat(rawtotalDataUsed.toFixed(5));
            let totalOpEmission = calcOpEmission(totalDataUsed);
            let totalEmEmission = calcEmEmission(totalDataUsed);
            let totalGCo2Emitted = parseFloat((totalOpEmission + totalEmEmission).toFixed(5));

            // Store total data usage
            chrome.storage.local.set({ totalDataUsed }, () => {
                console.log(`Updated total data usage: ${totalDataUsed} GB`);
            });
            // Store total data usage
            chrome.storage.local.set({ totalOpEmission }, () => {
                console.log(`Updated total operational emission: ${totalOpEmission} gCO2e`);
            });
            // Store total data usage
            chrome.storage.local.set({ totalEmEmission }, () => {
                console.log(`Updated total embodied emission: ${totalEmEmission} gCO2e`);
            });
            // Store total data usage
            chrome.storage.local.set({ totalGCo2Emitted }, () => {
                console.log(`Updated total Co2 emitted: ${totalGCo2Emitted} gCO2e`);
            });
        }
    },
    { urls: ["<all_urls>"] },
    ["responseHeaders"]
);

// Calculates Operational Emissions
function calcOpEmission(totalDataUsed) {
    return parseFloat(
        (
            (totalDataUsed * avgEnergyDataCenterCsmpOP * avgGCo2PerkWh) +
            (totalDataUsed * avgEnergyNetworkInfCsmpOP * avgGCo2PerkWh) +
            (totalDataUsed * avgEnergyDeviceViewOP * avgGCo2PerkWh)
        ).toFixed(5)
    );
}

// Calculates Embodied Emissions
function calcEmEmission(totalDataUsed) {
    return parseFloat(
        (
            (totalDataUsed * avgEnergyDataCenterCsmpEM * avgGCo2PerkWh) +
            (totalDataUsed * avgEnergyNetworkInfCsmpEM * avgGCo2PerkWh) +
            (totalDataUsed * avgEnergyDeviceViewEM * avgGCo2PerkWh)
        ).toFixed(5)
    );
}

// 1byte = 1000000000GB aprox
function bytesToGB(bytes) {
    return bytes / byteGbConversion;
}
