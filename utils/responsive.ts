import { Dimensions } from 'react-native';

// Adjusted breakpoints to match user observation
const breakpoints = {
    xs: 0,      // < 320
    s: 320,     // 320 - 374
    m: 375,     // 375 - 424
    l: 425,     // 425 - 899
    xl: 900,    // >= 900
};

export type Breakpoint = 'xs' | 's' | 'm' | 'l' | 'xl';

export function getBreakpoint(width?: number): Breakpoint {
    const w = width ?? Dimensions.get('window').width;
    if (w < breakpoints.s) return 'xs';
    if (w < breakpoints.m) return 's';
    if (w < breakpoints.l) return 'm';
    if (w < breakpoints.xl) return 'l';
    return 'xl';
}
