/**
 * Lightweight, zero-dependency RSS/Atom XML feed parser.
 * Handles CDATA, HTML entities, and standard RSS 2.0 / Atom fields.
 */

export interface ParsedRssItem {
  title: string;
  link: string;
  description: string;
  pubDate?: string;
  contentEncoded?: string;
  thumbnailUrl?: string;
}

export function parseRssFeed(xmlText: string): ParsedRssItem[] {
  const items: ParsedRssItem[] = [];

  // Match all <item>...</item> blocks
  const itemRegex = /<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1];

    const title = extractXmlTag(itemContent, 'title');
    const link = extractXmlTag(itemContent, 'link');
    const description = extractXmlTag(itemContent, 'description');
    const pubDate = extractXmlTag(itemContent, 'pubDate') || extractXmlTag(itemContent, 'dc:date');
    const contentEncoded = extractXmlTag(itemContent, 'content:encoded');

    // Extract image thumbnail from content:encoded or description if present
    let thumbnailUrl: string | undefined;
    const imgMatch = (contentEncoded || description).match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1]) {
      thumbnailUrl = imgMatch[1];
    }

    if (title && (link || description)) {
      items.push({
        title: cleanText(title),
        link: cleanText(link),
        description: cleanText(description),
        pubDate: pubDate ? cleanText(pubDate) : undefined,
        contentEncoded,
        thumbnailUrl
      });
    }
  }

  return items;
}

function extractXmlTag(content: string, tagName: string): string {
  // Check CDATA first: <tagName><![CDATA[...]]></tagName>
  const cdataRegex = new RegExp(`<${tagName}(?:\\s[^>]*)?>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tagName}>`, 'i');
  const cdataMatch = content.match(cdataRegex);
  if (cdataMatch && cdataMatch[1]) {
    return cdataMatch[1].trim();
  }

  // Standard tag: <tagName>...</tagName>
  const standardRegex = new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const standardMatch = content.match(standardRegex);
  if (standardMatch && standardMatch[1]) {
    return standardMatch[1].trim();
  }

  return '';
}

function cleanText(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
