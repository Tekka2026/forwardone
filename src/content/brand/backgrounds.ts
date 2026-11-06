/**
 * Background maker (/brand/backgrounds): copy, formats and presets.
 * The plectrum shape is the supplied SVG (src/assets/brand/plectrum.svg).
 */
import { P } from './palette';

export const backgrounds = {
  title: 'Background maker',
  lead: 'Turn the plectrum in 3D, blur it, set it on a FORWARD.one gradient and export a new brand background.',
  hint: 'Drag the image to rotate the plectrum. Your settings live in the page address: copy it to share or keep a background.',
};

/** Named palette colours offered in the pickers, in palette order. */
export const swatches: { name: string; hex: string }[] = [
  { name: 'Signal Red', hex: P.signalRed },
  { name: 'Oxblood', hex: P.oxblood },
  { name: 'Copper', hex: P.copper },
  { name: 'Amber', hex: P.amber },
  { name: 'Gold', hex: P.gold },
  { name: 'Cream', hex: P.cream },
  { name: 'Ice', hex: P.ice },
  { name: 'Ink', hex: P.ink },
  { name: 'White', hex: P.white },
  { name: 'Black', hex: P.black },
];

/** Formats as named by the brand team; "Turn" swaps width and height. 16:9 is the default. */
export const ratios: { w: number; h: number }[] = [
  { w: 1, h: 1 },
  { w: 3, h: 4 },
  { w: 4, h: 5 },
  { w: 1, h: 2 },
  { w: 16, h: 9 },
  { w: 5, h: 7 },
];
export const defaultRatio = '16:9';

/** Gradient presets: stops in order, from the core palette. */
export const presets: { name: string; stops: string[]; type: 'linear' | 'radial'; angle: number }[] = [
  { name: 'Steps', stops: [P.signalRed, P.oxblood, P.copper, P.amber, P.gold, P.cream, P.ice], type: 'linear', angle: 90 },
  { name: 'Ember', stops: [P.black, P.oxblood, P.signalRed], type: 'linear', angle: 120 },
  { name: 'Sunrise', stops: [P.oxblood, P.amber, P.gold], type: 'linear', angle: 160 },
  { name: 'Daylight', stops: [P.cream, P.ice], type: 'linear', angle: 180 },
  { name: 'Glow', stops: [P.gold, P.amber, P.oxblood], type: 'radial', angle: 0 },
  { name: 'Night', stops: [P.oxblood, P.black], type: 'radial', angle: 0 },
];
