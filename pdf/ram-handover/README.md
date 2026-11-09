# RAM Handover Report

The handover protocol RAM produces when equipment is handed out to a customer or handed back in. This is the
InDesign layout (*Handover Protocol Hand out*, *Hand in*, *Hand in only equipment*, *Bulk*, *Without Booking*,
*Last answer*) rebuilt as HTML, with Syn's colours and fonts, in English and German.

One template covers every variant: a section with no data is left out.

| Variant | Example | What changes |
| --- | --- | --- |
| Hand out | `examples/hand-out.*` | Owner, Transport Provider, Customer; inventory as Total / Delivered |
| Hand in | `examples/hand-in.*` | Inventory as Total / Returned / Remaining / Lost/Damaged |
| Hand in, only equipment | `examples/hand-in-equipment.*` | One booking row, no inventory |
| Hand in, last answer | `examples/hand-in-last-answer.*` | The previous handover's answers in a card under the checklist |
| Bulk | `examples/bulk.*` | Rental Company and Customer with addresses, Construction Site, an equipment details strip, operating hours per piece of equipment |
| Without booking | `examples/without-booking.*` | An equipment card instead of the booking overview |

Each example is there as `.html` (open it in a browser), `.json` (the data that made it) and `.pdf` (printed
with Chromium), in `en` and `de`.

## Pages

1. **Cover**: date, logo, Handover ID, Contract ID, Type, the parties, the booking overview and inventory
   counts (or the equipment card).
2. **Body** (as many pages as it needs), with the running header (logo, "Handover Report ID", date) and the
   footer (slogan, website, page number from 1): operating hours, Rental information, Attachments, General
   information, Cleaning, the question groups, Lights, Photos.
3. **Closing page**: 360° views, Rating, the signatures and the company details.

## Build

```bash
npm install          # Playwright, only needed for --pdf
npm run handover     # examples/*.html and *.json
npm run handover:pdf # also examples/*.pdf
```

In the backend:

```js
import { renderHandover } from './pdf/ram-handover/render.mjs';

const html = renderHandover(data, { assetBase: 'https://cdn.example.com/ram-handover/' });
// Print with a Chromium engine (Puppeteer, Playwright, Gotenberg):
await page.setContent(html, { waitUntil: 'networkidle' });
await page.pdf({ preferCSSPageSize: true, printBackground: true });
```

`assetBase` is where `handover.css`, `fonts/` and `assets/` are served from. With
`inlineCss: <the CSS text>` the stylesheet goes inside the HTML instead (fonts and logo still load from
`assetBase`). Photo and signature URLs in the data are used as they are.

**The print engine must be Chromium.** The template uses named pages, `@page` margin boxes for the footer and
page number, and a table header that repeats on every page. wkhtmltopdf does not support these.

## Data

`examples/*.json` are complete examples. Every field is optional unless marked.

