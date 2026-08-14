/**
 * Seed content for JECMWA LIMITED.
 *
 * This is the migration path for the content that used to live in
 * `src/data/site.ts`. Once seeded, the studio edits everything through the admin
 * and this file is only a bootstrap for a fresh environment.
 *
 * `file` values are relative to `seed-assets/`.
 */

export const SITE_SETTINGS = {
  legal_name: "JECMWA LIMITED",
  display_name: "JECMWA",
  tagline: "Mirrors, portraits and curated decor for considered homes.",
  phone_display: "0711 722 331",
  phone_e164: "+254711722331",
  whatsapp_e164: "+254711722331",
  email: "jecmwa03@gmail.com",
  hours: "By appointment — Monday to Saturday",
  location: "Studio visits by request — Nairobi, Kenya",
  city: "Nairobi",
  country: "KE",
  service_areas: ["Nairobi", "Kiambu", "Machakos", "Kajiado"],
  socials: {},
  stats: [
    { value: "4", label: "Years styling" },
    { value: "49", label: "Homes shaped" },
    { value: "41", label: "Pieces documented" },
  ],
  seo_title: "JECMWA LIMITED — Interior Styling, Mirrors & Curated Decor",
  seo_description:
    "JECMWA LIMITED designs warm, character-filled interiors. Bespoke styling, decorative mirrors, portrait curation, and curated decor for residential homes in Nairobi.",
};

export const CONTENT_BLOCKS = [
  {
    key: "hero",
    eyebrow: "JECMWA Limited · Nairobi",
    heading: "Mirrors, portraits",
    heading_emphasis: "and curated decor",
    body: [
      "for considered homes.",
      "An interior styling studio working room by room — composing mirror walls, framed portraits, art pieces and decor placements that quietly settle into the rhythm of a home.",
    ],
    file: "portfolio/mirror-stairway-grid.jpg",
    image_alt:
      "Six panel framed mirror grid styled on a duplex stairway landing beside a botanical art panel",
    cta_label: "Begin a Project",
    cta_href: "/enquire",
  },
  {
    key: "about",
    eyebrow: "The Studio",
    heading: "A Nairobi studio for mirrors, portraits",
    heading_emphasis: "and curated decor.",
    body: [
      "For four years we have styled homes across Nairobi — placing mirrors, framing portraits, selecting art pieces and settling decor into rooms that were already loved.",
      "We keep a curated library of frame profiles and finishes, so every piece is matched to the wall it will live on rather than pulled from a catalogue.",
      "Work is quiet and unhurried. We measure, we compose, we hang — and we leave a room feeling like it was always meant to look that way.",
    ],
    file: "portfolio/decor-foyer-entryway.jpg",
    image_alt:
      "Entry foyer with framed abstract painting and bronze sunflower mirror cluster around a wooden door",
  },
  {
    key: "contact",
    eyebrow: "Begin a Conversation",
    heading: "Tell us about",
    heading_emphasis: "your home.",
    body: [
      "Reach the studio directly by WhatsApp, phone or email. We respond personally, usually within a working day, and quote after a short conversation about the room you have in mind.",
    ],
  },
];

export const SERVICES = [
  {
    number: "01",
    slug: "interior-styling",
    title: "Interior Styling",
    body: "Room by room styling for finished homes — proportion, palette, and the placement of every chosen piece. We work until each space reads as a single, considered composition.",
  },
  {
    number: "02",
    slug: "mirrors",
    title: "Mirrors",
    body: "Framed mirrors composed as wall installations or singular statements. From clustered grids to standing arches, each piece is sized to the room and chosen for the way it draws light.",
  },
  {
    number: "03",
    slug: "portraits-and-art-pieces",
    title: "Portraits & Art Pieces",
    body: "Custom portraits and art pieces selected, framed and hung in compositions that feel collected. Family portraits, landscapes, abstracts and typography — sized to the wall, framed for the home.",
  },
  {
    number: "04",
    slug: "curated-decor",
    title: "Curated Decor",
    body: "Quiet sourcing of objects, vases, lighting and textiles — chosen to settle into the home rather than sit on top of it.",
  },
  {
    number: "05",
    slug: "framed-wall-styling",
    title: "Framed Wall Styling",
    body: "Gallery walls, paired pieces and grouped installations — measured, levelled and hung as a single composition. From staircases to corridors and bedheads.",
  },
  {
    number: "06",
    slug: "room-focused-decor-placement",
    title: "Room-Focused Decor Placement",
    body: "Focused styling for one room at a time — a lounge, a bedroom, a dining area, a washroom — taking what is already loved and adding only what the room asks for.",
  },
];

