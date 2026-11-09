// Sample data for the six handover variants, in English and German.
// Content follows the reference PDFs (typos in the dummy text corrected).

const P = '../assets/photos/';

const company = {
  en: {
    name: 'syniotec',
    brandLine: 'A brand of Sharemac GmbH',
    columns: [
      ['Address: Am Wall 146', 'City: Bremen', 'Postcode: 28195', 'Country: Germany'],
      ['T +49 421 83679700', 'M info@syniotec.com', 'www.syniotec.com'],
      ['VAT ID: DE316314130', 'Register no.: HRB 33169'],
      ['Bank: Deutsche Bank', 'BIC/SWIFT: DEUTDEFFXXX', 'IBAN: DE34 5001 0517 3163 9812 79'],
    ],
    management: 'Management: Manuel Kimanov',
    termsTitle: 'Terms and conditions',
    terms:
      '“Terms and Conditions” is the document governing the contractual relationship between the provider of a service and its user. On the web, this document is often also called “Terms of Service” (ToS), “Terms of Use”, EULA (“End-User License Agreement”), “General Conditions” or “Legal Notes”.',
  },
  de: {
    name: 'syniotec',
    brandLine: 'Eine Marke der Sharemac GmbH',
    columns: [
      ['Adresse: Am Wall 146', 'Stadt: Bremen', 'PLZ: 28195', 'Land: Deutschland'],
      ['T +49 421 83679700', 'M info@syniotec.com', 'www.syniotec.com'],
      ['USt-IdNr.: DE316314130', 'Registernr.: HRB 33169'],
      ['Bank: Deutsche Bank', 'BIC/SWIFT: DEUTDEFFXXX', 'IBAN: DE34 5001 0517 3163 9812 79'],
    ],
    management: 'Geschäftsführung: Manuel Kimanov',
    termsTitle: 'Allgemeine Geschäftsbedingungen',
    terms:
      'Die „Allgemeinen Geschäftsbedingungen“ regeln das Vertragsverhältnis zwischen dem Anbieter einer Leistung und ihrem Nutzer. Im Web heißt dieses Dokument oft auch „Nutzungsbedingungen“, „Terms of Service“ (ToS), EULA („Endbenutzer-Lizenzvertrag“) oder „Rechtliche Hinweise“.',
  },
};

const text = {
  en: {
    createdAt: '20 May 2025, 11:00 (Europe/Berlin)',
    footer: { slogan: 'syniotec Software 2025 / We synchronize you with the future!', website: 'syniotec.com' },
    crawler: 'Crawler excavator',
    smallInv: 'Small inventory',
    bigInv: 'Big inventory',
    fence: 'Fence',
    longFence: 'Long fence',
    fences: 'Fences',
    longFences: 'Long fences',
    dates: '01.01.2028 14:42 – 02.02.2029 16:48',
    warehouse: 'Halensee Warehouse',
    placeOfUse: 'Bremen Roadworks',
    scratches: 'Scratches on front mirror',
    techCheck: 'Technical check in PDF',
    document: 'Document',
    checklist: 'Question group',
    group: 'Group',
    heading: 'General',
    q: [
      'General operating licence / registration certificate',
      'Operating instructions',
      'Hazard assessment',
      'Last test certificate',
      'Type plate / CE marking',
      'Declaration of conformity',
      'Warning signs / information plates',
      'Last test certificate',
      'Type plate / CE marking',
      'Last test certificate',
      'Type plate / CE marking',
      'Last test certificate',
      'Type plate / CE marking',
    ],
    damage:
      'The damage always indicates the failure or impairment of a machine or technical system. Machine damage can take many forms and often has a significant impact on efficiency.',
    lights: 'Lights',
    headlights: 'Headlights',
    cabinLights: 'Cabin lights',
    photos: ['Front view', 'Left side 45 degrees', 'Back view', 'Right side 45 degrees', 'Cabin', 'Bucket', 'Other image'],
    ext: '360° view exterior',
    int: '360° view interior',
    comment: 'The quick brown fox jumps over the lazy dog',
    category: 'Crawler excavator',
    subtitle: 'Volvo excavator over 50 t',
    subtitleWb: 'Crawler excavator Volvo',
    address: '28195 Bremen, Germany',
  },
  de: {
    createdAt: '20.05.2025, 11:00 (Europe/Berlin)',
    footer: { slogan: 'syniotec Software 2025 / We synchronize you with the future!', website: 'syniotec.com' },
    crawler: 'Raupenbagger',
    smallInv: 'Kleininventar',
    bigInv: 'Großinventar',
    fence: 'Zaun',
    longFence: 'Langer Zaun',
    fences: 'Zäune',
    longFences: 'Lange Zäune',
    dates: '01.01.2028 14:42 – 02.02.2029 16:48',
    warehouse: 'Lager Halensee',
    placeOfUse: 'Straßenbau Bremen',
    scratches: 'Kratzer am Frontspiegel',
    techCheck: 'Technische Prüfung als PDF',
    document: 'Dokument',
    checklist: 'Fragengruppe',
    group: 'Gruppe',
    heading: 'Allgemein',
    q: [
      'Allgemeine Betriebserlaubnis / Zulassungsbescheinigung',
      'Betriebsanleitung',
      'Gefährdungsbeurteilung',
      'Letzte Prüfbescheinigung',
      'Typenschild / CE-Kennzeichnung',
      'Konformitätserklärung',
      'Warn- und Hinweisschilder',
      'Letzte Prüfbescheinigung',
      'Typenschild / CE-Kennzeichnung',
      'Letzte Prüfbescheinigung',
      'Typenschild / CE-Kennzeichnung',
      'Letzte Prüfbescheinigung',
      'Typenschild / CE-Kennzeichnung',
    ],
    damage:
      'Ein Schaden bedeutet immer den Ausfall oder die Beeinträchtigung einer Maschine oder technischen Anlage. Maschinenschäden haben viele Formen und wirken sich oft stark auf die Effizienz aus.',
    lights: 'Beleuchtung',
    headlights: 'Scheinwerfer',
    cabinLights: 'Kabinenbeleuchtung',
    photos: ['Vorderansicht', 'Linke Seite 45 Grad', 'Rückansicht', 'Rechte Seite 45 Grad', 'Kabine', 'Löffel', 'Weiteres Bild'],
    ext: '360°-Ansicht außen',
    int: '360°-Ansicht innen',
    comment: 'Franz jagt im komplett verwahrlosten Taxi quer durch Bayern',
    category: 'Raupenbagger',
    subtitle: 'Volvo-Bagger über 50 t',
    subtitleWb: 'Raupenbagger Volvo',
    address: '28195 Bremen, Deutschland',
  },
};

