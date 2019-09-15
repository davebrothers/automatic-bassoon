module.exports = {
  extendHTMLElement: (function() {
    HTMLElement.prototype.activate = function() {
      if (this.classList.contains("is-active")) return;
      this.classList.add("is-active");
    };
    HTMLElement.prototype.deactivate = function() {
      if (!this.classList.contains("is-active")) return;
      this.classList.remove("is-active");
    };
    HTMLElement.prototype.show = function() {
      if (!this.classList.contains("invisible")) return;
      this.classList.remove("invisible");
    };
    HTMLElement.prototype.hide = function() {
      if (this.classList.contains("invisible")) return;
      this.classList.add("invisible");
    };
  })()
};


