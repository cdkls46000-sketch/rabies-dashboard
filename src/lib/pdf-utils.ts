/**
 * Helper to get the canonical URL for a lab result PDF file.
 * Handles the Next.js basePath: '/rabies-dashboard' for GitHub Pages deployment.
 */
export function getLabPdfUrl(headNo?: number): string {
  if (!headNo) return '';
  const padded = String(headNo).padStart(2, '0');
  const basePath = '/rabies-dashboard';
  return `${basePath}/docs/labs/lab-head-${padded}.pdf`;
}
