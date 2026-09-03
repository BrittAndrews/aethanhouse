
const BASE = [
  { id: "consult", label: "Initial Consultation", note: "30-minute video call, credited back once you book a tier.", price: [150, 150] },
  { id: "direction", label: "Design Direction Session", note: "On-site visit, written Home Style Guide, handoff call.", price: [500, 500] },
];
const TIERS = [
  { id: "t1", name: "Tier 1 · Style Direction", blurb: "Just needs some style direction and I will handle the rest.", price: [1200, 1800] },
  { id: "t2", name: "Tier 2 · Specified Selections", blurb: "Specify it for me — real products, backups, a shoppable list.", price: [1800, 2800] },
  { id: "t3", name: "Tier 3 · Design Development", blurb: "Draw it — layouts, elevations, renovation details for the GC.", price: [2800, 6000] },
  { id: "tx", name: "Not sure yet", blurb: "Decide together on the call.", price: [1200, 6000] },
];
const ADDONS = [
  { id: "render", label: "3D rendering", price: [500, 1500] },
  { id: "visit", label: "Additional site visit", price: [250, 250] },
  { id: "revision", label: "Extra revision round", price: [250, 500] },
  { id: "reimagine", label: "Reimagining Day", price: [950, 950] },
  { id: "shopping", label: "Shopping day", price: [500, 1000] },
  { id: "checkin", label: "Virtual check-in", price: [200, 200] },
];
const ROOMS = ["Basement", "Dining room", "Entry or mudroom", "Family room", "Guest room", "Hall bath", "Kitchen", "Living room", "Nursery or kid's room", "Office", "Porch or exterior", "Powder room", "Primary bath", "Primary bedroom"];
const ARCH = [
  { name: "A-Frame", description: "Roof to the ground, glass gable, sleeping loft." },
  { name: "Arts + Crafts", description: "Handmade joinery, built-in cabinetry, leaded glass, honest materials." },
  { name: "Cape Cod", description: "Weathered shingles, steep roof, dormers — the northeast beach house." },
  { name: "Colonial Revival", description: "Shutters, a pedimented front door, dead-centered on a symmetrical face." },
  { name: "Contemporary", description: "Angled shed roofs, walls of glass, no historical quotes." },
  { name: "Craftsman", description: "Exposed rafters, tapered porch columns, bold trim colors, lantern lighting." },
  { name: "Dutch Colonial", description: "Gambrel barn roof, flared eaves, dormers down the long side." },
  { name: "Federal", description: "Flat brick front, fanlight over the door, delicate trim." },
  { name: "French Colonial", description: "Wraparound porch on piers, tall shutters, hipped roof." },
  { name: "Georgian", description: "Five bays, paired chimneys, brick laid dead symmetrical." },
  { name: "Gothic Revival", description: "Steep gables, pointed windows, gingerbread bargeboard." },
  { name: "Greek Revival", description: "White columns, full pediment, temple front on a lawn." },
  { name: "Italian Renaissance Revival", description: "Low tile roof, deep eaves, arched ground-floor windows." },
  { name: "Italianate", description: "Bracketed eaves, tall narrow arched windows, flat roofline." },
  { name: "Mansard", description: "Boxy roof with dormers punched through, slate or shingle." },
  { name: "Midcentury modern", description: "Low flat roofline, clerestory windows, post-and-beam, indoor-outdoor." },
  { name: "Mission", description: "Smooth stucco, curved parapet, red tile, arcaded porch." },
  { name: "National", description: "Plain gable-front folk house, no ornament, straight lines." },
  { name: "Neoclassical", description: "Two-story portico, giant columns, formal entry." },
  { name: "New build", description: "Built in the last decade — open plan, big windows, new everything." },
  { name: "New Traditional", description: "Nineties-on subdivision house quoting older styles at a bigger scale." },
  { name: "Postmodern", description: "Familiar shapes blown up — oversized gable, cutout arch, flat color." },
  { name: "Prairie", description: "Horizontal bands, low hipped roof, deep overhangs, ribbon windows." },
  { name: "Pueblo Revival", description: "Adobe walls, flat stepped roof, protruding vigas, rounded corners." },
  { name: "Queen Anne", description: "Turret, wraparound porch, spindlework, gables in every direction." },
  { name: "Ranch", description: "Long, low, one story, picture window, attached garage." },
  { name: "Second Empire", description: "Mansard roof, iron cresting, tall paired windows." },
  { name: "Spanish Colonial", description: "Thick white walls, low clay tile roof, deep shaded arcade." },
  { name: "Spanish Revival", description: "Stucco and red tile, arched entry, wrought iron, courtyard." },
  { name: "Transitional", description: "Traditional bones, modern finishes — black windows on an old shape." },
  { name: "Tudor", description: "Steep front gable, half-timbering, arched door, tall chimney." },
  { name: "Other", description: "Tell me what it is." },
];
const PERSONAL = [
  { name: "Boho", description: "Layered textiles, plants, collected rather than bought." },
  { name: "Coastal", description: "Pale wood, linen, light left alone." },
  { name: "Country cottage", description: "Small prints, painted wood, soft edges." },
  { name: "English country", description: "Antiques, pattern on pattern, deep color." },
  { name: "Industrial", description: "Steel, brick, structure left exposed." },
  { name: "Maximal", description: "More pattern, more color, more of everything." },
  { name: "Midcentury modern", description: "Walnut, tapered legs, low horizontal lines." },
  { name: "Minimal", description: "Few objects, quiet palette, nothing extra." },
  { name: "Modern farmhouse", description: "White walls, black windows, warm wood." },
  { name: "Traditional", description: "Symmetry, classic silhouettes, restrained color." },
  { name: "Other", description: "Describe it in your own words." },
];
const ICON_PATHS = {
  "A-Frame": ["M23 5 L8 29 H38 Z", "M17 29 V19 H29 V29", "M20 19 L23 14 L26 19", "M12 24 H16"],
  "Arts + Crafts": ["M5 17 L23 7 L41 17", "M9 17 V22 H37 V17", "M12 22 V29 H34 V22", "M16 25 H21 M25 25 H30", "M22 29 V24 H27 V29", "M31 12 V6 H35 V14"],
  "Midcentury modern": ["M4 15 H42", "M8 15 V19 H38 V15", "M8 19 V29 H38 V19", "M8 24 H38", "M14 29 V24 M26 29 V24", "M30 22 H35"],
  "New build": ["M6 16 L18 7 L30 16", "M8 16 V29 H30 V16", "M30 13 H42 V29 H30", "M12 21 H18 V29 H12 Z", "M33 18 H39 V24 H33 Z", "M22 21 H26"],
  "Cape Cod": ["M8 18 L23 7 L38 18", "M10 18 V29 H36 V18", "M15 15 L18 12 L21 15 V18", "M25 15 L28 12 L31 15 V18", "M21 29 V22 H26 V29"],
  "Colonial Revival": ["M7 15 L23 6 L39 15", "M10 15 V29 H36 V15", "M20 29 V21 H26 V29", "M19 21 H27", "M13 20 H16 M31 20 H34"],
  "Contemporary": ["M6 20 L26 10 L26 29", "M6 20 V29 H26", "M26 14 H40 V29 H26", "M30 18 H36 V24 H30 Z", "M11 29 V22 H17 V29"],
  "Craftsman": ["M4 18 L23 8 L42 18", "M8 18 V22 H38 V18", "M11 22 V29 H35 V22", "M14 29 V23 M32 29 V23", "M20 29 V23 H26 V29", "M6 18 L4 20 M40 18 L42 20"],
  "Dutch Colonial": ["M6 20 L12 12 L23 7 L34 12 L40 20", "M9 20 V29 H37 V20", "M20 29 V22 H26 V29", "M14 17 H18 M28 17 H32"],
  "Federal": ["M9 14 H37 V29 H9 Z", "M9 14 L23 7 L37 14", "M20 29 V20 H26 V29", "M20 20 A3 3 0 0 1 26 20", "M14 19 H17 M29 19 H32"],
  "French Colonial": ["M7 14 L23 6 L39 14", "M5 29 V17 H41 V29", "M10 29 V17 M18 29 V17 M28 29 V17 M36 29 V17", "M21 29 V21 H25 V29"],
  "Georgian": ["M8 13 L23 6 L38 13", "M10 13 V29 H36 V13", "M21 29 V21 H26 V29", "M14 17 H17 M30 17 H33 M14 23 H17 M30 23 H33", "M14 9 V5 M32 9 V5"],
  "Gothic Revival": ["M8 18 L15 8 L22 18", "M11 18 V29 H37 V18 L30 9 L23 18", "M13 29 V22 A3 3 0 0 1 19 22 V29", "M28 22 V17 A2 2 0 0 1 32 17 V22 Z"],
  "Greek Revival": ["M6 14 L23 5 L40 14", "M9 14 H37", "M12 14 V29 M19 14 V29 M27 14 V29 M34 14 V29", "M9 29 H37", "M22 29 V22 H26 V29"],
  "Italian Renaissance Revival": ["M6 15 L23 8 L40 15", "M4 15 H42", "M9 15 V29 H37 V15", "M13 22 V19 A2 2 0 0 1 17 19 V22", "M29 22 V19 A2 2 0 0 1 33 19 V22", "M21 29 V20 H26 V29"],
  "Italianate": ["M7 13 H39", "M9 13 V29 H37 V13", "M7 13 L9 10 H37 L39 13", "M14 18 V24 A2 2 0 0 0 18 24 V18 A2 2 0 0 0 14 18", "M28 18 V24 A2 2 0 0 0 32 24 V18 A2 2 0 0 0 28 18", "M21 29 V21 H26 V29"],
  "Mansard": ["M9 17 L13 10 H33 L37 17", "M11 17 V29 H35 V17", "M17 14 V10 M29 14 V10", "M21 29 V22 H26 V29", "M14 21 H17 M30 21 H33"],
  "Mission": ["M9 14 H37 V29 H9 Z", "M9 14 A5 5 0 0 1 15 14 A5 5 0 0 1 23 14 A5 5 0 0 1 31 14 A5 5 0 0 1 37 14", "M20 29 V21 A3 3 0 0 1 26 21 V29", "M13 20 H16 M30 20 H33"],
  "National": ["M13 14 L23 6 L33 14", "M15 14 V29 H31 V14", "M21 29 V22 H26 V29", "M18 18 H21 M27 18 H29"],
  "Neoclassical": ["M8 12 L23 4 L38 12", "M11 12 H35", "M14 12 V29 M20 12 V29 M26 12 V29 M32 12 V29", "M8 29 H38", "M22 29 V22 H26 V29"],
  "New Traditional": ["M5 18 L15 9 L25 18", "M8 18 V29 H25", "M25 14 L34 7 L43 14", "M27 14 V29 H41 V14", "M12 29 V22 H18 V29", "M31 22 H37 V29 H31 Z"],
  "Postmodern": ["M8 17 L23 7 L38 17", "M10 17 V29 H36 V17", "M18 29 V22 A5 5 0 0 1 28 22 V29", "M23 7 V4", "M13 21 H16 M30 21 H33"],
  "Prairie": ["M4 14 H42", "M8 14 V21 H38 V14", "M6 21 H40", "M11 21 V29 H35 V21", "M15 25 H21 M27 25 H31", "M21 29 V24 H26 V29"],
  "Pueblo Revival": ["M8 17 H26 V29 H8 Z", "M26 12 H38 V29 H26", "M10 17 V14 H24 V17", "M13 29 V22 H19 V29", "M29 20 H35", "M9 20 H11 M21 20 H23"],
  "Queen Anne": ["M7 19 L14 8 L21 19", "M10 19 V29 H38 V19", "M28 19 V13 A4 4 0 0 1 36 13 V19", "M32 13 V9", "M13 29 V22 A3 3 0 0 1 19 22 V29", "M23 22 H27"],
  "Ranch": ["M4 16 L11 9 H29 L36 16", "M6 16 V29 H30 V16", "M30 19 H44 V29 H30", "M11 22 H17 M22 22 H26", "M34 29 V22 H40 V29"],
  "Second Empire": ["M8 16 L12 8 H34 L38 16", "M10 16 V29 H36 V16", "M15 12 V9 M31 12 V9", "M21 29 V21 H26 V29", "M14 20 H17 M30 20 H33", "M23 8 V5"],
  "Spanish Colonial": ["M5 15 H41", "M7 15 V29 H39 V15", "M12 29 V21 A3 3 0 0 1 18 21 V29", "M24 22 H30 M24 26 H30", "M9 15 L11 11 H35 L37 15"],
  "Spanish Revival": ["M7 16 L23 7 L39 16", "M10 16 V29 H36 V16", "M5 16 H41", "M20 29 V22 A3 3 0 0 1 26 22 V29", "M14 21 H17 M30 21 H33", "M31 12 V8 H35 V13"],
  "Transitional": ["M6 19 L16 10 L26 19", "M9 19 V29 H26", "M26 12 H41 V29 H26", "M30 17 H37 V23 H30 Z", "M13 29 V22 H19 V29"],
  "Tudor": ["M6 18 L16 5 L26 18", "M9 18 V29 H39 V18 L31 9 L24 18", "M16 9 V18 M12 13 L20 13", "M13 29 V22 A3 3 0 0 1 19 22 V29", "M29 21 H35 M32 19 V25"],
  "Boho": ["M19 29 H29 L31 20 H17 Z", "M24 20 C24 14 20 11 16 10 C17 15 20 18 24 20", "M24 20 C24 13 28 10 33 9 C32 15 28 18 24 20", "M24 20 V15"],
  "Coastal": ["M8 26 C12 23 15 29 19 26 C23 23 26 29 30 26 C34 23 37 29 40 26", "M33 12 A5 5 0 1 1 33 11", "M12 20 L18 13 L24 20", "M6 20 H26"],
  "Country cottage": ["M14 16 H30 V24 A4 4 0 0 1 26 28 H18 A4 4 0 0 1 14 24 Z", "M30 18 A4 4 0 0 1 30 24", "M18 16 V13 A4 4 0 0 1 26 13 V16", "M20 8 V11 M26 8 V11"],
  "English country": ["M15 29 V16 A6 6 0 0 1 31 16 V29", "M15 22 H31", "M18 29 V26 M28 29 V26", "M15 18 H12 M31 18 H34"],
  "Industrial": ["M23 5 V11", "M13 20 L23 11 L33 20 Z", "M20 20 V24 A3 3 0 0 0 26 24 V20", "M18 27 H28"],
  "Maximal": ["M9 9 H21 V19 H9 Z", "M25 9 H37 V19 H25 Z", "M9 22 H21 V30 H9 Z", "M25 22 H37 V30 H25 Z", "M13 13 L17 15 M29 25 L33 27"],
  "Midcentury modern": ["M13 20 H31 V25 H13 Z", "M15 20 V12 A2 2 0 0 1 29 12 V20", "M14 25 L11 30 M30 25 L33 30", "M31 20 L34 22"],
  "Minimal": ["M20 29 H28 V19 A4 4 0 0 0 20 19 Z", "M24 19 V12", "M24 12 C21 11 20 8 22 6", "M8 29 H38"],
  "Modern farmhouse": ["M11 14 H35 V29 H11 Z", "M23 14 V29 M11 21 H35", "M11 14 L23 6 L35 14", "M38 15 A3 3 0 0 1 44 15", "M41 15 V12"],
  "Traditional": ["M15 12 L31 12 L34 20 H12 Z", "M23 20 V26", "M17 29 H29", "M20 26 H26 V29"],
  "Basement": ["M6 12 H40 V29 H6 Z", "M12 29 V25 H18 V21 H24 V17 H30 V29", "M6 12 L23 6 L40 12", "M34 20 H37"],
  "Dining room": ["M11 20 H35", "M14 20 V29 M32 20 V29", "M8 26 V18 A3 3 0 0 1 14 18", "M38 26 V18 A3 3 0 0 1 32 18", "M23 20 V13", "M19 10 H27 L23 13 Z"],
  "Entry or mudroom": ["M14 8 H30 V29 H14 Z", "M26 19 H28", "M34 14 V17 M38 14 V17", "M32 20 H40 V29 H32 Z", "M8 29 H40"],
  "Family room": ["M8 26 V17 A3 3 0 0 1 14 17 V19", "M14 19 H32 V26", "M8 26 H38 V29", "M32 19 A3 3 0 0 1 38 19 V26", "M17 19 V26 M26 19 V26"],
  "Guest room": ["M10 27 V19 H30 V27", "M10 23 H30", "M13 19 V15 H21 V19", "M8 27 H34", "M34 15 V27"],
  "Hall bath": ["M9 17 H37 V22 A6 6 0 0 1 31 28 H15 A6 6 0 0 1 9 22 Z", "M13 17 V11 A3 3 0 0 1 19 11", "M19 11 H21", "M13 28 V30 M33 28 V30"],
  "Kitchen": ["M11 15 H35 V29 H11 Z", "M11 21 H35", "M15 18 H18 M22 18 H25 M29 18 H32", "M17 25 H29", "M14 11 H32", "M23 6 V11"],
  "Living room": ["M7 27 V18 A3 3 0 0 1 13 18 V20", "M13 20 H33 V27", "M7 27 H39 V30", "M33 20 A3 3 0 0 1 39 20 V27", "M16 20 V27 M25 20 V27"],
  "Nursery or kid's room": ["M11 28 V16 H35 V28", "M11 20 H35", "M15 20 V28 M19 20 V28 M23 20 V28 M27 20 V28 M31 20 V28", "M23 12 A3 3 0 0 1 29 12", "M26 12 V8"],
  "Office": ["M8 20 H38", "M11 20 V29 M35 20 V29", "M14 20 V14 H26 V20", "M31 20 V16 A3 3 0 0 1 37 16 V20", "M34 16 V13"],
  "Porch or exterior": ["M5 14 L23 5 L41 14", "M9 14 V29 M37 14 V29", "M9 22 H37", "M14 22 V29 M20 22 V29 M26 22 V29 M32 22 V29", "M5 29 H41"],
  "Powder room": ["M15 18 H31 V22 H15 Z", "M23 22 V29", "M18 29 H28", "M23 18 V14", "M20 14 H26", "M33 10 H41 V20 H33 Z"],
  "Primary bath": ["M10 18 H36 A4 4 0 0 1 32 28 H14 A4 4 0 0 1 10 18", "M14 28 V30 M32 28 V30", "M13 18 V13 A3 3 0 0 1 19 13", "M28 8 H38 V16 H28 Z", "M33 8 V16"],
  "Primary bedroom": ["M8 28 V18 H38 V28", "M8 23 H38", "M12 18 V13 H22 V18", "M24 18 V13 H34 V18", "M6 28 H40", "M6 24 V30 M40 24 V30"],
  "Other": ["M15 29 V14 A8 8 0 0 1 31 14 V29", "M19 29 V16 A4 4 0 0 1 27 16 V29", "M23 20 V24"],
};
const DEFAULT_ROOMS = ["Kitchen", "Primary bedroom", "Primary bath", "Living room", "Dining room"];

