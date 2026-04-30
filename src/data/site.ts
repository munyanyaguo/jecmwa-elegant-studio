import mirrorStairwayGrid from "@/assets/portfolio/mirror-stairway-grid.jpg";
import artCorridorTriptych from "@/assets/portfolio/art-corridor-triptych.jpg";
import mirrorCorridorSixPanel from "@/assets/portfolio/mirror-corridor-six-panel.jpg";
import mirrorKitchenTall from "@/assets/portfolio/mirror-kitchen-tall.jpg";
import artBedroomAbstractTriptych from "@/assets/portfolio/art-bedroom-abstract-triptych.jpg";
import mirrorLoungeNinePanel from "@/assets/portfolio/mirror-lounge-nine-panel.jpg";
import mirrorBedroomArchedGlobes from "@/assets/portfolio/mirror-bedroom-arched-globes.jpg";
import mirrorBedroomArchedConsole from "@/assets/portfolio/mirror-bedroom-arched-console.jpg";
import artStairwayJazzPosters from "@/assets/portfolio/art-stairway-jazz-posters.jpg";
import artBedroomLandscape from "@/assets/portfolio/art-bedroom-landscape.jpg";
import portraitCorridorFamilyGrid from "@/assets/portfolio/portrait-corridor-family-grid.jpg";
import mirrorDiningSixPanel from "@/assets/portfolio/mirror-dining-six-panel.jpg";
import mirrorCorridorGrandSquare from "@/assets/portfolio/mirror-corridor-grand-square.jpg";
import mirrorBedroomRoundSlatted from "@/assets/portfolio/mirror-bedroom-round-slatted.jpg";
import portraitStairwayTreeAndFamily from "@/assets/portfolio/portrait-stairway-tree-and-family.jpg";
import mirrorDiningRoundOak from "@/assets/portfolio/mirror-dining-round-oak.jpg";
import decorLoungeBotanicals from "@/assets/portfolio/decor-lounge-botanicals.jpg";
import artLoungeGinkgo from "@/assets/portfolio/art-lounge-ginkgo.jpg";
import artCorridorTravelGrid from "@/assets/portfolio/art-corridor-travel-grid.jpg";
import mirrorLoungeTripleVertical from "@/assets/portfolio/mirror-lounge-triple-vertical.jpg";
import artBedroomFeathers from "@/assets/portfolio/art-bedroom-feathers.jpg";
import decorDiningTable from "@/assets/portfolio/decor-dining-table.jpg";
import decorLoungeGalleryWall from "@/assets/portfolio/decor-lounge-gallery-wall.jpg";
import artOfficeWorldMap from "@/assets/portfolio/art-office-world-map.jpg";
import artBedroomHorizon from "@/assets/portfolio/art-bedroom-horizon.jpg";
import artStairwayStaggered from "@/assets/portfolio/art-stairway-staggered.jpg";
import decorLoungeDiptych from "@/assets/portfolio/decor-lounge-diptych.jpg";
import decorLoungeGoldChandelier from "@/assets/portfolio/decor-lounge-gold-chandelier.jpg";
import artDiningCircularLed from "@/assets/portfolio/art-dining-circular-led.jpg";
import artLoungeMarbledDiptych from "@/assets/portfolio/art-lounge-marbled-diptych.jpg";
import artStairwayGoldAbstracts from "@/assets/portfolio/art-stairway-gold-abstracts.jpg";
import portraitLoungeBarSports from "@/assets/portfolio/portrait-lounge-bar-sports.jpg";
import artWashroomTypography from "@/assets/portfolio/art-washroom-typography.jpg";
import framesSamplesBoard from "@/assets/portfolio/frames-samples-board.jpg";
import decorDiningStyled from "@/assets/portfolio/decor-dining-styled.jpg";
import mirrorDiningBronzeSunflowers from "@/assets/portfolio/mirror-dining-bronze-sunflowers.jpg";
import decorLoungeGoldDiscs from "@/assets/portfolio/decor-lounge-gold-discs.jpg";
import decorLoungeGoldMedallions from "@/assets/portfolio/decor-lounge-gold-medallions.jpg";
import artDiningFloralFrames from "@/assets/portfolio/art-dining-floral-frames.jpg";
import decorFoyerEntryway from "@/assets/portfolio/decor-foyer-entryway.jpg";
import mirrorCorridorOrganic from "@/assets/portfolio/mirror-corridor-organic.jpg";
import framesWhiteOakDetail from "@/assets/portfolio/frames-white-oak-detail.jpg";
import framesMahoganyDetail from "@/assets/portfolio/frames-mahogany-detail.jpg";
import mirrorWashroomBlackFrame from "@/assets/portfolio/mirror-washroom-black-frame.jpg";

