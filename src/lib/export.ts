import { Prospect } from '../types';

export function exportProspectsAsCSV(prospects: Prospect[], filename = 'cadence-desk-prospects.csv'): void {
  const headers = ['ID', 'Name', 'Type', 'City', 'Country', 'Genres', 'Score', 'Status', 'Evidence Confidence', 'Contact Path', 'Contact Value', 'Last Activity Date'];
  
  const rows = prospects.map(p => [
    p.id,
    `"${p.name.replace(/"/g, '""')}"`,
    p.type,
    `"${p.city}"`,
    `"${p.country}"`,
    `"${p.genres.join(', ')}"`,
    p.score,
    p.status,
    p.evidenceConfidence,
    p.contactPath,
    p.contactValue || '',
    p.lastActivityDate
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
}

export function exportProspectsAsJSON(prospects: Prospect[], filename = 'cadence-desk-prospects.json'): void {
  const jsonContent = JSON.stringify(prospects, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  downloadBlob(blob, filename);
}

export function exportSingleProspectJSON(prospect: Prospect): void {
  const jsonContent = JSON.stringify(prospect, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  downloadBlob(blob, `${prospect.id}-${prospect.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
