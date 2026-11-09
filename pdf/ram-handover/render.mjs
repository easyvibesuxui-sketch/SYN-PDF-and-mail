// RAM Handover Report: data -> HTML.
//
//   import { renderHandover } from './render.mjs';
//   const html = renderHandover(data, { assetBase: './' });
//
// `data` is described in README.md (and every file in dist/*.json is a full example). The function
// returns one self-standing HTML document; print it with a Chromium engine to get the PDF
// (see pdf.mjs). Sections without data are left out, so one template covers Hand out, Hand in,
// Bulk, Without booking and the Last answer variant.

import { translator } from './i18n.mjs';

const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const has = (v) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0);

// CSS string literal for @page margin boxes
const cssString = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\A ')}"`;

// ---------- Icons (Syn "Main icons", currentColor) ----------------------------------------------------

const icon = {
  ok: (label) =>
    `<svg viewBox="0 0 12 12" role="img" aria-label="${esc(label)}"><circle cx="6" cy="6" r="5.3" fill="none" stroke="#151515" stroke-width="0.7"/><path d="M3.5 6.2 5.3 8l3.3-3.8" fill="none" stroke="#71c562" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  failed: (label) =>
    `<svg viewBox="0 0 12 12" role="img" aria-label="${esc(label)}"><circle cx="6" cy="6" r="5.3" fill="none" stroke="#151515" stroke-width="0.7"/><path d="m4.1 4.1 3.8 3.8m0-3.8L4.1 7.9" fill="none" stroke="#ffb30f" stroke-width="0.9" stroke-linecap="round"/></svg>`,
  next: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6.97 17L6 16.00L12.02 10L6 3.99L6.97 3L14 10L6.97 17Z" fill="currentColor"/></svg>`,
  calendar: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M0 1.68H20V20H0V1.68ZM18.9 2.8H1.1V18.9H18.9V2.8ZM19.6 6.5H.4V5.7H19.6V6.5ZM4.6 4.1H3.9V0H4.6V4.1ZM16.1 4.1H15.4V0H16.1V4.1Z" fill="#151515"/></svg>`,
  time: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 20C11.97 20 13.91 19.41 15.55 18.31 17.19 17.21 18.48 15.65 19.23 13.82 19.99 11.99 20.19 9.98 19.8 8.04 19.42 6.1 18.46 4.32 17.07 2.92 15.67 1.53 13.88.57 11.95.19 10.01-.19 7.99 0 6.17.76 4.34 1.51 2.78 2.8 1.68 4.44.58 6.08 0 8.02 0 10 0 12.65 1.05 15.19 2.93 17.06 4.8 18.94 7.34 19.99 10 20ZM10 1.25C11.73 1.25 13.42 1.76 14.86 2.72 16.29 3.68 17.42 5.05 18.08 6.65 18.74 8.25 18.91 10.01 18.58 11.7 18.24 13.4 17.41 14.96 16.18 16.18 14.96 17.41 13.4 18.24 11.7 18.58 10 18.92 8.24 18.74 6.65 18.08 5.05 17.42 3.68 16.3 2.72 14.86 1.76 13.42 1.24 11.73 1.24 10 1.25 7.68 2.17 5.45 3.81 3.81 5.45 2.17 7.68 1.25 10 1.25ZM13.41 14.29 14.29 13.41 10.62 9.74V2.99H9.37V10C9.37 10.08 9.39 10.16 9.42 10.23 9.45 10.31 9.5 10.38 9.55 10.44L13.41 14.29Z" fill="#151515"/></svg>`,
  fuel: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 2h9v16H3zM4.3 3.3v5h6.4v-5z" fill="#a7b0b3" fill-rule="evenodd"/><path d="M12 6.5h1.6l2.4 2.4v7.3a1.3 1.3 0 0 1-2.6 0V12H12v-1.2h2.6v5.4h.2V9.4L13.1 7.7H12z" fill="#a7b0b3"/></svg>`,
  star: `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1 6.9 6.92 0 7.87 5 12.48 3.81 19 10 15.92 16.18 19 15 12.48 20 7.87 13.09 6.92Z" fill="currentColor"/></svg>`,
};