// Pattern of the reference checklist (complete status, condition answer, additional info)
const pattern = [
  ['ok', 'no', true],
  ['not_relevant', 'yes'],
  ['failed'],
  ['ok', 'yes'],
  ['not_relevant'],
  ['failed'],
  ['not_relevant'],
  ['failed'],
  ['not_relevant'],
  ['failed'],
  ['not_relevant'],
  ['ok', 'yes', true],
  ['not_relevant'],
];

function base(lang) {
  const x = text[lang];
  return {
    lang,
    createdAt: x.createdAt,
    handoverId: 'RC15484BTT',
    contractId: 'RC15484BTT',
    brand: { name: 'syniotec', logo: 'syniotec-logo.svg' },
    footer: x.footer,
    rental: {
      warehouse: x.warehouse,
      rentalId: 'RC15484BTT',
      companyCustomer: 'Reisebüro GmbH',
      placeOfUse: x.placeOfUse,
      tankLevel: '65 %',
      tankPhoto: `${P}tank-gauge.jpg`,
    },
    attachments: [
      { note: x.scratches, photos: [{ src: `${P}attachment-mirror-1.jpg` }, { src: `${P}attachment-mirror-2.jpg` }] },
      {
        note: x.techCheck,
        documents: [
          { name: x.document, date: '14.02.2020', url: '#' },
          { name: x.document, date: '14.02.2020', url: '#' },
        ],
      },
    ],
    general: { uvv: '26.01.2021', workingHour: '8:00 AM' },
    cleaning: 'yes',
    checklists: [
      {
        title: x.checklist,
        groups: [
          {
            title: x.group,
            heading: x.heading,
            questions: pattern.map(([complete, condition, withInfo], i) => ({
              no: `1.${i + 1}`,
              label: x.q[i],
              complete,
              condition,
              info: withInfo ? x.damage : undefined,
            })),
          },
        ],
      },
    ],
    lightsTitle: x.lights,
    lights: [
      { label: x.headlights, value: 'yes' },
      { label: x.cabinLights, value: 'no', photos: [{ src: `${P}cabin-lights-1.jpg` }, { src: `${P}cabin-lights-2.jpg` }] },
    ],
    photos: ['front-view', 'left-45', 'back-view', 'right-45', 'cabin', 'bucket', 'other'].map((f, i) => ({
      label: x.photos[i],
      src: `${P}${f}.jpg`,
    })),
    views360: [
      { label: x.ext, file: 'Exterior video.mp4', url: '#' },
      { label: x.int, file: 'Interior video.mp4', url: '#' },
    ],
    rating: { score: 3, max: 5, comment: x.comment },
    signatures: [
      { role: 'rentalCompany', name: 'Max Mustermann', company: 'GmbH Große Mode', signature: null },
      { role: 'transportProvider', name: 'John Doe', company: 'GmbH Holidayquelle', signature: null },
      { role: 'customer', name: 'Max Mustermann', company: 'GmbH Reisefokus', email: 'max.mustermann@reisefokus.de' },
    ],
    company: company[lang],
  };
}

