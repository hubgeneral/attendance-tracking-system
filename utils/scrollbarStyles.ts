/**
 * Global web scrollbar styles
 * Injects custom CSS for scrollbars on web platform only
 */

import { Platform } from 'react-native';

export function injectScrollbarStyles() {
    if (Platform.OS !== 'web') return;

    // Check if styles already injected
    if (typeof document !== 'undefined' && document.getElementById('custom-scrollbar-styles')) return;

    if (typeof document === 'undefined') return;

    const style = document.createElement('style');
    style.id = 'custom-scrollbar-styles';
    style.textContent = `
    /* Custom Scrollbar Styles for Web */
    
    /* Webkit browsers (Chrome, Safari, Edge) */
    ::-webkit-scrollbar {
      width: 12px;
      height: 12px;
    }

    ::-webkit-scrollbar-track {
      background: #f5f5f5;
      border-radius: 6px;
    }

    ::-webkit-scrollbar-thumb {
      background: #004E2B;
      border-radius: 6px;
      border: 3px solid #f5f5f5;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #003820;
    }

    /* Firefox */
    * {
      scrollbar-width: thin;
      scrollbar-color: #004E2B #f5f5f5;
    }

    /* Ensure smooth scrolling */
    html {
      scroll-behavior: smooth;
    }
  `;

    document.head.appendChild(style);
}