export const NAV = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export const HERO_IMAGE = mirrorStairwayGrid;
export const ABOUT_IMAGE = decorFoyerEntryway;

export type PrimaryCategory = "art" | "mirror" | "decor";
export type Room =
  | "terrace"
  | "lounge"
  | "corridor"
  | "washroom"
  | "bedroom"
  | "office"
  | "study"
  | "stairway"
  | "kitchen"
  | "dining";

export const CATEGORY_LABEL: Record<PrimaryCategory, string> = {
  art: "Art Pieces & Portraits",
  mirror: "Mirrors",
  decor: "Furniture & Decor Styling",
};

export const ROOM_LABEL: Record<Room, string> = {
  terrace: "Terrace",
  lounge: "Lounge",
  corridor: "Corridor",
  washroom: "Washroom",
  bedroom: "Bedroom",
  office: "Office",
  study: "Study",
  stairway: "Duplex Stairway",
  kitchen: "Kitchen",
  dining: "Dining",
};

export type PortfolioItem = {
  id: string;
  image: string;
  title: string;
  caption: string;
  primary: PrimaryCategory;
  room: Room;
  alt: string;
  featured?: boolean;
};

export const PORTFOLIO: PortfolioItem[] = [
  {
    id: "p01",
    image: mirrorStairwayGrid,
    title: "Six-panel mirror cluster",
    caption: "Composed against a botanical wall on a duplex landing.",
    primary: "mirror",
    room: "stairway",
    alt: "Six panel framed mirror grid styled on a duplex stairway landing beside a botanical art panel",
    featured: true,
  },
  {
    id: "p02",
    image: artCorridorTriptych,
    title: "Earth-tone triptych",
    caption: "Three framed pieces drawing the eye toward the dining room.",
    primary: "art",
    room: "corridor",
    alt: "Three framed earth tone abstract panels along a corridor leading to a styled dining room",
    featured: true,
  },
  {
    id: "p03",
    image: portraitStairwayTreeAndFamily,
    title: "Family wall, stairway",
    caption: "An acacia landscape paired with a soft grid of family portraits.",
    primary: "art",
    room: "stairway",
    alt: "Black and white acacia tree photograph above a grid of framed family portraits on a stairway wall",
    featured: true,
  },
  {
    id: "p04",
    image: mirrorBedroomArchedGlobes,
    title: "Arched dressing mirror",
    caption: "A tall arched mirror anchoring a floating oak console.",
    primary: "mirror",
    room: "bedroom",
    alt: "Tall arched black framed mirror above a floating oak dressing console in a styled bedroom",
    featured: true,
  },
  {
    id: "p05",
    image: decorFoyerEntryway,
    title: "Quiet entry foyer",
    caption: "An abstract piece and a sunburst mirror cluster framing the door.",
    primary: "decor",
    room: "corridor",
    alt: "Entry foyer with framed abstract painting and bronze sunflower mirror cluster around a wooden door",
    featured: true,
  },
  {
    id: "p06",
    image: mirrorDiningBronzeSunflowers,
    title: "Bronze sunflower cluster",
    caption: "Five round sunflower mirrors composed as a single quiet medallion.",
    primary: "mirror",
    room: "dining",
    alt: "Five bronze sunflower mirrors arranged in a cross composition above a styled console",
    featured: true,
  },

  // Mirrors
  {
    id: "p07",
    image: mirrorCorridorSixPanel,
    title: "Corridor mirror wall",
    caption: "A six-panel grid drawing daylight along the hallway.",
    primary: "mirror",
    room: "corridor",
    alt: "Six panel framed mirror wall along a soft white corridor with warm wood reflections",
  },
  {
    id: "p08",
    image: mirrorKitchenTall,
    title: "Kitchen partition mirror",
    caption: "A floor-standing mirror reflecting the working heart of the home.",
    primary: "mirror",
    room: "kitchen",
    alt: "Tall full length black framed mirror set on a partition wall reflecting a sage kitchen",
  },
  {
    id: "p09",
    image: mirrorLoungeNinePanel,
    title: "Nine-panel mirror grid",
    caption: "Squared mirrors composed as a single architectural surface.",
    primary: "mirror",
    room: "lounge",
    alt: "Nine panel framed mirror grid composed as a single architectural wall in a bright lounge",
  },
  {
    id: "p10",
    image: mirrorBedroomArchedConsole,
    title: "Arched bedroom mirror",
    caption: "A bedroom dressing area built around a single arch.",
    primary: "mirror",
    room: "bedroom",
    alt: "Arched mirror above a floating oak console with brass lamp in a soft styled bedroom",
  },
  {
    id: "p11",
    image: mirrorDiningSixPanel,
    title: "Dining room mirror grid",
    caption: "A six-panel installation above a cane sideboard.",
    primary: "mirror",
    room: "dining",
    alt: "Six panel mirror grid above a cane and oak sideboard in a daylit dining room",
  },
  {
    id: "p12",
    image: mirrorCorridorGrandSquare,
    title: "Grand entry mirror",
    caption: "A large square mirror anchoring an oak console.",
    primary: "mirror",
    room: "corridor",
    alt: "Large square gold framed mirror above a solid wood console in an open plan entry",
  },
  {
    id: "p13",
    image: mirrorBedroomRoundSlatted,
    title: "Round mirror, slatted wall",
    caption: "A circular mirror set into a backlit timber feature.",
    primary: "mirror",
    room: "bedroom",
    alt: "Round mirror set into a backlit slatted timber feature wall above a floating bedroom console",
  },
  {
    id: "p14",
    image: mirrorDiningRoundOak,
    title: "Round oak dining mirror",
    caption: "A wooden circle softening the dining wall.",
    primary: "mirror",
    room: "dining",
    alt: "Round oak framed mirror above a dining table with terracotta velvet chairs",
  },
  {
    id: "p15",
    image: mirrorLoungeTripleVertical,
    title: "Triple vertical mirrors",
    caption: "Three slender mirrors above a long charcoal sideboard.",
    primary: "mirror",
    room: "lounge",
    alt: "Three vertical mirrors above a long charcoal sideboard beside a deep blue textured panel",
  },
  {
    id: "p16",
    image: mirrorCorridorOrganic,
    title: "Organic-form mirror",
    caption: "A sculpted dark wood mirror against textured stone.",
    primary: "mirror",
    room: "corridor",
    alt: "Tall organic shaped dark wood mirror against a textured grey stone wall",
  },
  {
    id: "p17",
    image: mirrorWashroomBlackFrame,
    title: "Washroom mirror",
    caption: "A clean black-framed mirror above subway tile.",
    primary: "mirror",
    room: "washroom",
    alt: "Black framed rectangular mirror above white subway tile and a corner basin",
  },

  // Art pieces & portraits
  {
    id: "p18",
    image: artBedroomAbstractTriptych,
    title: "Bedroom triptych",
    caption: "Three abstract panels above a tufted velvet headboard.",
    primary: "art",
    room: "bedroom",
    alt: "Three framed abstract art panels in soft browns above a navy tufted velvet headboard",
  },
  {
    id: "p19",
    image: artStairwayJazzPosters,
    title: "Stairway poster wall",
    caption: "A composed climb of music and graphic prints.",
    primary: "art",
    room: "stairway",
    alt: "Three jazz themed framed posters climbing a stairway wall above a wooden staircase",
  },
  {
    id: "p20",
    image: artBedroomLandscape,
    title: "Bedroom landscape",
    caption: "A textured landscape framed above a mahogany bed.",
    primary: "art",
    room: "bedroom",
    alt: "Framed textured abstract landscape painting above a dark mahogany bedframe with sage linens",
  },
  {
    id: "p21",
    image: portraitCorridorFamilyGrid,
    title: "Family portrait grid",
    caption: "Six black and white portraits hung above a console.",
    primary: "art",
    room: "corridor",
    alt: "Six black and white framed family portraits above a dark wood corridor console",
  },
  {
    id: "p22",
    image: artLoungeGinkgo,
    title: "Ginkgo statement piece",
    caption: "A large gilded ginkgo leaf canvas anchoring the lounge.",
    primary: "art",
    room: "lounge",
    alt: "Large framed gold and teal ginkgo leaf painting on a lounge wall beside a sofa",
  },
  {
    id: "p23",
    image: artCorridorTravelGrid,
    title: "Travel print grid",
    caption: "A measured grid of warm coastal photographs.",
    primary: "art",
    room: "corridor",
    alt: "Six framed travel photographs of warm coastal architecture composed as a wall grid",
  },
  {
    id: "p24",
    image: artBedroomFeathers,
    title: "Feather triptych",
    caption: "Three framed feathers in copper and ink.",
    primary: "art",
    room: "bedroom",
    alt: "Three framed feather illustrations in copper and ink above a styled hotel-like bedroom",
  },
  {
    id: "p25",
    image: artOfficeWorldMap,
    title: "Office world map",
    caption: "A watercolour world map sized for a working wall.",
    primary: "art",
    room: "office",
    alt: "Framed watercolour world map painting above an office desk and leather chair",
  },
  {
    id: "p26",
    image: artBedroomHorizon,
    title: "Soft horizon",
    caption: "A muted landscape above a carved bedhead.",
    primary: "art",
    room: "bedroom",
    alt: "Soft muted horizon landscape painting framed above a carved bedhead with cane detail",
  },
  {
    id: "p27",
    image: artStairwayStaggered,
    title: "Staggered stairway prints",
    caption: "Three prints stepped along the climb.",
    primary: "art",
    room: "stairway",
    alt: "Three modern graphic prints staggered along a stairway wall above an arched mirror",
  },
  {
    id: "p28",
    image: artDiningCircularLed,
    title: "Backlit circular piece",
    caption: "A circular gilded canvas held by linear light.",
    primary: "art",
    room: "dining",
    alt: "Framed circular gold and black canvas centered between linear LED ceiling channels",
  },
  {
    id: "p29",
    image: artLoungeMarbledDiptych,
    title: "Marbled diptych",
    caption: "Two flowing canvases above a cream sofa.",
    primary: "art",
    room: "lounge",
    alt: "Two large marbled diptych paintings in dark earth tones above a cream leather sofa",
  },
  {
    id: "p30",
    image: artStairwayGoldAbstracts,
    title: "Gold-line abstracts",
    caption: "A pair of sculptural canvases above a turning stair.",
    primary: "art",
    room: "stairway",
    alt: "Two large gold lined abstract paintings on either side of a stairwell wall",
  },
  {
    id: "p31",
    image: portraitLoungeBarSports,
    title: "Bar portraits",
    caption: "Two figure portraits flanking a home bar.",
    primary: "art",
    room: "lounge",
    alt: "Two framed sports figure portraits on either side of a home bar with leather stools",
  },
  {
    id: "p32",
    image: artWashroomTypography,
    title: "Washroom typography",
    caption: "A clean framed type piece set against stone tile.",
    primary: "art",
    room: "washroom",
    alt: "Framed black on white typography print above a stone tiled washroom basin",
  },
  {
    id: "p33",
    image: artDiningFloralFrames,
    title: "Floral diptych & frames",
    caption: "A soft floral pair held together by empty frames.",
    primary: "art",
    room: "dining",
    alt: "Soft floral diptych paired with two small empty frames over a dining wall",
  },

  // Furniture & decor styling
  {
    id: "p34",
    image: decorLoungeBotanicals,
    title: "Botanical lounge",
    caption: "Layered botanical canvases beside a tufted linen sofa.",
    primary: "decor",
    room: "lounge",
    alt: "Layered botanical canvases beside a tufted linen sofa under glass pendant lights",
  },
  {
    id: "p35",
    image: decorDiningTable,
    title: "Garden dining",
    caption: "A walnut dining table set against sheer linen drapes.",
    primary: "decor",
    room: "dining",
    alt: "Walnut dining table with grey upholstered chairs styled against full height sheer linen drapes",
  },
  {
    id: "p36",
    image: decorLoungeGalleryWall,
    title: "Lounge gallery wall",
    caption: "A long wall of framed art behind carved chairs.",
    primary: "decor",
    room: "lounge",
    alt: "Long lounge gallery wall of framed botanical and abstract art behind carved upholstered chairs",
  },
  {
    id: "p37",
    image: decorLoungeDiptych,
    title: "Quiet sitting room",
    caption: "A linen sofa, soft chandelier and an inked diptych.",
    primary: "decor",
    room: "lounge",
    alt: "Quiet sitting room with linen sofa, glass chandelier and a soft inked diptych painting",
  },
  {
    id: "p38",
    image: decorLoungeGoldChandelier,
    title: "Brass-lit lounge",
    caption: "A brass branched chandelier above a chesterfield sofa.",
    primary: "decor",
    room: "lounge",
    alt: "Brass branched chandelier above tufted chesterfield sofas and a triptych of inked abstracts",
  },
  {
    id: "p39",
    image: decorDiningStyled,
    title: "Round dining moment",
    caption: "A round table set with chopsticks, glass and blossom.",
    primary: "decor",
    room: "dining",
    alt: "Round dining table styled with chopsticks, glassware and a tall vase of cherry blossom",
  },
  {
    id: "p40",
    image: decorLoungeGoldDiscs,
    title: "Gold disc gallery",
    caption: "A composed wall of gilded textured discs and small frames.",
    primary: "decor",
    room: "lounge",
    alt: "Composed wall of large gold framed textured disc art interspersed with small ornate empty frames",
  },
  {
    id: "p41",
    image: decorLoungeGoldMedallions,
    title: "Gold medallion wall",
    caption: "A second composition of gilded discs and lacework.",
    primary: "decor",
    room: "lounge",
    alt: "Wall of gold framed medallion and lacework art arranged above a velvet sofa",
  },
];

