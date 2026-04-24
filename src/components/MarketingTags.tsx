import { useEffect } from 'react';

// Declaraciones de tipos para Facebook Pixel
declare global {
  interface Window {
    fbq?: (type: string, action: string, parameters?: any) => void;
    _fbq?: any;
    gtag?: (command: string, action: string, parameters?: any) => void;
    dataLayer?: any[];
    livoTracking?: (eventName: string, parameters?: any) => void;
  }
}

/**
 * Componente que implementa Meta Pixel y Google Tag Manager
 * para marketing automation y analytics.
 */
export function MarketingTags() {
  useEffect(() => {
    // Meta Pixel Code
    (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function() {
        if (n?.callMethod) {
          n.callMethod.apply(n, arguments);
        } else if (n?.queue) {
          n.queue.push(arguments);
        }
      };
      if (!f._fbq) f._fbq = n;
      if (n) {
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
      }
      t = b.createElement(e);
      if (t) {
        t.async = true;
        t.src = v;
      }
      s = b.getElementsByTagName(e)[0];
      if (s?.parentNode && t) {
        s.parentNode.insertBefore(t, s);
      }
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    // Inicializar Meta Pixel usando variable de entorno
    const pixelId = import.meta.env.VITE_META_PIXEL_ID;
    if (window.fbq && pixelId) {
      window.fbq('init', pixelId);
      window.fbq('track', 'PageView');
    }

    // Google Tag Manager usando variable de entorno
    const gtmId = import.meta.env.VITE_GTM_ID;
    if (gtmId) {
      const gtmScript = document.createElement('script');
      gtmScript.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `;
      document.head.appendChild(gtmScript);

      // Google Tag Manager noscript
      const gtmNoScript = document.createElement('noscript');
      gtmNoScript.innerHTML = `
        <iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>
      `;
      document.body.insertBefore(gtmNoScript, document.body.firstChild);
    }

    // Eventos de conversión personalizados
    const trackEvent = (eventName: string, parameters?: any) => {
      // Meta Pixel Events
      if (window.fbq) {
        window.fbq('trackCustom', eventName, parameters);
      }

      // Google Analytics Events
      if (window.gtag) {
        window.gtag('event', eventName, parameters);
      }

      // Data Layer para GTM
      if (window.dataLayer) {
        window.dataLayer.push({
          event: eventName,
          ...parameters
        });
      }
    };

    // Hacer tracking disponible globalmente
    window.livoTracking = trackEvent;

    return () => {
      // Cleanup si es necesario
      const gtmScriptElement = document.querySelector('script[data-gtm]');
      if (gtmScriptElement) {
        gtmScriptElement.remove();
      }
    };
  }, []);

  return null;
}

// Declaraciones de tipos para TypeScript
declare global {
  interface Window {
    fbq?: (type: string, action: string, parameters?: any) => void;
    gtag?: (command: string, action: string, parameters?: any) => void;
    dataLayer?: any[];
    livoTracking?: (eventName: string, parameters?: any) => void;
  }
}

/**
 * Hook personalizado para tracking de eventos de e-commerce
 */
export function useMarketingTracking() {
  const track = (eventName: string, parameters?: any) => {
    if (window.livoTracking) {
      window.livoTracking(eventName, parameters);
    }
  };

  return {
    // Eventos de e-commerce
    trackPageView: (pageName: string) => {
      track('page_view', { page_name: pageName });
    },

    trackAddToCart: (productName: string, price: number, productId: string) => {
      track('add_to_cart', {
        product_name: productName,
        value: price,
        currency: 'COP',
        product_id: productId
      });
    },

    trackPurchase: (orderId: string, value: number, items: any[]) => {
      track('purchase', {
        transaction_id: orderId,
        value: value,
        currency: 'COP',
        items: items
      });
    },

    trackViewContent: (productName: string, productId: string) => {
      track('view_content', {
        product_name: productName,
        product_id: productId
      });
    },

    trackInitiateCheckout: (value: number, items: any[]) => {
      track('initiate_checkout', {
        value: value,
        currency: 'COP',
        items: items
      });
    },

    trackWhatsAppClick: () => {
      track('whatsapp_click', {
        channel: 'whatsapp'
      });
    },

    trackContactForm: (formType: string) => {
      track('contact_form', {
        form_type: formType
      });
    },

    // Eventos personalizados para Livo
    trackColombianPurchase: (city: string, paymentMethod: string) => {
      track('colombian_purchase', {
        city: city,
        payment_method: paymentMethod,
        country: 'Colombia'
      });
    }
  };
}
