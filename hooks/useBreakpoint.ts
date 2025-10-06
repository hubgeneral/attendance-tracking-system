import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { getBreakpoint, Breakpoint } from '../utils/responsive';

export function useBreakpoint(): Breakpoint {
    const [breakpoint, setBreakpoint] = useState<Breakpoint>(getBreakpoint());

    useEffect(() => {
        function onChange({ window }: { window: ScaledSize }) {
            setBreakpoint(getBreakpoint(window.width));
        }
        const subscription = Dimensions.addEventListener('change', onChange);
        return () => {
            if (subscription && typeof subscription.remove === 'function') {
                subscription.remove();
            }
        };
    }, []);

    return breakpoint;
}
