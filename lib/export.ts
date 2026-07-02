import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ProposalData } from './types';

export async function exportToPDF(elementId: string, proposalNumber: string) {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Element not found');

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 297; // A4 height in mm

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    pdf.save(`proposal-${proposalNumber}.pdf`);
  } catch (error) {
    console.error('[v0] PDF export failed:', error);
    throw new Error('Failed to export PDF');
  }
}

export function printProposal(elementId: string) {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Element not found');

    const printWindow = window.open('', '', 'width=900,height=700');
    if (!printWindow) throw new Error('Failed to open print window');

    const clonedElement = element.cloneNode(true);
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Proposal</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: system-ui, -apple-system, sans-serif;
              color: #1e293b;
              background: #fff;
            }
            @media print {
              body {
                background: #fff;
              }
              * {
                box-shadow: none !important;
                background: transparent !important;
              }
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 8px;
              text-align: left;
              border-bottom: 1px solid #e2e8f0;
            }
            th {
              background-color: #f1f5f9;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          ${(clonedElement as HTMLElement).innerHTML}
          <script>
            window.addEventListener('load', () => {
              window.print();
              window.close();
            });
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  } catch (error) {
    console.error('[v0] Print failed:', error);
    throw new Error('Failed to print proposal');
  }
}

export function generateQRCodeUrl(text: string): string {
  // Using qr-server.com as a free QR code service
  const encoded = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}`;
}
