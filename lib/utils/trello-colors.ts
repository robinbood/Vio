// Label and board-background color palette. Hex values mirror Trello's
// published palette (see AGENTS.md §7) so cross-board portability is
// preserved even though the product is Vio.

export const LABEL_COLORS = {
  yellow: "#f2d600",
  purple: "#c377e0",
  orange: "#ffab4a",
  red: "#eb5a46",
  green: "#61bd4f",
  blue: "#0079bf",
  lime: "#51e898",
  sky: "#00c2e0",
  pink: "#ff80ce",
  black: "#4d4d4d",
  null: "transparent",
} as const;

export type LabelColorName = keyof typeof LABEL_COLORS;

export const LABEL_COLOR_NAMES: LabelColorName[] = [
  "yellow",
  "purple",
  "orange",
  "red",
  "green",
  "blue",
  "lime",
  "sky",
  "pink",
  "black",
];

export const BOARD_BACKGROUNDS = [
  { type: "color", value: "#0079bf", name: "Ocean Blue" },
  { type: "color", value: "#d29034", name: "Orange" },
  { type: "color", value: "#519839", name: "Green" },
  { type: "color", value: "#b04632", name: "Red" },
  { type: "color", value: "#89609e", name: "Purple" },
  { type: "color", value: "#cd5a91", name: "Pink" },
  { type: "color", value: "#4bbf6b", name: "Lime" },
  { type: "color", value: "#00aecc", name: "Sky" },
  { type: "color", value: "#838c91", name: "Grey" },
  { type: "color", value: "#6d28d9", name: "Vio Violet" },
  { type: "color", value: "#4338ca", name: "Vio Indigo" },
  { type: "gradient", value: "linear-gradient(135deg,#6d28d9,#4338ca)", name: "Vio" },
  { type: "gradient", value: "linear-gradient(135deg,#0079bf,#519839)", name: "Blue-Green" },
  { type: "gradient", value: "linear-gradient(135deg,#b04632,#89609e)", name: "Red-Purple" },
  { type: "gradient", value: "linear-gradient(135deg,#d29034,#b04632)", name: "Sunset" },
] as const;
