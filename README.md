# Maison Éclat

A static website for a fictional Paris beauty atelier. The design is formal and
editorial, built around an ivory, plum, rose, sage, and gold palette with italic
serif display type.

Everything is local: no fonts, scripts, images, or analytics are loaded from
third parties.

## Viewing the site

Open `www/index.html` directly in a browser, or serve the folder locally:

```bash
cd www
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

A local server is recommended when testing speech features, because some
browsers restrict microphone access on `file://` pages.

## Pages

| File | Purpose |
| --- | --- |
| `www/index.html` | Home page |
| `www/about.html` | Story, values, timeline, and team |
| `www/rituals.html` | Treatment menu and appointment information |
| `www/collection.html` | Product collection |
| `www/journal.html` | Journal articles |
| `www/contact.html` | Contact details, enquiry form, and dictation |
| `www/accessibility.html` | Accessibility statement and feature guide |

## Accessibility features

The floating **Accessibility** button opens a toolbar that works on every page:

- **Text size** — five steps, from 100% to 140%.
- **Easy-read font** — switches display and body text to a clearer sans-serif
  stack with more generous spacing.
- **High contrast** — a black-and-white, high-contrast palette.
- **Reduce motion** — disables transitions, smooth scrolling, and animation.
- **Read aloud** — reads the main page content, or the current text selection,
  using the browser's speech synthesis voice. Current sentence or block is
  highlighted while it is read.
- **Reset** — returns all settings to their defaults.

Settings are saved in `localStorage` under the key `eclat-a11y`. When no saved
setting exists, the site respects `prefers-reduced-motion` and
`prefers-contrast`.

The contact page also offers **voice dictation** where the browser supports the
Web Speech API. Dictated text is appended to the message field; the microphone is
only active while dictation is switched on.

Additional accessibility work includes:

- Semantic landmarks, a skip link, and a visible keyboard focus style.
- One `h1` per page and a logical heading order.
- Descriptive alternative text for informative photographs; decorative icons and
  artwork are hidden from assistive technology.
- Native form labels, autocomplete attributes, and validation messages.
- Status messages announced through an ARIA live region.
- Print styles that remove navigation and decorative elements.

### Mobile and responsive layout

The layout has been built for small screens as well as desktop:

- A single-column flow below 980px, with card grids and editorial splits
  collapsing cleanly.
- A horizontally scrollable primary navigation below 680px.
- Full-width accessibility controls on phones, with a scrollable settings panel.
- Fluid headings, images that scale with their containers, and form fields that
  stay within the viewport.
- Touch-friendly link, button, and form-control sizes.

### Browser support

The site is designed for current versions of Chrome, Edge, Firefox, and Safari.
Read aloud depends on `window.speechSynthesis`. Dictation depends on
`SpeechRecognition` or `webkitSpeechRecognition`, which is currently most
reliable in Chromium-based browsers. Where a feature is unavailable, the site
says so and offers a typing or browser-level alternative.

## Photography

The photographs are locally hosted and sourced from
[Pexels](https://www.pexels.com/) under the
[Pexels License](https://www.pexels.com/license/). They may be used in this demo
without individual attribution; source links are recorded in
[`CREDITS.md`](CREDITS.md).

## Project structure

```text
Beauty/
├── CREDITS.md
├── README.md
└── www/
    ├── *.html
    ├── css/
    │   └── style.css
    ├── js/
    │   └── accessibility.js
    └── images/
        ├── atelier.jpg
        ├── favicon.svg
        ├── hero.jpg
        ├── journal-1.jpg
        ├── journal-2.jpg
        ├── journal-3.jpg
        ├── pattern.svg
        ├── product-cream.jpg
        ├── product-fragrance.jpg
        ├── product-lipstick.jpg
        ├── product-serum.jpg
        ├── ritual-body.jpg
        ├── ritual-bridal.jpg
        ├── ritual-facial.jpg
        ├── ritual-grooming.jpg
        ├── ritual-hair.jpg
        └── ritual-makeup.jpg
```

JavaScript is limited to `www/js/accessibility.js`; the HTML and CSS work
without it. A small inline script in each page's `<head>` restores saved display
settings before the page paints, which prevents a flash of the wrong theme.

## Customising

- **Colours and type** — edit the custom properties at the top of
  `www/css/style.css` (`:root`).
- **Text size steps** — update the `html[data-text-size]` rules in the CSS and
  the `sizes` array in `www/js/accessibility.js`.
- **Storage key** — change `STORAGE_KEY` in `www/js/accessibility.js` and the
  matching key in the inline head script if you reuse this project.
- **Photography** — replace the JPGs in `www/images/`; keep the existing aspect
  ratios or update the `width` and `height` attributes in the HTML. The image
  crops are 4:5 for the hero, 4:3 for the atelier and ritual cards, 8:5 for
  journal cards, and 5:4 for product cards.
- **Contact details** — search for `maisoneclat.example` and the Paris address in
  the HTML files. The `.example` domain and phone number are placeholders.

## Demo content

Maison Éclat, its team, addresses, prices, and email addresses are fictional.
The contact form is a front-end demonstration: it validates input and shows a
confirmation, but it does not send or store anything. Its `mailto:` action is a
fallback for visitors without JavaScript.
# Beauty
# Beauty
