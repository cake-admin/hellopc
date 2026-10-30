import 'styled-components';
import type { CakeTheme } from '../tokens/theme';

// Makes `props.theme` fully typed inside styled-components for hello pc components.
declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends CakeTheme {}
}