export const FEATURED_PORTFOLIO = PORTFOLIO.filter((p) => p.featured);

export type Service = {
  n: string;
  title: string;
  body: string;
};

export const SERVICES: Service[] = [
  {
    n: "01",
    title: "Interior Styling",
    body: "Room by room styling for finished homes — proportion, palette, and the placement of every chosen piece. We work until each space reads as a single, considered composition.",
  },
  {
    n: "02",
    title: "Mirrors",
    body: "Framed mirrors composed as wall installations or singular statements. From clustered grids to standing arches, each piece is sized to the room and chosen for the way it draws light.",
  },
  {
    n: "03",
    title: "Portraits & Art Pieces",
    body: "Custom portraits and art pieces selected, framed and hung in compositions that feel collected. Family portraits, landscapes, abstracts and typography — sized to the wall, framed for the home.",
  },
  {
    n: "04",
    title: "Curated Decor",
    body: "Quiet sourcing of objects, vases, lighting and textiles — chosen to settle into the home rather than sit on top of it.",
  },
  {
    n: "05",
    title: "Framed Wall Styling",
    body: "Gallery walls, paired pieces and grouped installations — measured, levelled and hung as a single composition. From staircases to corridors and bedheads.",
  },
  {
    n: "06",
    title: "Room-Focused Decor Placement",
    body: "Focused styling for one room at a time — a lounge, a bedroom, a dining area, a washroom — taking what is already loved and adding only what the room asks for.",
  },
];

