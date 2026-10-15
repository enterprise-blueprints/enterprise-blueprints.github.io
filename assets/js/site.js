// Enterprise Blueprints — small progressive enhancements.
// Every page works without this script; it only adds filtering on the
// Building Blocks index, tabs for a block's structured sections, and "copy"
// buttons next to record IDs.

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

  // ----- Tabs for a building block's structured sections -----
  // The layout lists the section headings to tab (from `tab: true` in
  // _data/block_types.yml). Each heading and the content up to the next
  // heading becomes a panel. Without this script, the sections just stack.
  var tabbed = document.querySelector("[data-tab-sections]");
  if (tabbed) {
    var names = tabbed.getAttribute("data-tab-sections").split("|").filter(Boolean);
    var headings = Array.prototype.filter.call(tabbed.children, function (el) {
      return el.tagName === "H2" && names.indexOf(el.textContent.trim()) !== -1;
    });
    if (headings.length > 1) {
      var wrap = document.createElement("div");
      wrap.className = "tabs type-" + tabbed.getAttribute("data-tab-type");
      var list = document.createElement("div");
      list.className = "tabs__list";
      list.setAttribute("role", "tablist");
      list.setAttribute("aria-label", "Sections");
      wrap.appendChild(list);
      headings[0].parentNode.insertBefore(wrap, headings[0]);

      var tabs = [];
      var panels = [];
      headings.forEach(function (heading) {
        var panel = document.createElement("section");
        panel.className = "tabs__panel";
        panel.id = "panel-" + heading.id;
        panel.setAttribute("role", "tabpanel");
        // Move the heading and everything after it, up to the next heading.
        var nodes = [heading];
        var node = heading.nextSibling;
        while (node && !(node.nodeType === 1 && node.tagName === "H2")) {
          nodes.push(node);
          node = node.nextSibling;
        }
        nodes.forEach(function (n) { panel.appendChild(n); });
        heading.classList.add("visually-hidden");

        var tab = document.createElement("button");
        tab.type = "button";
        tab.className = "tabs__tab";
        tab.id = "tab-" + heading.id;
        tab.setAttribute("role", "tab");
        tab.setAttribute("aria-controls", panel.id);
        tab.textContent = heading.textContent.trim();
        var count = panel.querySelectorAll("tbody tr, .stack-cards > li").length;
        if (count) {
          var badge = document.createElement("span");
          badge.className = "tabs__count";
          badge.textContent = count;
          tab.appendChild(document.createTextNode(" "));
          tab.appendChild(badge);
        }
        panel.setAttribute("aria-labelledby", tab.id);
        list.appendChild(tab);
        wrap.appendChild(panel);
        tabs.push(tab);
        panels.push(panel);
      });

      var select = function (index, focus) {
        tabs.forEach(function (tab, i) {
          var on = i === index;
          tab.setAttribute("aria-selected", on ? "true" : "false");
          tab.tabIndex = on ? 0 : -1;
          panels[i].hidden = !on;
        });
        if (focus) tabs[index].focus();
      };

      tabs.forEach(function (tab, i) {
        tab.addEventListener("click", function () {
          select(i);
          // Keep the address shareable: it points at the open tab's section.
          window.history.replaceState(null, "", "#" + headings[i].id);
        });
      });
      list.addEventListener("keydown", function (event) {
        var current = tabs.indexOf(document.activeElement);
        if (current === -1) return;
        var next = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: tabs.length - 1 }[event.key];
        if (next === undefined) return;
        event.preventDefault();
        select((next + tabs.length) % tabs.length, true);
      });

      // A link to a tabbed section (such as #states) lands on its hidden
      // heading. Leave room above it for the tab bar, however many rows the
      // tabs wrap onto.
      var fitHeadings = function () {
        var room = (list.offsetHeight + 24) + "px";
        headings.forEach(function (h) { h.style.scrollMarginTop = room; });
      };
      fitHeadings();
      window.addEventListener("resize", fitHeadings);

      // A link to something inside a hidden panel (such as #state-open)
      // opens that panel first, then scrolls to it.
      var reveal = function () {
        var id = decodeURIComponent(window.location.hash.slice(1));
        var target = id && document.getElementById(id);
        var panel = target && target.closest(".tabs__panel");
        if (!panel) return false;
        select(panels.indexOf(panel));
        (headings.indexOf(target) !== -1 ? wrap : target).scrollIntoView({ block: "start" });
        return true;
      };
      if (!reveal()) select(0);
      window.addEventListener("hashchange", reveal);
    }
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
