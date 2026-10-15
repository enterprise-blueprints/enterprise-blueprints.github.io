// Enterprise Blueprints — small progressive enhancements.
// Every page works without this script; it only adds filtering on the
// Building Blocks index and "copy" buttons next to record IDs.

(function () {
  "use strict";

  // ----- Building Blocks filter -----
  var bar = document.querySelector("[data-filter-bar]");
  if (bar) {
    var buttons = Array.prototype.slice.call(bar.querySelectorAll("[data-filter]"));
    var search = bar.querySelector("[data-filter-search]");
    var status = bar.querySelector("[data-filter-status]");
    var empty = document.querySelector("[data-filter-empty]");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".block-card"));
    var sections = Array.prototype.slice.call(document.querySelectorAll("[data-group-section]"));
    var labels = {};
    buttons.forEach(function (b) { labels[b.getAttribute("data-filter")] = b.firstChild.textContent.trim(); });

    var params = new URLSearchParams(window.location.search);
    var current = params.get("type") || "all";
    var known = cards.some(function (c) {
      return c.getAttribute("data-type") === current || c.getAttribute("data-group") === current;
    });
    if (!known) current = "all";

    var apply = function () {
      var query = (search.value || "").trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (card) {
        var typeMatch = current === "all" ||
          card.getAttribute("data-type") === current ||
          card.getAttribute("data-group") === current;
        var textMatch = !query || card.getAttribute("data-search").indexOf(query) !== -1;
        card.hidden = !(typeMatch && textMatch);
        if (!card.hidden) shown += 1;
      });
      sections.forEach(function (section) {
        var visible = section.querySelector(".block-card:not([hidden])");
        var filtering = current !== "all" || query;
        section.hidden = filtering ? !visible : false;
      });
      // A ?type= value may be a group ("governance") or a single type
      // ("policy"); either way, highlight the button for its group.
      var typeCard = labels[current] ? null : cards.filter(function (c) {
        return c.getAttribute("data-type") === current;
      })[0];
      var activeGroup = typeCard ? typeCard.getAttribute("data-group") : current;
      var activeLabel = typeCard ? typeCard.querySelector(".type-badge").textContent.trim() : labels[current];
      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-filter") === activeGroup ? "true" : "false");
      });
      if (empty) empty.hidden = shown !== 0;
      status.textContent = "Showing " + shown + " of " + cards.length + " building blocks" +
        (current !== "all" ? " · " + activeLabel : "") +
        (query ? " matching “" + search.value.trim() + "”" : "") + ".";
    };

    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        current = b.getAttribute("data-filter");
        var url = new URL(window.location.href);
        if (current === "all") url.searchParams.delete("type");
        else url.searchParams.set("type", current);
        window.history.replaceState(null, "", url);
        apply();
      });
    });
    search.addEventListener("input", apply);
    bar.hidden = false;
    apply();
  }

  // ----- Copy buttons for record IDs -----
  if (navigator.clipboard) {
    Array.prototype.forEach.call(document.querySelectorAll("[data-copy]"), function (el) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "copy-button";
      button.textContent = "Copy";
      button.setAttribute("aria-label", "Copy ID " + el.getAttribute("data-copy"));
      button.addEventListener("click", function () {
        navigator.clipboard.writeText(el.getAttribute("data-copy")).then(function () {
          button.textContent = "Copied";
          setTimeout(function () { button.textContent = "Copy"; }, 1500);
        });
      });
      el.insertAdjacentElement("afterend", button);
    });
  }
})();