// ---------- Pieces ------------------------------------------------------------------------------------

function field(t, f, { filled } = {}) {
  const label = f.labelKey ? t(f.labelKey) : f.label;
  const ic = f.icon ? icon[f.icon] : '';
  const photos = has(f.photos)
    ? `<div class="ho-field__photos">${f.photos
        .map((p) => `<img class="ho-photo" src="${esc(p.src)}" alt="${esc(p.alt ?? label)}">`)
        .join('')}</div>`
    : '';
  return `<div class="ho-field${filled ? ' ho-field--filled' : ''}${photos ? ' ho-field--with-photos' : ''}">
        <div class="ho-field__label ho-label">${esc(label)}${ic}</div>
        ${has(f.value) ? `<div class="ho-field__value ho-value">${esc(f.value)}</div>` : ''}
        ${photos}
      </div>`;
}

function fields(t, list, opts = {}) {
  const items = list.filter((f) => has(f.value) || has(f.photos));
  if (!items.length) return '';
  return `<div class="ho-fields${items.length === 1 && opts.singleFilled ? ' ho-fields--single' : ''}">${items
    .map((f) => field(t, f))
    .join('')}</div>`;
}

function section(title, body, extraClass = '') {
  if (!body) return '';
  return `<section class="ho-section${extraClass ? ` ${extraClass}` : ''}">
      ${title ? `<h2 class="ho-section-title">${esc(title)}</h2>` : ''}
      ${body}
    </section>`;
}

function joinSections(parts) {
  return parts.filter(Boolean).join('\n    <div class="ho-rule" role="separator"></div>\n    ');
}

function statusCell(t, status) {
  if (status === 'ok') return icon.ok(t('statusOk'));
  if (status === 'failed') return icon.failed(t('statusFailed'));
  if (status === 'not_relevant') return `<span class="ho-na">${esc(t('notRelevant'))}</span>`;
  return '';
}

function answerText(t, v) {
  if (v === 'yes') return `<span class="ho-yes">${esc(t('yes'))}</span>`;
  if (v === 'no') return `<span class="ho-no">${esc(t('no'))}</span>`;
  return has(v) ? esc(v) : '';
}

function info(t, text) {
  if (!has(text)) return '';
  return `<div class="ho-info"><span class="ho-info__key">${esc(t('additionalInformation'))} *</span>${esc(text)}</div>`;
}

// ---------- Cover -------------------------------------------------------------------------------------

