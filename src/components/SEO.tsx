import { useEffect } from 'react';
import { useBrandStore } from '@/store/brandStore';

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  schema?: object;
}

/**
 * Componente SEO para gestionar metadatos dinámicos y JSON-LD.
 */
export function SEO({ 
  title, 
  description, 
  image, 
  url, 
  type = 'website', 
  schema 
}: SEOProps) {
  const { config } = useBrandStore();
  const siteName = config?.name || 'Livo';
  const fullTitle = `${title} | ${siteName}`;
  // Fallback image if none is provided or if it's an empty string
  const finalImage = image && image.length > 0 ? image : config?.logo_url || '/logo.png';

  useEffect(() => {
    // 1. Actualizar Título del Documento
    document.title = fullTitle;

    // 2. Función helper para actualizar o crear meta tags
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Metadatos Estándar
    if (description) updateMetaTag('description', description);

    // 4. OpenGraph (Facebook, WhatsApp, LinkedIn)
    updateMetaTag('og:title', fullTitle, true);
    if (description) updateMetaTag('og:description', description, true); // description can be empty string
    updateMetaTag('og:image', finalImage, true);
    updateMetaTag('og:url', url || window.location.href, true);
    updateMetaTag('og:type', type, true);

    // 5. Twitter Cards
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    if (description) updateMetaTag('twitter:description', description); // description can be empty string
    updateMetaTag('twitter:image', finalImage);

    // 6. Inyección de JSON-LD (Datos Estructurados)
    let scriptTag = document.getElementById('json-ld-data') as HTMLScriptElement;
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'json-ld-data';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }

  }, [fullTitle, description, finalImage, url, type, schema]);

  return null;
}