/* --- state ------------------------------------------------------------- */
var state = {
  projectName: "",
  arch: {}, archOther: "",
  personal: {}, personalOther: "",
  open: null,
  nextId: DEFAULT_ROOMS.length + 1,
  rows: DEFAULT_ROOMS.map(function (room, i) {
    return { id: i + 1, room: room, tier: null, addons: {}, notes: "", expanded: false };
  })
};

var redraw = function () {};
function setState(patch) { Object.assign(state, patch); redraw(); }
function setRow(i, patch) {
  state.rows = state.rows.map(function (r, j) { return j === i ? Object.assign({}, r, patch) : r; });
  redraw();
}

/* --- helpers (ported from the design's DCLogic component) --------------- */
function money(n) { return "$" + n.toLocaleString("en-US"); }
function range(p) { return p[0] === p[1] ? money(p[0]) : money(p[0]) + "\u2013" + p[1].toLocaleString("en-US"); }
function toggleMenu(key) { setState({ open: state.open === key ? null : key }); }

function icon(name, size) {
  var d = ICON_PATHS[name];
  if (!d) return "";
  var w = size || 46;
  return '<svg width="' + w + '" height="' + Math.round(w * 34 / 46) + '" viewBox="0 0 46 34" fill="none" ' +
    'stroke="currentColor" stroke-width="' + (size ? 1 : 1.3) + '" stroke-linecap="round" stroke-linejoin="round" ' +
    'aria-hidden="true" style="display:block;opacity:.9">' +
    d.map(function (p) { return '<path d="' + p + '"/>'; }).join("") + '</svg>';
}