const threeParties = (first) => [
  { role: first, name: 'Max Mustermann', company: 'GmbH Große Mode' },
  { role: 'transportProvider', name: 'John Doe', company: 'GmbH Holidayquelle' },
  { role: 'customer', name: 'Max Mustermann', company: 'GmbH Reisefokus' },
];

const threeRows = (x) => [
  { no: 1, product: x.crawler, name: 'Volvo F504', bookingDates: x.dates, quantity: 1 },
  { no: 2, product: x.smallInv, name: x.fence, bookingDates: x.dates, quantity: 100 },
  { no: 3, product: x.bigInv, name: x.longFence, bookingDates: x.dates, quantity: 100 },
];

export const variants = {
  // Handover Protocol Hand out
  'hand-out': (lang) => {
    const x = text[lang];
    return {
      ...base(lang),
      type: 'hand_out',
      parties: threeParties('owner'),
      overview: threeRows(x),
      inventory: [
        { name: x.fences, total: 100, delivered: 98 },
        { name: x.longFences, total: 100, delivered: 98 },
      ],
      signatures: base(lang).signatures.map((s) => (s.role === 'rentalCompany' ? { ...s, role: 'owner' } : s)),
    };
  },

  // Handover handin Protocol (equipment and inventory)
  'hand-in': (lang) => {
    const x = text[lang];
    return {
      ...base(lang),
      type: 'hand_in',
      parties: threeParties('owner'),
      overview: threeRows(x),
      inventory: [
        { name: x.fences, total: 100, returned: 98, remaining: 0, lostDamaged: 2 },
        { name: x.longFences, total: 100, returned: 98, remaining: 0, lostDamaged: 2 },
      ],
      signatures: base(lang).signatures.map((s) => (s.role === 'rentalCompany' ? { ...s, role: 'owner' } : s)),
    };
  },

  // Handover Protocol Hand in only equipment
  'hand-in-equipment': (lang) => {
    const x = text[lang];
    return {
      ...base(lang),
      type: 'hand_in',
      parties: threeParties('rentalCompany'),
      overview: threeRows(x).slice(0, 1),
    };
  },

  // Last answer: hand in with the previous handover's answers
  'hand-in-last-answer': (lang) => {
    const x = text[lang];
    const b = base(lang);
    const group = b.checklists[0].groups[0];
    group.lastAnswers = [1, 2, 2, 2].map((n, i) => ({
      no: `1.${n}`,
      label: x.q[3],
      complete: 'ok',
      condition: 'yes',
      info: x.damage,
      photo: `${P}answer-cabin-light.jpg`,
    }));
    return {
      ...b,
      type: 'hand_in',
      parties: threeParties('rentalCompany'),
      overview: threeRows(x).slice(0, 1),
      lights: undefined,
    };
  },

  // Bulk: several pieces of equipment, construction site, equipment details row
  bulk: (lang) => {
    const x = text[lang];
    const rows = threeRows(x);
    rows[0].details = { id: '564564', category: x.category, subtitle: x.subtitle, serialNumber: '564564' };
    return {
      ...base(lang),
      type: 'hand_out',
      parties: [
        { role: 'rentalCompany', company: 'GmbH Große Mode', address: x.address },
        { role: 'customer', company: 'GmbH Große Mode', address: x.address },
      ],
      constructionSite: x.placeOfUse,
      overview: rows,
      inventory: [
        { name: x.fences, total: 100, delivered: 98 },
        { name: x.longFences, total: 100, delivered: 98 },
      ],
      operatingHours: [
        { no: 1, equipment: 'Volvo F504', hours: '45 h' },
        { no: 4, equipment: 'Volvo F504', hours: '45 h' },
      ],
    };
  },

  // Without booking: one piece of equipment, no booking overview
  'without-booking': (lang) => {
    const x = text[lang];
    return {
      ...base(lang),
      type: 'hand_out',
      handoverId: '',
      parties: [
        { role: 'rentalCompany', company: 'GmbH Große Mode', address: x.address },
        { role: 'customer', company: 'GmbH Große Mode', address: x.address },
      ],
      constructionSite: x.placeOfUse,
      equipment: {
        title: 'Volvo 2019 F507',
        id: '5645646DB784',
        category: x.category,
        subtitle: x.subtitleWb,
        serialNumber: '6556456',
      },
      operatingHours: [{ hours: '45 h' }],
    };
  },
};
