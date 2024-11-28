document.addEventListener("DOMContentLoaded", () => {
  const dataUsageElement = document.getElementById("dataUsage");
  const opEmittedElement = document.getElementById("opEmitted");
  const emEmittedElement = document.getElementById("emEmitted");
  const co2EmittedElement = document.getElementById("co2Emitted");
  const resetButton = document.getElementById("reset");

  // Fetch and display the total data usage
  chrome.storage.local.get("totalDataUsed", (result) => {
    const dataUsed = result.totalDataUsed || 0;
    dataUsageElement.textContent = `Data used: ${dataUsed} GB`;
  });

  chrome.storage.local.get("totalOpEmission", (result) => {
    const co2OPEmitted = result.totalOpEmission || 0;
    opEmittedElement.textContent = `Operation emissions: ${co2OPEmitted} gCO2e`;
  });

  chrome.storage.local.get("totalEmEmission", (result) => {
    const co2EmEmitted = result.totalEmEmission || 0;
    emEmittedElement.textContent = `Embodied emissions: ${co2EmEmitted} gCO2e`;
  });

  chrome.storage.local.get("totalGCo2Emitted", (result) => {
    const co2Emitted = result.totalGCo2Emitted || 0;
    co2EmittedElement.textContent = `Co2 emitted: ${co2Emitted} gCO2e`;
    // Change the icon based on CO2 emissions
    updateIcon(co2Emitted);
  });

  // Reset data usage when the button is clicked
  resetButton.addEventListener("click", () => {
    chrome.storage.local.set({ totalDataUsed: 0 }, () => {
      dataUsageElement.textContent = "Data used: 0 GB";
    });
    chrome.storage.local.set({ totalOpEmission: 0 }, () => {
      opEmittedElement.textContent = "Operation emissions: 0 gCO2e";
    });
    chrome.storage.local.set({ totalEmEmission: 0 }, () => {
      emEmittedElement.textContent = "Embodied emissions: 0 gCO2e";
    });
    chrome.storage.local.set({ totalGCo2Emitted: 0 }, () => {
      co2EmittedElement.textContent = "Co2 emissions: 0 gCO2e";
    });
  });
});

function updateIcon(co2) {
  const iconElement = document.getElementById("icon");

  if (co2 < 10) {
    iconElement.src = "img/greenfootprint.png"; // Low emissions icon
    iconElement.alt = "Low Emissions Icon"; // Update alt text for accessibility
  } else if (co2 >= 10 && co2 < 20) {
    iconElement.src = "img/amberfootprint.png"; // Medium emissions icon
    iconElement.alt = "Medium Emissions Icon";
  } else if (co2 > 20) {
    iconElement.src = "img/redfootprint.png"; // High emissions icon
    iconElement.alt = "High Emissions Icon";
  }

  // Optional: Add a pop animation for effect
  iconElement.style.transform = "scale(1.1)";
  setTimeout(() => (iconElement.style.transform = "scale(1)"), 300);
}