function cover(t, d, a) {
  const compact = has(d.constructionSite) || has(d.equipment);
  const parties = (d.parties ?? []).filter((p) => p.role !== undefined);

  const partyCols = parties
    .map((p) => {
      const lines = compact ? [p.company, p.address] : [p.name, p.company];
      return `<div>
          <div class="ho-parties__role">${esc(t(p.role))}</div>
          ${lines
            .filter(has)
            .map((l) => `<div class="ho-parties__line">${esc(l)}</div>`)
            .join('')}
        </div>`;
    })
    .join('');

  const overview = has(d.overview)
    ? `<div class="ho-overview__title">${esc(t('overview'))}</div>
      <table class="ho-table ho-overview">
        <colgroup><col class="ho-col-no"><col class="ho-col-product"><col class="ho-col-name"><col class="ho-col-dates"><col></colgroup>
        <thead><tr><th></th><th>${esc(t('product'))}</th><th>${esc(t('name'))}</th><th>${esc(t('bookingDates'))}</th><th>${esc(t('quantity'))}</th></tr></thead>
        <tbody>
          ${d.overview
            .map(
              (r, i) => `<tr class="ho-overview__item">
            <td>#${esc(r.no ?? i + 1)}</td><td>${esc(r.product)}</td><td>${esc(r.name)}</td><td>${esc(r.bookingDates)}</td><td>${esc(r.quantity)}</td>
          </tr>${
            has(r.details)
              ? `<tr class="ho-overview__details"><td colspan="5"><div class="ho-details">
              <span><span class="ho-k">${esc(t('id'))}</span>${esc(r.details.id)}</span>
              <span><span class="ho-k">${esc(t('category'))}</span>${esc(r.details.category)}</span>
              <span><span class="ho-k">${esc(t('subtitle'))}</span>${esc(r.details.subtitle)}</span>
              <span><span class="ho-k">${esc(t('serialNumber'))}</span>${esc(r.details.serialNumber)}</span>
            </div></td></tr>`
              : ''
          }`,
            )
            .join('')}
        </tbody>
      </table>
      <div class="ho-hairline ho-overview__end"></div>`
    : '';

  const handIn = d.type === 'hand_in';
  const inventory = has(d.inventory)
    ? `<div class="ho-inventory">${d.inventory
        .map(
          (inv) => `<div class="ho-inventory__block">
          <div class="ho-inventory__name">${esc(inv.name)}</div>
          <table class="ho-table">
            <colgroup>${
              handIn
                ? '<col class="ho-col-total"><col class="ho-col-returned"><col class="ho-col-remaining"><col>'
                : '<col class="ho-col-total"><col>'
            }</colgroup>
            <thead><tr><th>${esc(t('total'))}</th>${
              handIn
                ? `<th>${esc(t('returned'))}</th><th>${esc(t('remaining'))}</th><th>${esc(t('lostDamaged'))}</th>`
                : `<th>${esc(t('delivered'))}</th>`
            }</tr></thead>
            <tbody><tr><td>${esc(inv.total)}</td>${
              handIn
                ? `<td>${esc(inv.returned)}</td><td>${esc(inv.remaining)}</td><td>${esc(inv.lostDamaged)}</td>`
                : `<td>${esc(inv.delivered)}</td>`
            }</tr></tbody>
          </table>
          <div class="ho-hairline ho-hairline--single"></div>
        </div>`,
        )
        .join('')}</div>`
    : '';

  const equipment = has(d.equipment)
    ? `<div class="ho-equipment">
        <div class="ho-equipment__key">${esc(t('title'))}</div>
        <div class="ho-equipment__title">${esc(d.equipment.title)}</div>
        <div class="ho-equipment__grid">
          ${['id', 'category', 'subtitle', 'serialNumber']
            .map(
              (k) => `<div><div class="ho-equipment__key">${esc(t(k))}</div><div class="ho-equipment__val">${esc(d.equipment[k])}</div></div>`,
            )
            .join('')}
        </div>
      </div>`
    : '';

  const site = has(d.constructionSite)
    ? `<div class="ho-site"><div class="ho-site__label">${esc(t('constructionSite'))}</div><div class="ho-site__value">${esc(d.constructionSite)}</div></div>`
    : '';

  return `<section class="ho-cover${compact ? ' ho-cover--compact' : ''}">
    <div class="ho-cover__date">${esc(d.createdAt)}</div>
    <img class="ho-cover__logo" src="${a}assets/${esc(d.brand?.logo ?? 'syniotec-logo.svg')}" alt="${esc(d.brand?.name ?? 'syniotec')}">
    <h1 class="ho-cover__title">${esc(t('handoverReport'))}</h1>
    <div class="ho-cover__row ho-cover__id-label">${esc(t('handoverId'))}</div>
    <div class="ho-cover__id">${esc(d.handoverId)}</div>
    <div class="ho-cover__row ho-cover__row--contract"><span class="ho-cover__row-label">${esc(t('contractId'))}</span><span>${esc(d.contractId)}</span></div>
    ${
      has(d.type)
        ? `<div class="ho-cover__row ho-cover__row--type"><span class="ho-cover__row-label">${esc(t('type'))}</span><span class="ho-cover__type">${esc(t(d.type))}</span></div>`
        : ''
    }
    <div class="ho-cover__lower">
      ${parties.length ? `<div class="ho-parties">${partyCols}</div>` : ''}
      ${site}
      <div class="ho-hairline ho-cover__divider${compact ? ' ho-hairline--single' : ''}"></div>
      ${equipment}
      ${overview}
      ${inventory}
    </div>
  </section>`;
}

