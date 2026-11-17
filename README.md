# R.O.K.K.E Management: Website

A fast, multi-page static website: plain HTML, CSS and JavaScript. It needs no build step, no database and no monthly platform fees.

```
index.html          Home: hero, links to each page, call to action
about.html          About Us: mission, vision, philosophy, how we work
services.html       All 9 services, plus the property types we manage
why-rokke.html      Why Choose R.O.K.K.E Management
service-areas.html  Columbia and Midlands communities
contact.html        Contact details and the consultation form
thank-you.html      Not used for now (kept for when a form backend is added)
css/styles.css    All styling. Brand colors and fonts are at the top (:root)
js/main.js        Mobile menu, scroll animations, form handling
assets/           Logo mark (also used as the browser-tab icon)
robots.txt, sitemap.xml   For search engines
```

The header and footer are repeated in each page. If you change the menu, change it in all 6 pages.

To preview, open `index.html` in a browser.

**Contact form (current setup):** there is no backend yet. "Send My Request" opens the visitor's own email app (Outlook, Apple Mail, Gmail app) with a new message to the business address, already filled in with their answers. The visitor still has to press Send. Visitors without an email app set up will see the phone number and address to use instead. The address is set in `contact.html` (`data-mailto` and `action` on the `<form>`).

## Before launch: replace the placeholders

| Placeholder | Where | Replace with |
|---|---|---|
| `(803) 555-0142` / `+18035550142` | All .html pages, js/main.js | Real business phone |
| `info@rokkemanagement.com` | All .html pages (including the `<form>` tag in contact.html), js/main.js | Real business email |
| `rokkemanagement.com` | All .html pages, robots.txt, sitemap.xml | Final domain |
| `G-XXXXXXXXXX` | `<head>` of every page | Google Analytics 4 Measurement ID |
| Facebook / Instagram / LinkedIn links | Contact section | Real profile URLs (delete any you don't use) |
| `"sameAs": []` | JSON-LD in `<head>` | The same social profile URLs |
| `assets/logo-mark.svg` | | The final logo, if one exists |
| Unsplash photos | `<img>` tags | Photos of your own properties when available. These stock images are free for commercial use |

Use find and replace across the project for each item.

## Hosting and deployment (recommended: Netlify)

1. Create a free Netlify account and drag this folder onto **app.netlify.com/drop** (or connect a GitHub repo).
2. **Forms (later):** to have submissions arrive without the visitor's email app, switch the form to Netlify Forms (add `data-netlify="true"` to the `<form>`) or Formspree, and restore a `fetch` submit in `js/main.js`.
3. **Domain and SSL:** under *Domain management*, add your domain and point its DNS to Netlify. Netlify issues the SSL certificate automatically, at no cost.
4. **Google:** verify the site in Google Search Console, submit `sitemap.xml`, and create or claim a **Google Business Profile** for Columbia, SC. For local search, the Business Profile matters more than anything on the site.

## Common updates

- **Add a service area:** copy a `<li>` in the list in `service-areas.html`, and add a matching `"City"` entry to `areaServed` in the JSON-LD in `index.html`.
- **Change colors:** edit `--brand`, `--accent`, `--charcoal` and the other values at the top of `css/styles.css`.
- **Edit text:** each page's sections are labeled with comments such as `<!-- ===== About ===== -->`.

## Future expansion

The design is a self-contained system (tokens, buttons, cards, sections), so new pages reuse the same CSS:

- **Rental listings / applications:** add a `listings.html` page, or embed the listing and application widgets that most property-management software provides (AppFolio, Buildium, Rentvine).
- **Resident and owner portals, online rent, maintenance requests:** these come from the property-management software. Link to them from the nav ("Resident Login", "Owner Login") rather than building them.
- **Mobile notary and new services:** add a card to the services grid.
- **City landing pages** (for example "Property Management in Lexington, SC"): copy `index.html` as a template to improve local SEO as you expand.

If the owner later wants drag-and-drop editing without touching code, the same design can be moved to Webflow or WordPress.
