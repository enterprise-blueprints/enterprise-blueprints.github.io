source "https://rubygems.org"

# Plain Jekyll with no plugins. The site is built by GitHub Actions, so it does
# not depend on the github-pages gem or its pinned plugin set.
gem "jekyll", "~> 4.4"

# Needed by `jekyll serve` on Ruby 3.x.
gem "webrick", "~> 1.9"

# Windows and JRuby do not include zoneinfo files or a native file watcher.
platforms :windows, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end
gem "wdm", "~> 0.2", platforms: [:windows]