function activeTiers() { return state.rows.filter(function (r) { return r.tier; }); }

function totals() {
  var lo = 0, hi = 0;
  BASE.forEach(function (b) { lo += b.price[0]; hi += b.price[1]; });
  state.rows.forEach(function (r) {
    if (!r.tier) return;
    var t = TIERS.find(function (x) { return x.id === r.tier; });
    if (t) { lo += t.price[0]; hi += t.price[1]; }
    ADDONS.forEach(function (a) { if (r.addons[a.id]) { lo += a.price[0]; hi += a.price[1]; } });
  });
  if (activeTiers().length) { lo -= 150; hi -= 150; }
  return [lo, hi];
}

function styleList() {
  var arch = ARCH.filter(function (a) { return state.arch[a.name] && a.name !== "Other"; })
                 .map(function (a) { return a.name; });
  if (state.arch["Other"] && state.archOther) arch.push(state.archOther);
  var personal = PERSONAL.filter(function (p) { return state.personal[p.name] && p.name !== "Other"; })
                         .map(function (p) { return p.name; });
  if (state.personal["Other"] && state.personalOther) personal.push(state.personalOther);
  return [arch, personal];
}

function jumpTo(i) {
  var el = document.getElementById("room-card-" + i);
  state.rows = state.rows.map(function (r, j) { return j === i ? Object.assign({}, r, { expanded: true }) : r; });
  setState({ open: null });
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: "smooth" });
}

