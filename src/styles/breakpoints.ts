export const breakpoints = {
  mobile: '48rem', /* 768px */
  tablet: '64rem', /* 1024px */
} as const

export const media = {
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  mobile: `@media (max-width: ${breakpoints.mobile})`,
} as const
