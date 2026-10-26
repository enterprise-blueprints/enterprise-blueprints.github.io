(() => {
  const article = document.querySelector(".prose");
  const contents = document.querySelector("#article-contents");
  if (!article || !contents) return;
  const headings = [...article.querySelectorAll("h1, h2, h3")].filter((heading, index) => !(index === 0 && heading.tagName === "H1"));
  const used = new Set([...document.querySelectorAll("[id]")].map(node => node.id));
  headings.forEach((heading, index) => {
    if (!heading.id) {
      const stem = heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
      let id = stem;
      let suffix = index + 1;
      while (used.has(id)) id = stem + "-" + suffix++;
      heading.id = id;
      used.add(id);
    }
    const link = document.createElement("a");
    link.href = "#" + heading.id;
    link.textContent = heading.textContent;
    if (heading.tagName === "H3") link.className = "toc-subheading";
    contents.append(link);
  });
  if (!headings.length) document.querySelector(".contents-panel").hidden = true;
})();
