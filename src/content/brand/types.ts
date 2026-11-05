/**
 * Brand guidelines (/brand): the content model.
 *
 * A page is a list of sections; a section is a header row (label, notes,
 * optional button) plus a list of blocks. Every block type has exactly one
 * renderer in src/components/brand/Block.astro. To add a page, add a file in
 * this folder and list it in index.ts; no component work is needed.
 */

/** What a placeholder visual shows. All art is drawn in CSS: no real assets. */
export type Art =
  | 'none'
  | 'wordmark' | 'mark' | 'stacked' | 'lockup'
  | 'construction' | 'clearspace'
  | 'dots' | 'lines' | 'grid' | 'arcs' | 'shapes'
  | 'ui' | 'phone' | 'tee' | 'cap' | 'tote' | 'van' | 'sign' | 'card'
  | 'slide' | 'onepager' | 'email' | 'story' | 'post'
  | 'wire-a' | 'wire-b' | 'wire-c'
  | 'margins' | 'columns' | 'gutters'
  | 'icons'
  | 'steps';

/** Background of a placeholder visual. `photo` is a calm grey gradient
 *  standing in for photography; `color` uses `color`. */
export type Tone = 'photo' | 'dark' | 'grey' | 'light' | 'white' | 'accent' | 'color';

export type Ratio = 'wide' | 'landscape' | 'video' | 'square' | 'portrait' | 'tall' | 'story' | 'banner';

export interface Media {
  art?: Art;
  tone?: Tone;
  /** Background for tone `color` (a placeholder palette value). */
  color?: string;
  ratio?: Ratio;
  /** Small label inside the visual, bottom left. */
  tag?: string;
  /** Varies the photo gradient so neighbouring tiles differ. */
  seed?: number;
  /** Logo misuse shown in a "Don't" tile. */
  misuse?: 'stretch' | 'outline' | 'colour' | 'shadow' | 'rotate' | 'pattern';
  /** Type misuse shown in a "Don't" tile. */
  typeMisuse?: 'typeface' | 'mono' | 'tight' | 'tracking' | 'caps' | 'size' | 'clash' | 'contrast' | 'colours' | 'white';
}

export interface Figure {
  media: Media;
  caption?: string;
  /** Do / don't marker under the visual. */
  verdict?: 'good' | 'ok' | 'bad';
}

export interface Swatch {
  name: string;
  hex: string;
  /** Shown as "Not specified" when absent. */
  pms?: string;
  /** Hide CMYK (screen-only colours). */
  screenOnly?: boolean;
  /** What the colour is for, shown under the values. */
  use?: string;
}

export interface Item {
  icon?: IconName;
  title: string;
  body: string;
  meta?: string;
}

export type IconName =
  | 'type' | 'image' | 'pen' | 'layout' | 'shirt' | 'file' | 'shield' | 'users'
  | 'target' | 'compass' | 'spark' | 'heart' | 'eye' | 'bolt' | 'leaf' | 'grid'
  | 'logo' | 'palette' | 'download' | 'arrow' | 'globe' | 'chat' | 'box' | 'pin';

export type Block =
  | { type: 'prose'; paragraphs: string[]; size?: 'lead' | 'body' }
  | { type: 'statement'; text: string }
  | { type: 'feature'; title: string; body: string; media: Media }
  | { type: 'items'; items: Item[]; cols?: 2 | 3 | 4 }
  | { type: 'media'; items: Figure[]; cols?: 1 | 2 | 3 | 4 | 6; offset?: boolean; panel?: 'good' | 'bad' | 'white' }
  | { type: 'swatches'; items: Swatch[]; cols?: 2 | 3 | 4 | 5; size?: 'lg' | 'md'; offset?: boolean }
  | { type: 'proportion'; items: { hex: string; share: number }[] }
  | { type: 'contrast'; items: { fg: string; bg: string; label: string }[] }
  | { type: 'rules'; items: string[] }
  | { type: 'stats'; items: { value: string; text: string }[] }
  | { type: 'specimen'; name: string; meta: string[]; font?: 'display' | 'sans' | 'mono' }
  | { type: 'weights'; items: { name: string; weight: number }[] }
  | { type: 'typeRows'; rows: { meta: string[]; sample: string; style: TypeStyle }[] }
  | { type: 'tester'; meta: string[]; sample: string; style: TypeStyle }
  | { type: 'wordlist'; columns: { title: string; words: string[]; verdict: 'good' | 'bad' }[] }
  | { type: 'spacing'; title: string; steps: number[] }
  | { type: 'radius'; steps: { label: string; px: number }[]; borders: { label: string; px: number }[] }
  | { type: 'columns'; items: { media: Media; title: string; body: string[] }[] }
  | { type: 'downloads'; title?: string; items: { name: string; media: Media }[] }
  | { type: 'pages' };

export type TypeStyle = 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'mono' | 'formula' | 'lede';

export interface Section {
  /** Small mono label on the left (may wrap: use \n). */
  label?: string;
  /** Large heading instead of a label (e.g. "Ethos"). */
  title?: string;
  /** Short notes beside the label; each string is a column. */
  notes?: string[];
  button?: { label: string; href: string };
  blocks?: Block[];
  /** Grey band behind the section, for a chapter inside a page. */
  band?: boolean;
  /** Anchor id; derived from the label when absent. */
  id?: string;
}

export interface BrandPage {
  slug: string;
  title: string;
  /** Large intro paragraph under the hero. */
  lead: string;
  /** Home tile and pager card. */
  tile: { color: string; icon: IconName; cover: Media };
  /** Set while the page's rules are still lorem ipsum: shown as a notice
   *  under the lead and as a label on the home tile. */
  draft?: string;
  sections: Section[];
}
