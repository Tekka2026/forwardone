/**
 * Brand guidelines (/brand): page order. The home tiles, the Index menu and
 * the previous / next cards all follow this list.
 */
import type { BrandPage } from './types';
import { foundations } from './foundations';
import { logo } from './logo';
import { color } from './color';
import { typography } from './typography';
import { photography } from './photography';
import { graphics } from './graphics';
import { layout } from './layout';
import { applications } from './applications';
import { marketingCollateral } from './marketing-collateral';

export const brandPages: BrandPage[] = [
  foundations,
  logo,
  color,
  typography,
  photography,
  graphics,
  layout,
  applications,
  marketingCollateral,
];

export { brandSite } from './site';
export type * from './types';
