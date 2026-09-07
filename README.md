# DEK Advisory Group — new website

Static HTML site. No build step, no framework, no dependencies. Upload the contents of this
folder to the web root and it works.

Replaces the previous `.shtml` site at dekgroup.com.au.

---

## What's in here

```
index.html          Home
services.html       Our services (4 advice pillars + scope of advice)
about.html          About us — the practice, Dion and Erica, licensing
contact.html        Contact details, enquiry form, map
404.html            Not-found page
.htaccess           Redirects from the old .shtml URLs, https, caching, security headers
robots.txt          Search engine directives
sitemap.xml         Sitemap
assets/css/         styles.css — the whole stylesheet
assets/js/          main.js — mobile nav, scroll reveals, form handling
assets/img/         Logos, icons, photography
assets/img/spare/   Optional extra image, not used on any page (see "Images" below)
assets/pdf/         DEK-Financial-Services-Guide.pdf
```

---

## Before it goes live — three things to do

### 1. Wire up the enquiry form (required)

`contact.html` has a form whose `action` is the placeholder `REPLACE_WITH_ENDPOINT`.
While that placeholder is there, the form falls back to opening the visitor's own mail client,
which works but is not ideal.

Pick one and replace the `action` attribute:

- **FormSubmit** (free, no account): `action="https://formsubmit.co/erica@dekgroup.com.au"`
- **Formspree** (free tier): `action="https://formspree.io/f/YOUR_FORM_ID"`
- **A mail script on the host**: `action="/send.php"`

Once a real endpoint is in place the JavaScript fallback stands down automatically.
The form already includes a hidden honeypot field (`_company`) that silently drops bot submissions.

### 2. Confirm the .htaccess redirects work

The old site used `.shtml`. The `.htaccess` file 301-redirects every old URL to its new page so
existing links, bookmarks and search rankings are not lost:

| Old URL | Goes to |
| --- | --- |
| `/index.shtml` | `/` |
| `/services.shtml` | `/services.html` |
| `/contact.shtml` | `/contact.html` |
| `/dion-kratz.shtml` | `/about.html#dion` |
| `/erica-kratz.shtml` | `/about.html#erica` |
| `/pdf/DEK-Financial-Services-Guide.pdf` | `/assets/pdf/DEK-Financial-Services-Guide.pdf` |

`.htaccess` only works on Apache. If the host runs **nginx or IIS**, these rules must be
translated by the host, or the old URLs will 404.

### 3. Check the FSG is the current version

`assets/pdf/DEK-Financial-Services-Guide.pdf` is the version dated **19 May 2026**, taken from the
existing site. It is linked from the footer of every page, the contact page, the fees section and
the about page. The FSG is a legal requirement, so if a newer version is issued, replace this file
(keep the same filename and every link keeps working).

Two places also state the version date in the page text and will need updating alongside it:
`services.html` (scope of advice note) and `about.html` (documents list).

---

## Content decisions worth reviewing with the client

**Fee figures are published on the home page.** The amounts ($1,100 SoA, $330/hr, $1,980/yr ongoing)
come straight from the current FSG, which is already public, and they are a genuine trust signal.
If DEK would rather not show them, delete the "Fees" section from `index.html` — it is a single
`<section class="section section--tint">` block and nothing else depends on it.

**The years of experience are carried over from the old site** — "over 14 years" for Dion, "over 10
years" for Erica. That copy is several years old, so both numbers are almost certainly understated
now. Worth confirming and updating.

**The two About pages were merged into one.** The old site had separate `dion-kratz.shtml` and
`erica-kratz.shtml` pages. Both people now live on `about.html` with anchor links (`#dion`, `#erica`),
which reads better and is what the redirects point at.

---

## Compliance notes — please do not undo these

This is a financial services site, so some of the wording is load-bearing:

- **The words "independent", "impartial" and "unbiased" must not be used to describe DEK.**
  Betterment and its advisers receive life insurance commissions, so section 923A of the
  Corporations Act restricts those terms. The footer disclaimer states this explicitly, exactly as
  the FSG does. It appears on every page.
- **The general advice warning** is in the footer of every page and should stay there.
- **ABN, licensee and AFSL number** appear in the footer of every page and in the top bar.
- **No performance promises.** The copy deliberately avoids implying returns, and the investing
  section carries an explicit risk statement.
- The insurance section discloses that commissions may be received.

---

## Images

Photography was generated for this site rather than licensed from a stock library, so there are no
attribution or licence obligations.

`assets/img/spare/malvern-street-OPTIONAL.jpg` is a generated image of a leafy inner-suburban office
building. **It is not DEK's actual premises**, so it is deliberately not used on any page — showing
it on the contact page would imply it is their building. It is kept only in case a decorative
background is wanted somewhere neutral. A real photo of Milton Parade would be better.

The headshots of Dion and Erica are the **real photos** from the old site, recropped to square. They
are only about 520px and were shot some years ago, so they are the softest thing on the site. New
headshots would lift the whole About page.

---

## Editing

Every page is plain HTML with the header and footer repeated inline. To change something that
appears on all pages (a phone number, the footer disclaimer, a nav item) you have to edit it in each
of the five HTML files. Find-and-replace across the folder is the quickest way.

Colours, spacing and type are all CSS custom properties at the top of `assets/css/styles.css`.
The brand palette is taken from the logo:

| Token | Value | Use |
| --- | --- | --- |
| `--cyan` | `#00D4EF` | Accents, gradient end, icon highlights |
| `--blue` | `#1C75BC` | Links, buttons, gradient start |
| `--navy` | `#0C2340` | Header bar, footer, dark sections |
| `--grey` | `#808285` | From the logo, used sparingly |

## Local preview

```bash
cd site
python3 -m http.server 8000
# then open http://localhost:8000
```
