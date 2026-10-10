# Streamlab Platform

Independent website migrated from the owner's Wix site, with all nine public pages, local images, fonts and videos, a privacy notice and a custom 404 page.

## Local preview

Requires Node.js 22 or later. No dependency installation is needed. Run `npm run check`, `npm run build`, then `npm run preview`. Open http://127.0.0.1:4173/.

## Improvements

- Fluid layouts replace Wix fixed dimensions across all ten content pages. The header starts at the top without an empty band.
- Proportional images, separate product screenshot panels, aligned image/text cards, and responsive grids for phones, tablets and wide screens. Full software screenshots use contain rather than crop.
- Original Wix homepage scroll effects restored on the responsive elements: 60px upward/sideways fades, 1.2-second timing, three 500ms delays, and the two Studio image flips. Menu transitions, button feedback, reading progress and back-to-top remain available.
- Reduced-motion support, explicit motion toggle, still logo alternatives, and videos that load near the viewport and pause offscreen or in hidden tabs.
- Touch-friendly product gallery, previous/next controls and product-description anchors.
- Careers links and job application preselection.
- Keyboard focus, current-page menu links, News navigation and form autocomplete.
- Spelling, template text, phone formatting and copyright corrections.
- Privacy notice, 404 screen, sitemap and deployment-aware metadata.

## Deployment

Repository: https://github.com/vimplayapi-cpu/streamlab.github.io. Live migration preview: https://vimplayapi-cpu.github.io/streamlab.github.io/. GitHub Pages deployment succeeded on 10 October 2026. Keep GitHub Actions selected as the Pages publishing source. The included workflow validates and publishes pushes to `main`, and also supports manual runs.

The workflow uses GitHub's official Pages actions: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages. Relative paths support a repository subpath or a domain root.

Migration builds use noindex to avoid duplicate search listings with Wix. When the production domain and backend are ready, set `INDEX_SITE: 'true'` in the workflow. The build reads `SITE_URL` from Pages configuration. No custom domain or DNS switch is included yet.

## Integration status

Contact and newsletter submission services remain unconnected. Set public HTTPS destinations in `site/config.js`. They receive JSON POST `{ "form": "Contact", "fields": { ... } }`, must permit the website origin, and return success only after accepting the entry. Credentials belong on the service's server. Update the privacy notice for the chosen provider.

Unconnected forms clearly explain that entries have not been sent. The Wix footer shows `streamlabplatform@gmail.com.com`; Book Demo uses `info@streamlab.com`. The enquiry address requires owner confirmation.

Sharing and image expansion work. Persistent member login, comments, likes and counts need a backend. Wix contacts, subscribers, submissions, invoices and analytics history remain in Wix.

## Verification and files

The responsive rebuild passed 176 page/viewport checks: all eleven pages at fourteen widths from 320 to 3840 pixels and two landscape sizes. Checks cover loaded images, proportions, horizontal overflow, header geometry, image/text card boundaries, anchors and primary control sizes. Eighteen additional checks cover menus/focus, products, all four job choices, all article text and captions, sharing, image expansion, motion controls, manual video playback and mocked form responses. No real form submissions were sent. Browser testing used Edge/Chromium; physical devices, Safari and Firefox have not been verified.

Editable source is in `site/`, shared responsive styling is in `site/layout.css`, commands are in `scripts/`, and reports/screenshots are in `migration/`. Generated `dist/` is excluded from Git. See `migration/STATUS.md` for publishing status.

The Wix motion restoration was checked against animation keyframes captured from the live original website. All eleven mapped entrances were checked at 320, 390, 768 and 1440px, including twenty intermediate-frame overflow checks, one-time playback, reduced motion and the motion toggle. Reference and verification are in `migration/wix-motion-reference.json` and `migration/wix-motion-verification.json`.

