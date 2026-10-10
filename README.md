# Streamlab Platform

Independent website migrated from the owner's Wix site, with all nine public pages, local images, fonts and videos, a privacy notice and a custom 404 page.

## Local preview

Requires Node.js 22 or later. No dependency installation is needed. Run `npm run check`, `npm run build`, then `npm run preview`. Open http://127.0.0.1:4173/.

## Improvements

- Scroll entrance animations, menu transitions, button feedback, reading progress and back-to-top.
- Reduced-motion support, explicit motion toggle, still logo alternatives, and videos that load near the viewport and pause offscreen or in hidden tabs.
- Touch-friendly product gallery, previous/next controls and product-description anchors.
- Careers links and job application preselection.
- Keyboard focus, current-page menu links, News navigation and form autocomplete.
- Spelling, template text, phone formatting and copyright corrections.
- Privacy notice, 404 screen, sitemap and deployment-aware metadata.

## Deployment

Repository: https://github.com/vimplayapi-cpu/streamlab.github.io. Enable GitHub Pages with GitHub Actions as its source. The included workflow validates and publishes pushes to `main`, and also supports manual runs. The expected website address is https://vimplayapi-cpu.github.io/streamlab.github.io/. Hosting must be enabled before this address becomes available.

The workflow uses GitHub's official Pages actions: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages. Relative paths support a repository subpath or a domain root.

Migration builds use noindex to avoid duplicate search listings with Wix. When the production domain and backend are ready, set `INDEX_SITE: 'true'` in the workflow. The build reads `SITE_URL` from Pages configuration. No custom domain or DNS switch is included yet.

## Integration status

Contact and newsletter submission services remain unconnected. Set public HTTPS destinations in `site/config.js`. They receive JSON POST `{ "form": "Contact", "fields": { ... } }`, must permit the website origin, and return success only after accepting the entry. Credentials belong on the service's server. Update the privacy notice for the chosen provider.

Unconnected forms clearly explain that entries have not been sent. The Wix footer shows `streamlabplatform@gmail.com.com`; Book Demo uses `info@streamlab.com`. The enquiry address requires owner confirmation.

Sharing and image expansion work. Persistent member login, comments, likes and counts need a backend. Wix contacts, subscribers, submissions, invoices and analytics history remain in Wix.

## Verification and files

The original pages passed 27 viewport checks, plus 70 additional checks including the privacy page. Tested widths: 320, 360, 390, 600, 768, 844, 900, 1024, 1440 and 1920, including landscape. Interaction checks cover menus, products, jobs, motion controls, sharing and mocked form responses. Browser testing used Edge/Chromium; Safari and Firefox should be checked before switching the production domain.

Editable source is in `site/`, commands in `scripts/`, reports and screenshots in `migration/`. Generated `dist/` is excluded from Git. See `migration/STATUS.md` for publishing status.

