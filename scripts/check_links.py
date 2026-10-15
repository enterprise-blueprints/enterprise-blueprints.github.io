#!/usr/bin/env python3
"""Check that every internal link and asset in a built site resolves.

Usage:
    python scripts/check_links.py _site
    python scripts/check_links.py _site_project --baseurl /my-repo

With --baseurl, every root-relative link must start with the base path, which
catches templates that forget Jekyll's `relative_url` filter. Fragment links
(#id) are checked against the ids on the target page.
"""

from __future__ import annotations

import argparse
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[str] = []
        self.ids: set[str] = set()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        for name in ("href", "src"):
            value = attrs.get(name)
            if value and not (tag == "link" and attrs.get("rel") == "preconnect"):
                self.links.append(value)


def parse(path: Path) -> PageParser:
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser


def resolve(site: Path, url_path: str) -> Path | None:
    candidate = site / unquote(url_path).lstrip("/")
    if url_path.endswith("/"):
        candidate = candidate / "index.html"
    if candidate.is_file():
        return candidate
    if (candidate / "index.html").is_file():
        return candidate / "index.html"
    return None


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("site", type=Path, help="the built site folder, such as _site")
    parser.add_argument("--baseurl", default="", help="the base path the site was built with")
    args = parser.parse_args(argv)

    site = args.site.resolve()
    base = args.baseurl.rstrip("/")
    pages = sorted(site.rglob("*.html"))
    if not pages:
        print(f"No HTML files found in {site}. Build the site first.")
        return 1

    parsed = {page: parse(page) for page in pages}
    problems: list[str] = []
    checked = 0

    for page, info in parsed.items():
        where = page.relative_to(site).as_posix()
        page_url = "/" + where
        for link in info.links:
            parts = urlsplit(link)
            if parts.scheme or parts.netloc or link.startswith(("mailto:", "tel:", "data:")):
                continue  # external
            checked += 1
            if not parts.path:
                target = page  # same-page fragment
            else:
                path = parts.path
                if not path.startswith("/"):
                    # Relative link: resolve against the page's folder.
                    path = str(Path(page_url).parent / path).replace("\\", "/")
                    if base:
                        path = base + path
                if base:
                    if not (path == base or path.startswith(base + "/")):
                        problems.append(f"{where}: '{link}' is missing the base path '{base}'.")
                        continue
                    path = path[len(base):] or "/"
                target = resolve(site, path)
                if target is None:
                    problems.append(f"{where}: '{link}' does not resolve to a file in the site.")
                    continue
            if parts.fragment and target.suffix == ".html":
                if unquote(parts.fragment) not in parsed[target].ids:
                    problems.append(f"{where}: '{link}' points to a missing anchor '#{parts.fragment}'.")

    for problem in problems:
        print(f"ERROR    {problem}")
    outcome = "FAILED" if problems else "OK"
    base_note = f" with base path '{base}'" if base else ""
    print(f"\n{outcome}: checked {checked} internal links in {len(pages)} pages{base_note}; {len(problems)} problem(s).")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