function report() {
  var t2 = totals(), lo = t2[0], hi = t2[1];
  var sl = styleList(), arch = sl[0], personal = sl[1];
  var L = [];
  L.push("AETHAN HOUSE \u00b7 PROJECT BUILDER");
  L.push("Project: " + (state.projectName || "Untitled"));
  L.push("");
  L.push("Home style: " + (arch.join(", ") || "not stated"));
  L.push("Personal style: " + (personal.join(", ") || "not stated"));
  L.push("");
  L.push("Included in every project");
  BASE.forEach(function (b) { L.push("  " + b.label + " \u2014 " + money(b.price[0])); });
  L.push("");
  L.push("Rooms");
  state.rows.forEach(function (r) {
    var t = TIERS.find(function (x) { return x.id === r.tier; });
    L.push("  " + r.room + " \u2014 " + (t ? t.name + " (" + range(t.price) + ")" : "no tier selected"));
    ADDONS.forEach(function (a) { if (r.tier && r.addons[a.id]) L.push("      + " + a.label + " \u2014 " + range(a.price)); });
    if (r.notes) L.push("      Notes: " + r.notes);
  });
  if (activeTiers().length) { L.push(""); L.push("  Consultation credited back \u2014 \u2212$150"); }
  L.push("");
  L.push("Rough range: " + range([lo, hi]));
  L.push("Design work only \u2014 not materials, furniture or labor. A range, not a quote.");
  L.push("Final pricing is agreed before payment is expected.");
  L.push("");
  L.push("britt@aethanhouse.com \u00b7 Atlanta, Georgia");
  return L.join("\n");
}

