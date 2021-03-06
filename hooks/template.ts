export default function useTemplate(localSlug?: string): string | null {
  // Allow local development
  if (typeof window !== 'undefined' && window.location.href.startsWith('http://localhost'))
    return localSlug ?? ''

  // Handle server-side
  let href = typeof window !== 'undefined' ? window.location.href : undefined
  if (!href) return null

  // Get slug from current window location
  href = href[href.length - 1] === '/' ? href.substring(0, href.length - 1) : href
  let slug = href.split('/')[href.split('/').length - 1]

  return slug
}
