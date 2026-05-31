document.addEventListener('DOMContentLoaded', function() {
  const toggleXray = document.getElementById('toggleXray');
  const opacityRange = document.getElementById('opacityRange');
  const opacityValue = document.getElementById('opacityValue');
  const toggleSelection = document.getElementById('toggleSelection');
  const selectionStatus = document.getElementById('selectionStatus');

  let selectionActive = false;

  toggleXray.addEventListener('change', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "toggleXray",
        enabled: toggleXray.checked,
        opacity: opacityRange.value
      });
    });
  });

  opacityRange.addEventListener('input', function() {
    opacityValue.textContent = opacityRange.value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "updateOpacity",
        opacity: opacityRange.value
      });
    });
  });

  toggleSelection.addEventListener('click', function() {
    selectionActive = !selectionActive;
    selectionStatus.textContent = selectionActive ? "ACTIF" : "Inactif";
    selectionStatus.className = selectionActive ? "active" : "";

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "toggleSelectionMode",
        enabled: selectionActive
      });
    });
  });
});
