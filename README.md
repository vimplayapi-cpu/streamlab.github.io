# Streamlab Platform — 2026 redesign

A complete static redesign of the Streamlab marketing website. The real Streamlab logo and established company/product information are retained. New glass/chrome 3D artwork follows the logo’s cyan, pink, peach and lavender palette against midnight navy.

## Run

Node.js 22 or later. No installation or third-party runtime scripts required.

```
npm run check
npm run build
npm run preview
```

Source: `site/`. Shared layout: `site/design.css`. Navigation, scroll reveals, pointer parallax, card tilt, reading progress and motion controls: `site/experience.js`.

## Pages and behaviour

Home, Products, Company/Careers, Journal, four retained articles, Contact, Privacy and 404. All internal URLs support GitHub Pages repository hosting. Mobile navigation includes keyboard focus management and Escape support. Device reduced-motion preferences and a page-level motion switch disable optional movement.

The Contact page prepares a `mailto:` enquiry to the existing demo address, `info@streamlab.com`. Visitors must review and send it in their email application. There is no submission server, mailing list, account system, or automated email delivery. A phone contact is also provided. Existing Wix customer records are untouched. No demo interactions falsely report a successful submission.

Studio and product renders are labelled as concept visuals. StreamSense remains labelled in development. Existing journal articles are retained as historical editorial content; their numerical assertions have not been independently reverified.

## New artwork

Created using the built-in GPT image generation tool, then optimized to WebP:

- `site/assets/new/hero.webp`: iridescent glass play sculpture, chrome orbit and flowing broadcast signals.
- `site/assets/new/studio.webp`: conceptual futuristic production studio with cyan/coral waveform lighting.
- `site/assets/new/tools.webp`: connected glass production panels with waveform, editing and analytics motifs.
- `site/assets/new/streamlab-logo.png`: trimmed transparent copy of the existing real brand mark, not a generated replacement.

Prompt direction for all generated assets: cinematic 3D, dark midnight navy, translucent glass/chrome, aqua/lavender/pink/peach logo palette, no text or watermark. These are original concept illustrations, not product screenshots or facility photographs.

## Deployment

Pushes to `main` run the existing GitHub Pages workflow. The build also refreshes a generated static root mirror, so branch-based Pages publishing cannot replace the website with the README. Edit `site/` and run the build to update both outputs. It checks the source, builds deployment-aware canonical metadata, sitemap and RSS feed, then deploys `dist/`.

GitHub Pages: https://vimplayapi-cpu.github.io/streamlab.github.io/

The existing Wix production domain is not reassigned. The Pages preview remains `noindex` to avoid competing with that domain. When the domain is migrated, update Pages configuration and set `INDEX_SITE: 'true'` in the workflow.

## Verification

Run `npm run check` for local file references, fragment destinations, document structure, inline JSON-LD validity and required interaction hooks. Run `node --check site/experience.js` for JavaScript syntax. Browser checks and their limits for the redesign are recorded in `migration/redesign-verification.json`; older migration screenshots and reports describe the previous implementation.

## Combined homepage and new product visuals

The homepage combines the cinematic glass hero and studio banner from the first redesign with the interactive product tour, production journey, natural editorial imagery, product cards, services and journal from the newer version. All three old Wix product images are removed from the published assets.

Four newly generated interface concepts now illustrate Streamsphere, Edit Pro, Analytics and StreamSense, in `site/assets/new/streamsphere-concept.webp`, `edit-pro-concept.webp`, `analytics-concept.webp` and `streamsense-concept.webp`. The real company logo remains unchanged. The gallery and captions identify these as concepts, not actual software screenshots. StreamSense remains labelled coming soon.

Prompt direction: consistent dark navy desktop software interfaces, clear mint/lavender/peach accents, organized scene controls, edit tracks, sample audience charts and an upcoming AI planning workspace, respectively. These assets used the built-in GPT image generation tool and were optimized to WebP.

`site/product-tour.css` and `site/product-tour.js` implement scene selection, sample audio controls, title editing, timeline scrubbing, sample analytics, keyboard tabs, image enlargement, pointer lighting and production stages. These are local browser illustrations, not actual software integrations or real customer metrics.
