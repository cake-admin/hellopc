import styled from 'styled-components';

/** Dark indigo on light surfaces. Light indigo on dark surfaces. */
export const BRAND_PC_DARK = '#394edb';
export const BRAND_PC_LIGHT = '#bcc3ff';

const Mark = styled.span`
  font-weight: var(--font-weight-bold, 700);
`;

const Pc = styled.span`
  color: var(--brand-pc, ${BRAND_PC_DARK});
`;

/** Bold “hello pc” in the surrounding type. One space between the words. Only “pc” is indigo. */
export const BrandName = (props) => (
  <Mark {...props}>
    hello <Pc>pc</Pc>
  </Mark>
);

/** Replace each “hello pc” in a string with colored “pc”. */
export function withBrand(text) {
  if (typeof text !== 'string' || !text.includes('hello pc')) return text;
  const parts = text.split('hello pc');
  const nodes = [];
  parts.forEach((part, i) => {
    if (part) nodes.push(part);
    if (i < parts.length - 1) nodes.push(<BrandName key={`hello-pc-${i}`} />);
  });
  return nodes;
}
