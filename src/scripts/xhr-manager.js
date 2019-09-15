require("./extensions");
require("es6-promise").polyfill();

class XhrManager {
  constructor() {}

  get = url => {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if (request.readyState !== 4) return;

        if (request.status >= 200 && request.status < 300) {
          const contentType = request.getResponseHeader("content-type");
          contentType.toLowerCase().indexOf("application/json") >= 0
            ? resolve(JSON.parse(request.responseText))
            : resolve(request.responseText);
        } else {
          reject(new Error(`[XhrManager] XHR Status: ${request.status}`));
        }
      };
      request.onerror = e => reject(new Error(e.returnValue));

      request.open("GET", url, true);
      setTimeout(() => request.send(null), 5000);
    });
  };

  getShowProgress = (url, spinnerElementId) => {
    return new Promise((resolve, reject) => {
      const spinnerElement = document.getElementById(spinnerElementId);
      spinnerElement && spinnerElement.show();
      setTimeout(() => {
        return this.get(url)
          .then(r => resolve(r))
          .catch(err => reject(err))
          .finally(() => spinnerElement && spinnerElement.hide());
      }, 5000);
    });
  };
}
module.exports = XhrManager;
