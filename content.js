(function () {
  function createLoggerElement() {
    let loggerContainer = document.getElementById("logger_container");
    if (!loggerContainer) {
      loggerContainer = document.createElement("div");
      loggerContainer.id = "logger_container";
      loggerContainer.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        max-width: 300px;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        max-height: 400px;
        overflow-y: auto;
        z-index: 9999;
        display: none;
      `;
      document.body.appendChild(loggerContainer);
    }
    return loggerContainer;
  }

  function showMessage(type, args) {
    const logger = createLoggerElement();
    const message = Array.from(args).join(" ");
    const timestamp = new Date().toLocaleTimeString();
    const entry = document.createElement("div");
    entry.textContent = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    entry.style.padding = "5px";
    entry.style.marginBottom = "5px";
    entry.style.borderRadius = "3px";
    entry.style.backgroundColor =
      type === "error"
        ? "rgba(220, 53, 69, 0.5)"
        : type === "warn"
          ? "rgba(255, 193, 7, 0.5)"
          : "rgba(255, 255, 255, 0.2)";
    logger.appendChild(entry);
    logger.style.display = "block";

    // Automatically remove the entry after 5 seconds
    setTimeout(() => {
      logger.removeChild(entry);
      if (!logger.firstChild) {
        logger.style.display = "none";
      }
    }, 5000);
  }

  const originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
  };

  ["log", "info", "warn", "error"].forEach((method) => {
    console[method] = function (...args) {
      originalConsole[method](...args);
      showMessage(method, args);
    };
  });

  window.addEventListener("error", (event) => {
    showMessage("error", [`${event.message} at line ${event.lineno}`]);
  });

  window.addEventListener("unhandledrejection", (event) => {
    showMessage("error", [event.reason]);
  });
})();
