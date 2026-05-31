let xrayEnabled = false;
let selectionMode = false;
let currentOpacity = 0.5;
let debounceTimer;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleXray") {
    xrayEnabled = request.enabled;
    currentOpacity = request.opacity;
    applyXray();
  } else if (request.action === "toggleSelectionMode") {
    selectionMode = request.enabled;
    if (selectionMode) {
      document.body.style.cursor = "crosshair";
      document.addEventListener("click", handleSelection, true);
    } else {
      document.body.style.cursor = "default";
      document.removeEventListener("click", handleSelection, true);
    }
  } else if (request.action === "updateOpacity") {
    currentOpacity = request.opacity;
    if (xrayEnabled) applyXray();
  }
});

function applyXray() {
  if (!xrayEnabled) {
    const elements = document.querySelectorAll('[data-xray-modified="true"]');
    elements.forEach(el => {
      el.style.opacity = el.dataset.originalOpacity || "";
      delete el.dataset.xrayModified;
    });
    return;
  }

  // Optimized selector to avoid querying everything
  const elements = document.querySelectorAll('div, canvas, img, svg, [role="button"]');

  elements.forEach(el => {
    // Skip elements already manually modified in selection mode
    if (el.dataset.manualModified === "true") return;

    const style = window.getComputedStyle(el);
    const zIndex = parseInt(style.zIndex);

    if (zIndex > 0 || style.position === 'absolute' || style.position === 'fixed') {
        if (!el.dataset.originalOpacity) {
            el.dataset.originalOpacity = style.opacity;
        }
        el.style.opacity = currentOpacity;
        el.dataset.xrayModified = "true";
    }
  });
}

function handleSelection(e) {
  if (!selectionMode) return;

  e.preventDefault();
  e.stopPropagation();

  const target = e.target;
  if (target.dataset.manualModified === "true") {
    target.style.opacity = target.dataset.originalOpacity || "";
    delete target.dataset.manualModified;
  } else {
    if (!target.dataset.originalOpacity) {
        target.dataset.originalOpacity = window.getComputedStyle(target).opacity;
    }
    target.style.opacity = currentOpacity;
    target.dataset.manualModified = "true";
  }
}

// Debounced observer for dynamic elements
const observer = new MutationObserver((mutations) => {
  if (xrayEnabled) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      applyXray();
    }, 500); // Wait 500ms after last mutation before re-scanning
  }
});

observer.observe(document.body, { childList: true, subtree: true });