// ---------- Body --------------------------------------------------------------------------------------

function operatingHours(t, d) {
  if (!has(d.operatingHours)) return '';
  if (d.operatingHours.length === 1 && !d.operatingHours[0].equipment) {
    return fields(t, [{ labelKey: 'operatingHours', value: d.operatingHours[0].hours }], { singleFilled: true });
  }
  return `<div class="ho-hours">${d.operatingHours
    .map(
      (h, i) => `<div class="ho-hours__row">
        <div class="ho-hours__no">#${esc(h.no ?? i + 1)}</div>
        <div class="ho-hours__cell"><div class="ho-label">${esc(t('equipment'))}</div><div class="ho-value">${esc(h.equipment)}</div></div>
        <div class="ho-hours__cell"><div class="ho-label">${esc(t('operatingHours'))}</div><div class="ho-value ho-value--book">${esc(h.hours)}</div></div>
      </div>`,
    )
    .join('')}</div>`;
}

function rental(t, d) {
  const r = d.rental;
  if (!r) return '';
  const list = [
    { labelKey: 'warehouse', value: r.warehouse },
    { labelKey: 'rentalId', value: r.rentalId },
    { labelKey: 'companyCustomer', value: r.companyCustomer },
    { labelKey: 'placeOfUse', value: r.placeOfUse },
    { labelKey: 'tankLevel', value: r.tankLevel, icon: 'fuel', photos: r.tankPhoto ? [{ src: r.tankPhoto }] : [] },
  ];
  return fields(t, list);
}

function attachments(t, d) {
  if (!has(d.attachments)) return '';
  return `<div class="ho-fields">${d.attachments
    .map((att, i) => {
      const n = i + 1;
      const docs = has(att.documents)
        ? `<div class="ho-links">${att.documents
            .map(
              (doc) => `<a class="ho-link" href="${esc(doc.url ?? '#')}">
              <span class="ho-link-text">${esc(doc.name ?? t('document'))}<span class="ho-gap">${esc(doc.date ?? '')}</span></span>${icon.next}
            </a>`,
            )
            .join('')}</div>`
        : '';
      const photos = has(att.photos)
        ? `<div class="ho-field__photos">${att.photos
            .map((p) => `<img class="ho-photo" src="${esc(p.src)}" alt="${esc(p.alt ?? att.note ?? '')}">`)
            .join('')}</div>`
        : '';
      return `<div class="ho-field${photos ? ' ho-field--with-photos' : ''}">
          <div class="ho-field__label ho-label">${esc(att.title ?? `${t('attachment')} ${n}`)}${
            docs && has(att.note) ? ` <span class="ho-field__inline">${esc(att.note)}</span>` : ''
          }</div>
          ${!docs && has(att.note) ? `<div class="ho-field__value ho-value">${esc(att.note)}</div>` : ''}
          ${photos}${docs}
        </div>`;
    })
    .join('')}</div>`;
}

function general(t, d) {
  const g = d.general;
  if (!g) return '';
  return fields(t, [
    { labelKey: 'uvv', value: g.uvv, icon: 'calendar' },
    { labelKey: 'workingHour', value: g.workingHour, icon: 'time' },
  ]);
}