```jsonc
{
  "lang": "en",                         // "en" or "de": fixed labels come from i18n.mjs
  "type": "hand_out",                   // "hand_out" | "hand_in"
  "createdAt": "20 May 2025, 11:00 (Europe/Berlin)",   // already formatted by the backend
  "handoverId": "RC15484BTT",
  "contractId": "RC15484BTT",
  "brand": { "name": "syniotec", "logo": "syniotec-logo.svg" },     // file in assets/
  "footer": { "slogan": "…", "website": "syniotec.com" },

  "parties": [                          // cover; 2 or 3 columns
    { "role": "owner" | "rentalCompany" | "transportProvider" | "customer",
      "name": "Max Mustermann", "company": "GmbH Große Mode", "address": "28195 Bremen, Germany" }
  ],
  "constructionSite": "Bremen Roadworks",   // present → compact cover (Bulk, Without booking)

  "overview": [ { "no": 1, "product": "Crawler excavator", "name": "Volvo F504",
                  "bookingDates": "01.01.2028 14:42 – 02.02.2029 16:48", "quantity": 1,
                  "details": { "id": "…", "category": "…", "subtitle": "…", "serialNumber": "…" } } ],
  "equipment": { "title": "Volvo 2019 F507", "id": "…", "category": "…", "subtitle": "…", "serialNumber": "…" },
  "inventory": [ { "name": "Fences", "total": 100, "delivered": 98 } ],            // hand out
  //           [ { "name": "Fences", "total": 100, "returned": 98, "remaining": 0, "lostDamaged": 2 } ]  // hand in

  "operatingHours": [ { "no": 1, "equipment": "Volvo F504", "hours": "45 h" } ],  // one entry without
                                                                                   // "equipment": a single field
  "rental": { "warehouse": "…", "rentalId": "…", "companyCustomer": "…", "placeOfUse": "…",
              "tankLevel": "65 %", "tankPhoto": "url" },
  "attachments": [ { "title": "optional, default 'Attachment n'", "note": "…",
                     "photos": [ { "src": "url" } ],
                     "documents": [ { "name": "Document", "date": "14.02.2020", "url": "…" } ] } ],
  "general": { "uvv": "26.01.2021", "workingHour": "8:00 AM" },
  "cleaning": "yes" | "no",

  "checklists": [ { "title": "Question group",
    "groups": [ { "title": "Group", "heading": "General",
      "questions": [ { "no": "1.1", "label": "…",
                       "complete": "ok" | "failed" | "not_relevant",
                       "condition": "yes" | "no",
                       "info": "additional information" } ],
      "lastAnswers": [ { "no": "1.2", "label": "…", "complete": "ok", "condition": "yes",
                         "info": "…", "photo": "url" } ] } ] } ],

  "lightsTitle": "Lights",
  "lights": [ { "label": "Headlights", "value": "yes" },
              { "label": "Cabin lights", "value": "no", "photos": [ { "src": "url" } ] } ],
  "photos": [ { "label": "Front view", "src": "url" } ],

  "views360": [ { "label": "360° view exterior", "file": "Exterior video.mp4", "url": "…" } ],
  "rating": { "score": 3, "max": 5, "comment": "…" },
  "signatures": [ { "role": "rentalCompany", "name": "…", "company": "…", "signature": "url or null" },
                  { "role": "customer", "name": "…", "company": "…", "email": "…", "signedAt": "…" } ],
  "company": { "name": "syniotec", "brandLine": "A brand of Sharemac GmbH",
               "columns": [ ["Address: …", "City: …"], ["T …"], ["VAT ID: …"], ["Bank: …"] ],
               "management": "Management: …", "termsTitle": "Terms and conditions", "terms": "…" }
}
```

Checklist questions, photo captions, light names and other values come in the report's language with the
data; only the fixed labels (Handover Report, Contract ID, Warehouse, Complete, Yes/No …) are translated by
the template.

## Design

- Every length is in pt and was measured from the InDesign PDFs, so the pages can be checked against them
  1:1. The page is A4 with 10 mm side margins.
- Colours are Syn tokens: Candy Apple for labels and the type, Jet for the cover text, Eerie Black for values,
  Silver Chalice for muted text and hairlines, Cultured for the alternating bands, Amber for document and video
  links, Mantis and Honey in the checklist status icons (the PDFs' `#41ad49` green is now Mantis).
- Fonts are Syn's: **ABC Favorit Expanded** for titles and labels (where the PDFs used ABC Favorit
  Extended/Expanded) and **Montserrat** for values (where they used Myriad Pro). Montserrat runs wider than
  Myriad, so a few lines wrap differently and some blocks sit a few points lower or higher.
- The logo is the syniotec wordmark taken from the PDFs as vector (`assets/syniotec-logo.svg`).

### ABC Favorit Expanded

The face is commercial and is not in this repository. Put the licensed files in `fonts/` as
`ABCFavoritExpanded-Book.woff2`, `-Medium.woff2` and `-Bold.woff2` (or install the family on the render
server). Until then titles and labels fall back to Montserrat, which is how the example PDFs are printed.

### Corrected from the PDFs

- Dummy text typos: Softvares, Eurpe/Bremen, Additioanl, excavaror, Craweler, Adress, Managment,
  Deutshe bank, GMBH, the date "02.022.2029", the time "14:86", the postcode "0177447".
- One date format everywhere, and the cover and header show the same date.
- German and English are no longer mixed in one report ("Einsatzort", "Vollständig", "Raupenbagger" in the
  English one).
- The checklist's repeated numbers (1.8, 1.9 three times) run 1.1 to 1.13.
- The Bulk cover, a Hand out, showed the Hand in columns (Returned, Lost/Damaged); a Hand out now always shows
  Total / Delivered.
- Text cut off on the closing page of Bulk and Without Booking ("Max Muster-") now fits.
- Hand in counts read Returned 0, Remaining 98; the example uses Returned 98, Remaining 0, Lost/Damaged 2.

## Files

| File | What |
| --- | --- |
| `render.mjs` | `renderHandover(data, options)` → HTML |
| `handover.css` | Print stylesheet: pages, header and footer, every block |
| `i18n.mjs` | Fixed labels, English and German |
| `samples/variants.mjs` | Example data for the six variants |
| `build.mjs` | Writes `examples/` (and the PDFs with `--pdf`) |
| `assets/` | Logo and the example photos (taken from the PDFs) |
| `fonts/` | Montserrat (OFL); the slot for ABC Favorit Expanded |
