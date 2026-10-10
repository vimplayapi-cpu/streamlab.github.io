# Migration status — 10 October 2026

All nine public Wix pages, including four articles, plus the privacy notice and custom 404 are represented. Original local media and fonts are retained; redundant decorative video copies were consolidated during the responsive rebuild.

## Completed

Product arrows and anchors, Careers navigation, application preselection, scroll/menu animations, reading progress, reduced-motion support, motion toggle, lazy/offscreen videos, keyboard focus, News navigation, spelling/template-text fixes, privacy notice, 404, sitemap and deployment metadata.

The responsive rebuild replaces fixed Wix dimensions with fluid layouts on all ten content pages. The header's empty top band is removed, product screenshots are separated from copy, image proportions are preserved, and card grids stack at smaller widths. News cards have consistent image areas and aligned actions. Native forms and article images reflow without horizontal page scrolling.

176 page/viewport checks passed in Edge/Chromium, covering eleven pages at 320, 360, 390, 430, 600, 768, 820, 900, 1024, 1280, 1440, 1920, 2560 and 3840 pixels, plus 844×390 and 1024×600 landscape. Eighteen interaction/content checks passed, including all four article bodies and captions, menus/focus, product navigation, jobs, sharing, manual video playback and motion controls. Forms used mocked responses; no real enquiry or subscription was sent. Current reports are responsive-verification.json and responsive-interactions.json; representative visual checks are in responsive-screenshots/. Older reports describe earlier versions. Physical devices, Safari and Firefox have not been verified.

## Publishing

Repository: https://github.com/vimplayapi-cpu/streamlab.github.io. The owner created this public repository. Source, local media, verification reports and a deployment workflow are included. Every uploaded file was verified against its local Git blob checksum.

Live migration preview: https://vimplayapi-cpu.github.io/streamlab.github.io/. The initial deployment failed because Pages was disabled. After the owner enabled Pages, rerunning workflow 38047107104 succeeded, including validation, configuration, build, artifact upload and deployment. The hosted website passed 20 mobile/desktop page checks, product navigation and the custom 404. Every published source file matched its local checksum.

The owner reported GitHub Actions selected, but the last authenticated diagnostic still reported legacy branch publishing. The workflow reports the actual mode in every run. If legacy persists, change Settings → Pages → Build and deployment → Source to GitHub Actions and refresh to confirm. Branch publishing can overwrite the prepared website with the repository README. The connected plugin cannot change Pages administration settings.

Deployment retries use distinct artifact names, allowing the prepared website to be restored after a competing branch build without duplicate-artifact failures.

## Remaining

- Confirm enquiry email: footer uses `streamlabplatform@gmail.com.com`; Book Demo uses `info@streamlab.com`.
- Connect contact/newsletter services and update their privacy disclosures.
- Choose a backend for persistent community features if required.
- Move the production domain after services are ready.

The existing Wix site, backend records and domain are unchanged. The migration preview uses noindex.

