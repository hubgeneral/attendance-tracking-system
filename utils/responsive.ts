import { Dimensions } from 'react-native';

// Adjusted breakpoints to match user observation
const breakpoints = {
    xs: 0,       
    s: 320,      
    m: 375,     
    l: 425,     
    xl: 900,    
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