function checklists(t, d) {
  if (!has(d.checklists)) return [];
  return d.checklists.map((cl) => {
    const groups = (cl.groups ?? [])
      .map((g) => {
        const rows = (g.questions ?? [])
          .map(
            (q) => `<div class="ho-q">
            <div class="ho-q__main">
              <div class="ho-q__text">${esc([q.no, q.label].filter(has).join(' '))}</div>
              <div class="ho-q__complete">${statusCell(t, q.complete)}</div>
              <div class="ho-q__condition">${answerText(t, q.condition)}</div>
            </div>
            ${info(t, q.info)}
          </div>`,
          )
          .join('');
        const answers = has(g.lastAnswers)
          ? `<div class="ho-answers">
            <div class="ho-answers__title">${esc(t('lastAnswer'))}</div>
            ${g.lastAnswers
              .map(
                (an) => `<div class="ho-answer">
              <div>
                <div class="ho-answer__q">${esc([an.no, an.label].filter(has).join(' '))} ${statusCell(t, an.complete)} ${answerText(t, an.condition)}</div>
                ${info(t, an.info)}
              </div>
              ${an.photo ? `<img class="ho-answer__photo" src="${esc(an.photo)}" alt="">` : '<div></div>'}
            </div>`,
              )
              .join('')}
          </div>`
          : '';
        return `${has(g.title) ? `<h3 class="ho-subtitle">${esc(g.title)}</h3>` : ''}
          <div class="ho-check">
            <div class="ho-check__head">
              <div class="ho-label">${esc(g.heading ?? '')}</div>
              <div class="ho-label">${esc(t('complete'))}</div>
              <div class="ho-label">${esc(t('conditionOk'))}</div>
            </div>
            <div class="ho-check__rows">${rows}</div>
            ${answers}
          </div>`;
      })
      .join('');
    return section(cl.title, groups, 'ho-section--spaced');
  });
}

function lights(t, d) {
  if (!has(d.lights)) return '';
  return fields(
    t,
    d.lights.map((l) => ({ label: l.label, value: answerPlain(t, l.value), photos: l.photos })),
  );
}

function answerPlain(t, v) {
  if (v === 'yes') return t('yes');
  if (v === 'no') return t('no');
  return v;
}

function photos(t, d) {
  if (!has(d.photos)) return '';
  return `<div class="ho-photos">${d.photos
    .map(
      (p) => `<figure>
        <figcaption class="ho-label">${esc(p.label)}</figcaption>
        <img class="ho-photo" src="${esc(p.src)}" alt="${esc(p.label)}">
      </figure>`,
    )
    .join('')}</div>`;
}

function body(t, d, a) {
  // Operating hours (Bulk, Without booking) sit above Rental information, in the same section.
  const hours = operatingHours(t, d);
  const rentalFields = rental(t, d);
  const parts = [
    hours || rentalFields
      ? `<section class="ho-section">${hours ? `<div class="ho-hours-block">${hours}</div>` : ''}${
          rentalFields ? `<h2 class="ho-section-title">${esc(t('rentalInformation'))}</h2>${rentalFields}` : ''
        }</section>`
      : '',
    section(t('attachments'), attachments(t, d)),
    section(t('generalInformation'), general(t, d)),
    has(d.cleaning)
      ? section('', fields(t, [{ labelKey: 'cleaningInOrder', value: answerPlain(t, d.cleaning) }], { singleFilled: true }))
      : '',
    ...checklists(t, d),
    section(d.lightsTitle ?? 'Lights', lights(t, d), 'ho-section--spaced'),
    section(t('photos'), photos(t, d), 'ho-section--spaced'),
  ];

  return `<section class="ho-body">
    <table class="ho-body__frame" role="presentation">
      <thead><tr><td>
        <header class="ho-header">
          <img class="ho-header__logo" src="${a}assets/${esc(d.brand?.logo ?? 'syniotec-logo.svg')}" alt="${esc(d.brand?.name ?? 'syniotec')}">
          <div class="ho-header__meta"><span>${esc(t('handoverReport'))}&nbsp;&nbsp;${esc(d.handoverId ?? '')}</span><span>${esc(d.createdAt)}</span></div>
        </header>
      </td></tr></thead>
      <tbody><tr><td>
        <div class="ho-content">
    ${joinSections(parts)}
        </div>
      </td></tr></tbody>
    </table>
  </section>`;
}

// ---------- Closing page ------------------------------------------------------------------------------

