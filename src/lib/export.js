import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function exportCSV(data, filename = 'analytics-export') {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
}

export function exportPDF(title, columns, rows, filename = 'analytics-export') {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(title, 14, 20);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString('de-CH')}`, 14, 28);

  doc.autoTable({
    head: [columns],
    body: rows,
    startY: 35,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [99, 102, 241] },
  });

  doc.save(`${filename}.pdf`);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
