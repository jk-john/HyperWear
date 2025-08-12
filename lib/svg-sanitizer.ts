import { sanitizeSVG } from './security';

// Safe SVG processing utility
export class SVGSanitizer {
  private static allowedTags = [
    'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 
    'polygon', 'text', 'tspan', 'defs', 'clipPath', 'mask', 'pattern',
    'linearGradient', 'radialGradient', 'stop', 'use', 'symbol', 'marker'
  ];

  private static allowedAttributes = [
    'x', 'y', 'width', 'height', 'viewBox', 'xmlns', 'fill', 'stroke',
    'stroke-width', 'stroke-dasharray', 'stroke-dashoffset', 'opacity',
    'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x1', 'y1', 'x2', 'y2', 'points',
    'transform', 'clip-path', 'mask', 'id', 'class'
  ];

  static sanitize(svgContent: string): string {
    if (!svgContent || typeof svgContent !== 'string') {
      return '';
    }

    // First pass: remove obviously dangerous content
    let cleaned = sanitizeSVG(svgContent);

    // Second pass: more thorough cleaning
    cleaned = this.removeDisallowedTags(cleaned);
    cleaned = this.removeDisallowedAttributes(cleaned);
    cleaned = this.removeExternalReferences(cleaned);
    
    return cleaned;
  }

  private static removeDisallowedTags(content: string): string {
    const tagRegex = /<(\/?)([\w-]+)([^>]*)>/gi;
    return content.replace(tagRegex, (match, closing, tagName) => {
      if (!this.allowedTags.includes(tagName.toLowerCase())) {
        return '';
      }
      return match;
    });
  }

  private static removeDisallowedAttributes(content: string): string {
    const attrRegex = /(\w+(?:-\w+)*)\s*=\s*["']([^"']*?)["']/gi;
    return content.replace(attrRegex, (match, attrName) => {
      if (!this.allowedAttributes.includes(attrName.toLowerCase())) {
        return '';
      }
      return match;
    });
  }

  private static removeExternalReferences(content: string): string {
    // Remove external URLs in xlink:href or href
    content = content.replace(/(?:xlink:)?href\s*=\s*["'][^"']*?["']/gi, '');
    
    // Remove data URIs except for simple ones
    content = content.replace(/data:[^;]*;[^"']*/gi, '');
    
    return content;
  }

  static validateSVG(content: string): boolean {
    try {
      const cleaned = this.sanitize(content);
      // Basic validation - should contain svg tag and be valid XML-like
      return cleaned.includes('<svg') && cleaned.includes('</svg>');
    } catch {
      return false;
    }
  }
}