export const ART_SIZES = [
  "60 × 40 cm",
  "90 × 60 cm",
  "120 × 80 cm",
  "150 × 100 cm",
  "200 × 120 cm",
  "A4",
];

export const MIRROR_SIZES = [
  "50 × 50 cm",
  "60 × 40 cm",
  "60 × 60 cm",
  "100 × 100 cm",
  "100 cm diameter",
  "180 × 90 cm",
  "200 × 100 cm",
];

import framesLaminateBoard from "@/assets/frames-board.jpeg";

export const FRAME_FINISHES = [
  {
    name: "Laminate Frame Library",
    note: "A working selection of laminate frame profiles in our studio — warm woods, deep blacks, soft whites, gilded golds and brushed silvers. Each profile is referenced by number; we pair the right finish to the piece, the wall and the room.",
    image: framesLaminateBoard,
  },
  {
    name: "Warm Oak Laminate",
    note: "A warm, light-grained laminate frame profile — soft, natural and quietly Scandinavian. Pairs gently with botanical art, family portraits and bright, daylit rooms.",
    image: framesWhiteOakDetail,
  },
  {
    name: "Deep Mahogany Laminate",
    note: "A rich, deep-toned laminate frame profile with the gravity of traditional mahogany. Anchors classical portraits, landscapes and formal lounges, dining rooms and studies.",
    image: framesMahoganyDetail,
  },
];

export const FRAMES_BOARD_IMAGE = framesLaminateBoard;

export const TESTIMONIALS = [
  {
    quote:
      "JECMWA shaped our home with a calm, careful hand. The mirrors and portraits feel like they were always meant to live there.",
    name: "Wanjiku M.",
    label: "Family residence, Nairobi",
  },
  {
    quote:
      "They listened first. The stairway gallery they styled for us is the part of the house guests linger in the longest.",
    name: "David & Mercy K.",
    label: "Duplex home, Nairobi",
  },
  {
    quote:
      "Working with the studio felt unhurried. Every framed piece, every mirror, every placement — chosen with intention.",
    name: "Joan A.",
    label: "Apartment styling",
  },
];

export const CONTACT = {
  whatsapp: "https://wa.me/254711722331",
  phone: "tel:+254711722331",
  email: "mailto:jecmwa03@gmail.com",
  phoneDisplay: "0711 722 331",
  emailDisplay: "jecmwa03@gmail.com",
  hours: "By appointment — Monday to Saturday",
  location: "Studio visits by request — Nairobi, Kenya",
};

export const STATS = [
  { k: "4", v: "Years styling" },
  { k: "49", v: "Homes shaped" },
  { k: "49", v: "Projects" },
];