function closing(t, d, a) {
  const views = has(d.views360)
    ? section(
        t('views360'),
        `<div class="ho-link-rows">${d.views360
          .map(
            (v) => `<a class="ho-link-row" href="${esc(v.url ?? '#')}">
            <span><span class="ho-label ho-block">${esc(v.label)}</span><span class="ho-link-text">${esc(v.file)}</span></span>${icon.next}
          </a>`,
          )
          .join('')}</div>`,
      )
    : '';

  const rating = d.rating
    ? section(
        t('rating'),
        `<div class="ho-rating">
          <div class="ho-label">${esc(t('rateEquipment'))}</div>
          <div class="ho-rating__value"><span class="ho-rating__score">${esc(d.rating.score)}/${esc(d.rating.max ?? 5)}</span><svg class="ho-rating__star" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1 6.9 6.92 0 7.87 5 12.48 3.81 19 10 15.92 16.18 19 15 12.48 20 7.87 13.09 6.92Z" fill="currentColor"/></svg><span>${esc(d.rating.comment ?? '')}</span></div>
        </div>`,
      )
    : '';

  const top = [views, rating].filter(Boolean).join('<div class="ho-rule" role="separator"></div>');

  const signers = has(d.signatures)
    ? `<div class="ho-signers">${d.signatures
        .map((s) => {
          const isCustomer = s.role === 'customer';
          const lines = [s.name, s.company, s.email].filter(has);
          const right = s.signature
            ? `<div class="ho-signature"><img src="${esc(s.signature)}" alt="${esc(t('signature'))}"></div>`
            : isCustomer
              ? `<div class="ho-signer__stamp"><div>${esc(s.signedAt ?? d.createdAt)}</div><div><span>${esc(t('handoverReport'))}</span><span class="ho-stamp-id">${esc(d.handoverId ?? '')}</span></div></div>`
              : `<div class="ho-signature" aria-label="${esc(t('signature'))}"></div>`;
          return `<div class="ho-signer">
            <div class="ho-signer__who">
              <div class="ho-label">${esc(t(s.role))}</div>
              <div class="ho-signer__lines">${lines
                .map((l, i) => `<div class="${isCustomer && i === 0 ? 'ho-signer__name--strong' : ''}">${esc(l)}</div>`)
                .join('')}</div>
            </div>
            ${right}
          </div>`;
        })
        .join('')}</div>`
    : '';

  const c = d.company;
  const company = c
    ? `<div class="ho-company">
        <img class="ho-company__logo" src="${a}assets/${esc(d.brand?.logo ?? 'syniotec-logo.svg')}" alt="${esc(c.name ?? 'syniotec')}">
        ${has(c.brandLine) ? `<div class="ho-company__brand">${esc(c.brandLine)}</div>` : ''}
        <div class="ho-company__grid">
          ${(c.columns ?? []).map((col) => `<div>${col.map((l) => `<div>${esc(l)}</div>`).join('')}</div>`).join('')}
        </div>
        ${has(c.management) ? `<div class="ho-company__mgmt">${esc(c.management)}</div>` : ''}
        ${
          has(c.terms)
            ? `<div class="ho-company__terms"><div class="ho-company__terms-title">${esc(c.termsTitle ?? '')}</div><p>${esc(c.terms)}</p></div>`
            : ''
        }
      </div>`
    : '';

  return `<section class="ho-closing">
    ${top}
    ${signers ? '<div class="ho-dotted" role="separator"></div>' : ''}
    ${signers}
    ${company}
  </section>`;
}

// ---------- Document ----------------------------------------------------------------------------------

export function renderHandover(data, { assetBase = './', inlineCss = null } = {}) {
  const t = translator(data.lang);
  const a = assetBase;
  const footer = [data.footer?.slogan, data.footer?.website].filter(has).join('\n');
  // Inline CSS: point its font URLs at assetBase, as the linked stylesheet would resolve them.
  const css = inlineCss
    ? `<style>\n${inlineCss.replace(/url\('fonts\//g, `url('${a}fonts/`)}\n</style>`
    : `<link rel="stylesheet" href="${a}handover.css">`;
  return `<!doctype html>
<html lang="${esc(data.lang ?? 'en')}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t('handoverReport'))} ${esc(data.handoverId ?? data.contractId ?? '')}</title>
${css}
<style>@page body { @bottom-left { content: ${cssString(footer)}; } }</style>
</head>
<body>
  ${cover(t, data, a)}
  ${body(t, data, a)}
  ${closing(t, data, a)}
</body>
</html>
`;
}
