# Migration status — 10 October 2026

All nine public Wix pages, four articles, eight video elements, forms, images and fonts are represented. The live blog widget had not finished loading during the comparison capture; all four known article URLs are preserved.

## Completed

Product arrows and anchors, Careers navigation, application preselection, scroll/menu animations, reading progress, reduced-motion support, motion toggle, lazy/offscreen videos, keyboard focus, News navigation, spelling/template-text fixes, privacy notice, 404, sitemap and deployment metadata.

27 original page/viewport checks and 70 expanded checks passed in Edge/Chromium. Forms used mocked responses; no real enquiry or subscription was sent. Reports and screenshots are included.

## Publishing

Repository: https://github.com/vimplayapi-cpu/streamlab.github.io. The owner created this public repository. Source, local media, verification reports and a deployment workflow are included. Every uploaded file was verified against its local Git blob checksum.

Live migration preview: https://vimplayapi-cpu.github.io/streamlab.github.io/. The initial deployment failed because Pages was disabled. After the owner enabled Pages, rerunning workflow 38047107104 succeeded, including validation, configuration, build, artifact upload and deployment. The hosted website passed 20 mobile/desktop page checks, product navigation and the custom 404. Every published source file matched its local checksum.

The owner confirmed GitHub Actions is selected as the Pages publishing source. A branch-based Jekyll build also ran while hosting was configured; the custom workflow now publishes the prepared dist directory for future updates. The connected plugin cannot change Pages administration settings.

The final source also passed 20 smoke checks at mobile and desktop widths, including product navigation, application preselection, motion controls and the floating menu.

## Remaining

- Confirm enquiry email: footer uses `streamlabplatform@gmail.com.com`; Book Demo uses `info@streamlab.com`.
- Connect contact/newsletter services and update their privacy disclosures.
- Choose a backend for persistent community features if required.
- Move the production domain after services are ready.

The existing Wix site, backend records and domain are unchanged. The migration preview uses noindex.

