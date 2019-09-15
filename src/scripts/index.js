(function() {
  HTMLElement.prototype.activate = function() {
    if (this.classList.contains("is-active")) return;
    this.classList.add("is-active");
  };
  HTMLElement.prototype.deactivate = function() {
    if (!this.classList.contains("is-active")) return;
    this.classList.remove("is-active");
  };
})();

class XhrManager {
  constructor() {}

  get = url => {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if (request.readyState !== 4) return;
        const contentType = request.getResponseHeader("content-type");
        if (!contentType.toLowerCase().startsWith("application/json")) {
          reject(
            new Error(
              `[XhrManager] Response content-type: ${contentType} (accepting application/json)`
            )
          );
        }

        if (request.status >= 200 && request.status < 300) {
          resolve(request.responseText);
        } else {
          reject(new Error(`[XhrManager] XHR Status: ${request.status}`));
        }
      };
      request.onerror = () =>
        reject(new Error(`[XhrManager] XHR Status: ${request.status}`));

      request.open("GET", url, true);
      setTimeout(() => request.send(null), 5000);
    });
  };
}

document.xhrManager = new XhrManager();

function xhrSpin(url, spinnerElementId) {
  if (!document.xhrManager) {
    document.xhrManager = new XhrManager();
  }
  return new Promise((resolve, reject) => {
    document.getElementById(spinnerElementId).activate();
    setTimeout(() => {
      return document.xhrManager
        .get(url)
        .then(r => resolve(r))
        .catch(err => reject(err))
        .finally(() => document.getElementById(spinnerElementId).deactivate());
    }, 5000);
  });
}

xhrSpin("http://localhost:8000/foo.json", "load-spinner")
  .then(r => console.log(r))
  .catch(err => console.log(err));