export const FRAME_FINISHES = [
  {
    slug: "laminate-frame-library",
    name: "Laminate Frame Library",
    note: "A working selection of laminate frame profiles in our studio — warm woods, deep blacks, soft whites, gilded golds and brushed silvers. Each profile is referenced by number; we pair the right finish to the piece, the wall and the room.",
    file: "frames-board.jpeg",
    image_alt: "Board of laminate frame profile samples in wood, black, white, gold and silver finishes",
    price_multiplier: 1.0,
  },
  {
    slug: "warm-oak-laminate",
    name: "Warm Oak Laminate",
    note: "A warm, light-grained laminate frame profile — soft, natural and quietly Scandinavian. Pairs gently with botanical art, family portraits and bright, daylit rooms.",
    file: "portfolio/frames-white-oak-detail.jpg",
    image_alt: "Close detail of a warm light oak laminate picture frame profile",
    price_multiplier: 1.0,
  },
  {
    slug: "deep-mahogany-laminate",
    name: "Deep Mahogany Laminate",
    note: "A rich, deep-toned laminate frame profile with the gravity of traditional mahogany. Anchors classical portraits, landscapes and formal lounges, dining rooms and studies.",
    file: "portfolio/frames-mahogany-detail.jpg",
    image_alt: "Close detail of a deep mahogany laminate picture frame profile",
    price_multiplier: 1.15,
  },
];

/**
 * base_price_kes is intentionally 0 — the studio sets real prices in the admin.
 * The UI renders "Price on request" until a non-zero price is saved.
 */
export const SIZE_OPTIONS = [
  { category: "art", label: "A4", width_cm: 21, height_cm: 29.7 },
  { category: "art", label: "60 × 40 cm", width_cm: 60, height_cm: 40 },
  { category: "art", label: "90 × 60 cm", width_cm: 90, height_cm: 60 },
  { category: "art", label: "120 × 80 cm", width_cm: 120, height_cm: 80 },
  { category: "art", label: "150 × 100 cm", width_cm: 150, height_cm: 100 },
  { category: "art", label: "200 × 120 cm", width_cm: 200, height_cm: 120 },

  { category: "mirror", label: "50 × 50 cm", width_cm: 50, height_cm: 50 },
  { category: "mirror", label: "60 × 40 cm", width_cm: 60, height_cm: 40 },
  { category: "mirror", label: "60 × 60 cm", width_cm: 60, height_cm: 60 },
  { category: "mirror", label: "100 × 100 cm", width_cm: 100, height_cm: 100 },
  { category: "mirror", label: "100 cm diameter", diameter_cm: 100 },
  { category: "mirror", label: "180 × 90 cm", width_cm: 180, height_cm: 90 },
  { category: "mirror", label: "200 × 100 cm", width_cm: 200, height_cm: 100 },
].map((s, i) => ({ base_price_kes: 0, sort_order: i, ...s }));

export const TESTIMONIALS = [
  {
    quote:
      "JECMWA shaped our home with a calm, careful hand. The mirrors and portraits feel like they were always meant to live there.",
    author_name: "Wanjiku M.",
    author_label: "Family residence, Nairobi",
  },
  {
    quote:
      "They listened first. The stairway gallery they styled for us is the part of the house guests linger in the longest.",
    author_name: "David & Mercy K.",
    author_label: "Duplex home, Nairobi",
  },
  {
    quote:
      "Working with the studio felt unhurried. Every framed piece, every mirror, every placement — chosen with intention.",
    author_name: "Joan A.",
    author_label: "Apartment styling",
  },
];