function download() {
  var blob = new Blob([report()], { type: "text/plain" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = (state.projectName || "aethan-house-project").replace(/[^a-z0-9]+/gi, "-").toLowerCase() + ".txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
}

function buildReceipt() {
  var lines = [];
  BASE.forEach(function (b) {
    lines.push({ label: b.label, note: b.note, value: money(b.price[0]),
                 color: "#F2EBE1", indent: "0px", cursor: "default", onJump: function () {} });
  });
  state.rows.forEach(function (r, i) {
    if (!r.tier) return;
    var t = TIERS.find(function (x) { return x.id === r.tier; });
    lines.push({ label: r.room, note: t ? t.name : "", value: t ? range(t.price) : "",
                 color: "#F2EBE1", indent: "0px", cursor: "pointer",
                 onJump: function () { jumpTo(i); } });
    ADDONS.forEach(function (a) {
      if (!r.addons[a.id]) return;
      lines.push({ label: a.label, note: "Added to " + r.room.toLowerCase(), value: range(a.price),
                   color: "#A8A093", indent: "16px", cursor: "pointer",
                   onJump: function () { jumpTo(i); } });
    });
  });
  if (activeTiers().length) {
    lines.push({ label: "Consultation credited", note: "Your $150 goes toward the work", value: "\u2212$150",
                 color: "#C87F55", indent: "0px", cursor: "default", onJump: function () {} });
  }
  return lines;
}

/* --- view model -------------------------------------------------------- */
function renderVals() {
  var s = state;
  var t2 = totals(), lo = t2[0], hi = t2[1];
  var sl = styleList(), arch = sl[0], personal = sl[1];
  var archOpen = s.open === "arch", personalOpen = s.open === "personal";

  return {
    projectName: s.projectName,
    onProjectName: function (e) { setState({ projectName: e.target.value }); },
    archOther: s.archOther,
    personalOther: s.personalOther,
    archOtherOpen: !!s.arch["Other"],
    personalOtherOpen: !!s.personal["Other"],
    onArchOther: function (e) { setState({ archOther: e.target.value }); },
    onPersonalOther: function (e) { setState({ personalOther: e.target.value }); },
    archOpen: archOpen,
    personalOpen: personalOpen,
    onToggleArch: function () { toggleMenu("arch"); },
    onTogglePersonal: function () { toggleMenu("personal"); },
    archToggleWord: archOpen ? "Apply" : "Choose",
    personalToggleWord: personalOpen ? "Apply" : "Choose",
    archBorder: archOpen ? "#985633" : "rgba(42,38,34,.24)",
    personalBorder: personalOpen ? "#985633" : "rgba(42,38,34,.24)",
    archTextColor: arch.length ? "#2A2622" : "#6B635B",
    personalTextColor: personal.length ? "#2A2622" : "#6B635B",
    archSummary: arch.length ? arch.join(" \u00b7 ") : "Select as many as apply",
    personalSummary: personal.length ? personal.join(" \u00b7 ") : "Select as many as apply",
    archCount: arch.length ? arch.length + " selected" : "",
    personalCount: personal.length ? personal.length + " selected" : "",
    archChips: ARCH.map(function (a) {
      return { label: a.name, description: a.description, icon: icon(a.name),
               mark: s.arch[a.name] ? "#985633" : "transparent",
               markBorder: s.arch[a.name] ? "#985633" : "rgba(42,38,34,.4)",
               bg: s.arch[a.name] ? "#F2EBE1" : "transparent",
               onToggle: function () { var n = {}; n[a.name] = !s.arch[a.name];
                                       setState({ arch: Object.assign({}, s.arch, n) }); } };
    }),
    personalChips: PERSONAL.map(function (p) {
      return { label: p.name, description: p.description, icon: icon(p.name),
               mark: s.personal[p.name] ? "#985633" : "transparent",
               markBorder: s.personal[p.name] ? "#985633" : "rgba(42,38,34,.4)",
               bg: s.personal[p.name] ? "#F2EBE1" : "transparent",
               onToggle: function () { var n = {}; n[p.name] = !s.personal[p.name];
                                       setState({ personal: Object.assign({}, s.personal, n) }); } };
    }),
    baseRows: BASE.map(function (b) { return { label: b.label, note: b.note, priceLabel: money(b.price[0]) }; }),
    adLibHome: arch.length ? arch.join(", ") : "Craftsman",
    adLibHomeOpacity: arch.length ? "1" : ".4",
    adLibPersonal: personal.length ? personal.join(", ") : "Boho",
    adLibPersonalOpacity: personal.length ? "1" : ".4",
    rows: s.rows.map(function (r, i) {
      var t = TIERS.find(function (x) { return x.id === r.tier; });
      var tierOpen = s.open === "tier" + i, addonsOpen = s.open === "addons" + i, roomOpen = s.open === "room" + i;
      var picked = ADDONS.filter(function (a) { return r.addons[a.id]; });
      return {
        anchor: "room-card-" + i, room: r.room, notes: r.notes, expanded: r.expanded,
        z: String(s.rows.length - i + 1),
        status: t ? t.name : "No tier yet",
        customizeWord: r.expanded ? "Collapse"
          : (t || r.notes || Object.keys(r.addons).some(function (k) { return r.addons[k]; }) ? "Edit" : "Customize"),
        cardBorder: t ? "#985633" : "rgba(42,38,34,.12)",
        cardBg: r.expanded ? "#F2EBE1" : "transparent",
        onToggleOpen: function () { setRow(i, { expanded: !r.expanded }); },
        onNotes: function (e) { setRow(i, { notes: e.target.value }); },
        onRemove: function () { state.rows = state.rows.filter(function (_, j) { return j !== i; }); setState({ open: null }); },
        roomOpen: roomOpen,
        onToggleRoom: function () { toggleMenu("room" + i); },
        roomToggleWord: roomOpen ? "Apply" : "Change",
        roomBorder: roomOpen ? "#985633" : "rgba(42,38,34,.24)",
        roomIcon: icon(r.room, 34),
        roomOptions: ROOMS.map(function (name) {
          return { label: name, icon: icon(name),
                   bg: r.room === name ? "#F2EBE1" : "transparent",
                   mark: r.room === name ? "#985633" : "transparent",
                   markBorder: r.room === name ? "#985633" : "rgba(42,38,34,.4)",
                   onPick: function () { setRow(i, { room: name }); setState({ open: null }); } };
        }),
        tierOpen: tierOpen, addonsOpen: addonsOpen,
        onToggleTier: function () { toggleMenu("tier" + i); },
        onToggleAddons: function () { toggleMenu("addons" + i); },
        tierToggleWord: tierOpen ? "Apply" : "Change",
        addonToggleWord: addonsOpen ? "Apply" : "Choose",
        tierBorder: tierOpen ? "#985633" : "rgba(42,38,34,.24)",
        addonBorder: addonsOpen ? "#985633" : "rgba(42,38,34,.24)",
        tierName: t ? t.name : "No tier yet",
        tierTextColor: t ? "#2A2622" : "#6B635B",
        tierBlurb: t ? t.blurb : "Pick one and this room joins the receipt.",
        tierPrice: t ? range(t.price) : "",
        addonSummary: picked.length ? picked.map(function (a) { return a.label; }).join(" \u00b7 ") : "No add-ons for this room",
        addonTextColor: picked.length ? "#2A2622" : "#6B635B",
        addonCount: picked.length ? picked.length + " selected" : "",
        tiers: TIERS.map(function (x) {
          return { name: x.name, blurb: x.blurb, priceLabel: range(x.price),
                   bg: r.tier === x.id ? "#F2EBE1" : "transparent",
                   mark: r.tier === x.id ? "#985633" : "transparent",
                   markBorder: r.tier === x.id ? "#985633" : "rgba(42,38,34,.4)",
                   onPick: function () { setRow(i, { tier: x.id }); setState({ open: null }); } };
        }),
        addons: ADDONS.map(function (a) {
          var on = !!r.addons[a.id];
          return { label: a.label, priceLabel: range(a.price),
                   bg: on ? "#F2EBE1" : "transparent",
                   mark: on ? "#985633" : "transparent",
                   markBorder: on ? "#985633" : "rgba(42,38,34,.4)",
                   onToggle: function () { var n = Object.assign({}, r.addons); n[a.id] = !on; setRow(i, { addons: n }); } };
        })
      };
    }),
    onAddRow: function () {
      state.rows = state.rows.concat([{ id: state.nextId, room: "Office", tier: null, addons: {}, notes: "", expanded: true }]);
      setState({ nextId: state.nextId + 1 });
    },
    planTitle: s.projectName || "Untitled project",
    receipt: buildReceipt(),
    estimate: range([lo, hi]),
    onDownload: download
  };
}

/* --- mount ------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  var root = document.getElementById("pb-root");
  var tpl = document.getElementById("pb-tpl").textContent;
  redraw = DCMini(root, tpl, renderVals);

  // Close any open menu on Escape or an outside press (as the design did).
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setState({ open: null }); });
  function outside(e) {
    if (state.open === null) return;
    var t = e.target;
    if (t && t.closest && t.closest("[data-menu]")) return;
    setState({ open: null });
  }
  document.addEventListener("mousedown", outside, true);
  document.addEventListener("touchstart", outside, true);
});
