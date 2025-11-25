import { Platform } from 'react-native';
import { useBreakpoint } from './useBreakpoint';

export function usePlatform() {
    const breakpoint = useBreakpoint();

    return {
        isWeb: Platform.OS === 'web',
        isMobile: Platform.OS === 'ios' || Platform.OS === 'android',
        isLargeScreen: breakpoint === 'xl',
        breakpoint,
        // Helper to determine if we should use web-optimized layout
        shouldUseWebLayout: Platform.OS === 'web' && breakpoint === 'xl',
    };
}