export const FAQS = [
  {
    question: "How do I know what size mirror or art piece my wall needs?",
    answer:
      "As a rule, a piece should span roughly two-thirds of the furniture it sits above, and hang with its centre at about 145 cm from the floor. Our wall-fit guide will suggest sizes from your wall measurements, and we confirm on a studio visit.",
  },
  {
    question: "Do you deliver and hang the pieces?",
    answer:
      "Yes. Everything we supply is measured, levelled and hung by the studio. We treat hanging as part of the work, not an afterthought.",
  },
  {
    question: "Which areas do you cover?",
    answer:
      "Nairobi and the surrounding counties. Work further afield is possible — tell us where you are and we'll let you know.",
  },
  {
    question: "How long does a project take?",
    answer:
      "A single-room styling is usually complete within two to three weeks of confirming the brief. Custom framing and larger installations take longer; we confirm timing in writing before starting.",
  },
  {
    question: "Can you work with art we already own?",
    answer:
      "Often that is the best starting point. We re-frame, re-compose and re-hang existing pieces, and only add what the room genuinely asks for.",
  },
];

export const PROJECTS = [
  { file: "mirror-stairway-grid.jpg", title: "Six-panel mirror cluster", caption: "Composed against a botanical wall on a duplex landing.", category: "mirror", room: "stairway", featured: true, alt: "Six panel framed mirror grid styled on a duplex stairway landing beside a botanical art panel" },
  { file: "art-corridor-triptych.jpg", title: "Earth-tone triptych", caption: "Three framed pieces drawing the eye toward the dining room.", category: "art", room: "corridor", featured: true, alt: "Three framed earth tone abstract panels along a corridor leading to a styled dining room" },
  { file: "portrait-stairway-tree-and-family.jpg", title: "Family wall, stairway", caption: "An acacia landscape paired with a soft grid of family portraits.", category: "art", room: "stairway", featured: true, alt: "Black and white acacia tree photograph above a grid of framed family portraits on a stairway wall" },
  { file: "mirror-bedroom-arched-globes.jpg", title: "Arched dressing mirror", caption: "A tall arched mirror anchoring a floating oak console.", category: "mirror", room: "bedroom", featured: true, alt: "Tall arched black framed mirror above a floating oak dressing console in a styled bedroom" },
  { file: "decor-foyer-entryway.jpg", title: "Quiet entry foyer", caption: "An abstract piece and a sunburst mirror cluster framing the door.", category: "decor", room: "corridor", featured: true, alt: "Entry foyer with framed abstract painting and bronze sunflower mirror cluster around a wooden door" },
  { file: "mirror-dining-bronze-sunflowers.jpg", title: "Bronze sunflower cluster", caption: "Five round sunflower mirrors composed as a single quiet medallion.", category: "mirror", room: "dining", featured: true, alt: "Five bronze sunflower mirrors arranged in a cross composition above a styled console" },

  { file: "mirror-corridor-six-panel.jpg", title: "Corridor mirror wall", caption: "A six-panel grid drawing daylight along the hallway.", category: "mirror", room: "corridor", alt: "Six panel framed mirror wall along a soft white corridor with warm wood reflections" },
  { file: "mirror-kitchen-tall.jpg", title: "Kitchen partition mirror", caption: "A floor-standing mirror reflecting the working heart of the home.", category: "mirror", room: "kitchen", alt: "Tall full length black framed mirror set on a partition wall reflecting a sage kitchen" },
  { file: "mirror-lounge-nine-panel.jpg", title: "Nine-panel mirror grid", caption: "Squared mirrors composed as a single architectural surface.", category: "mirror", room: "lounge", alt: "Nine panel framed mirror grid composed as a single architectural wall in a bright lounge" },
  { file: "mirror-bedroom-arched-console.jpg", title: "Arched bedroom mirror", caption: "A bedroom dressing area built around a single arch.", category: "mirror", room: "bedroom", alt: "Arched mirror above a floating oak console with brass lamp in a soft styled bedroom" },
  { file: "mirror-dining-six-panel.jpg", title: "Dining room mirror grid", caption: "A six-panel installation above a cane sideboard.", category: "mirror", room: "dining", alt: "Six panel mirror grid above a cane and oak sideboard in a daylit dining room" },
  { file: "mirror-corridor-grand-square.jpg", title: "Grand entry mirror", caption: "A large square mirror anchoring an oak console.", category: "mirror", room: "corridor", alt: "Large square gold framed mirror above a solid wood console in an open plan entry" },
  { file: "mirror-bedroom-round-slatted.jpg", title: "Round mirror, slatted wall", caption: "A circular mirror set into a backlit timber feature.", category: "mirror", room: "bedroom", alt: "Round mirror set into a backlit slatted timber feature wall above a floating bedroom console" },
  { file: "mirror-dining-round-oak.jpg", title: "Round oak dining mirror", caption: "A wooden circle softening the dining wall.", category: "mirror", room: "dining", alt: "Round oak framed mirror above a dining table with terracotta velvet chairs" },
  { file: "mirror-lounge-triple-vertical.jpg", title: "Triple vertical mirrors", caption: "Three slender mirrors above a long charcoal sideboard.", category: "mirror", room: "lounge", alt: "Three vertical mirrors above a long charcoal sideboard beside a deep blue textured panel" },
  { file: "mirror-corridor-organic.jpg", title: "Organic-form mirror", caption: "A sculpted dark wood mirror against textured stone.", category: "mirror", room: "corridor", alt: "Tall organic shaped dark wood mirror against a textured grey stone wall" },
  { file: "mirror-washroom-black-frame.jpg", title: "Washroom mirror", caption: "A clean black-framed mirror above subway tile.", category: "mirror", room: "washroom", alt: "Black framed rectangular mirror above white subway tile and a corner basin" },

  { file: "art-bedroom-abstract-triptych.jpg", title: "Bedroom triptych", caption: "Three abstract panels above a tufted velvet headboard.", category: "art", room: "bedroom", alt: "Three framed abstract art panels in soft browns above a navy tufted velvet headboard" },
  { file: "art-stairway-jazz-posters.jpg", title: "Stairway poster wall", caption: "A composed climb of music and graphic prints.", category: "art", room: "stairway", alt: "Three jazz themed framed posters climbing a stairway wall above a wooden staircase" },
  { file: "art-bedroom-landscape.jpg", title: "Bedroom landscape", caption: "A textured landscape framed above a mahogany bed.", category: "art", room: "bedroom", alt: "Framed textured abstract landscape painting above a dark mahogany bedframe with sage linens" },
  { file: "portrait-corridor-family-grid.jpg", title: "Family portrait grid", caption: "Six black and white portraits hung above a console.", category: "art", room: "corridor", alt: "Six black and white framed family portraits above a dark wood corridor console" },
  { file: "art-lounge-ginkgo.jpg", title: "Ginkgo statement piece", caption: "A large gilded ginkgo leaf canvas anchoring the lounge.", category: "art", room: "lounge", alt: "Large framed gold and teal ginkgo leaf painting on a lounge wall beside a sofa" },
  { file: "art-corridor-travel-grid.jpg", title: "Travel print grid", caption: "A measured grid of warm coastal photographs.", category: "art", room: "corridor", alt: "Six framed travel photographs of warm coastal architecture composed as a wall grid" },
  { file: "art-bedroom-feathers.jpg", title: "Feather triptych", caption: "Three framed feathers in copper and ink.", category: "art", room: "bedroom", alt: "Three framed feather illustrations in copper and ink above a styled hotel-like bedroom" },
  { file: "art-office-world-map.jpg", title: "Office world map", caption: "A watercolour world map sized for a working wall.", category: "art", room: "office", alt: "Framed watercolour world map painting above an office desk and leather chair" },
  { file: "art-bedroom-horizon.jpg", title: "Soft horizon", caption: "A muted landscape above a carved bedhead.", category: "art", room: "bedroom", alt: "Soft muted horizon landscape painting framed above a carved bedhead with cane detail" },
  { file: "art-stairway-staggered.jpg", title: "Staggered stairway prints", caption: "Three prints stepped along the climb.", category: "art", room: "stairway", alt: "Three modern graphic prints staggered along a stairway wall above an arched mirror" },
  { file: "art-dining-circular-led.jpg", title: "Backlit circular piece", caption: "A circular gilded canvas held by linear light.", category: "art", room: "dining", alt: "Framed circular gold and black canvas centered between linear LED ceiling channels" },
  { file: "art-lounge-marbled-diptych.jpg", title: "Marbled diptych", caption: "Two flowing canvases above a cream sofa.", category: "art", room: "lounge", alt: "Two large marbled diptych paintings in dark earth tones above a cream leather sofa" },
  { file: "art-stairway-gold-abstracts.jpg", title: "Gold-line abstracts", caption: "A pair of sculptural canvases above a turning stair.", category: "art", room: "stairway", alt: "Two large gold lined abstract paintings on either side of a stairwell wall" },
  { file: "portrait-lounge-bar-sports.jpg", title: "Bar portraits", caption: "Two figure portraits flanking a home bar.", category: "art", room: "lounge", alt: "Two framed sports figure portraits on either side of a home bar with leather stools" },
  { file: "art-washroom-typography.jpg", title: "Washroom typography", caption: "A clean framed type piece set against stone tile.", category: "art", room: "washroom", alt: "Framed black on white typography print above a stone tiled washroom basin" },
  { file: "art-dining-floral-frames.jpg", title: "Floral diptych & frames", caption: "A soft floral pair held together by empty frames.", category: "art", room: "dining", alt: "Soft floral diptych paired with two small empty frames over a dining wall" },

  { file: "decor-lounge-botanicals.jpg", title: "Botanical lounge", caption: "Layered botanical canvases beside a tufted linen sofa.", category: "decor", room: "lounge", alt: "Layered botanical canvases beside a tufted linen sofa under glass pendant lights" },
  { file: "decor-dining-table.jpg", title: "Garden dining", caption: "A walnut dining table set against sheer linen drapes.", category: "decor", room: "dining", alt: "Walnut dining table with grey upholstered chairs styled against full height sheer linen drapes" },
  { file: "decor-lounge-gallery-wall.jpg", title: "Lounge gallery wall", caption: "A long wall of framed art behind carved chairs.", category: "decor", room: "lounge", alt: "Long lounge gallery wall of framed botanical and abstract art behind carved upholstered chairs" },
  { file: "decor-lounge-diptych.jpg", title: "Quiet sitting room", caption: "A linen sofa, soft chandelier and an inked diptych.", category: "decor", room: "lounge", alt: "Quiet sitting room with linen sofa, glass chandelier and a soft inked diptych painting" },
  { file: "decor-lounge-gold-chandelier.jpg", title: "Brass-lit lounge", caption: "A brass branched chandelier above a chesterfield sofa.", category: "decor", room: "lounge", alt: "Brass branched chandelier above tufted chesterfield sofas and a triptych of inked abstracts" },
  { file: "decor-dining-styled.jpg", title: "Round dining moment", caption: "A round table set with chopsticks, glass and blossom.", category: "decor", room: "dining", alt: "Round dining table styled with chopsticks, glassware and a tall vase of cherry blossom" },
  { file: "decor-lounge-gold-discs.jpg", title: "Gold disc gallery", caption: "A composed wall of gilded textured discs and small frames.", category: "decor", room: "lounge", alt: "Composed wall of large gold framed textured disc art interspersed with small ornate empty frames" },
  { file: "decor-lounge-gold-medallions.jpg", title: "Gold medallion wall", caption: "A second composition of gilded discs and lacework.", category: "decor", room: "lounge", alt: "Wall of gold framed medallion and lacework art arranged above a velvet sofa" },
].map((p, i) => ({ ...p, file: `portfolio/${p.file}`, sort_order: i }));
