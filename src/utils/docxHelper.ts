import { SpeTriviaItem } from '../types';

/**
 * Check if a trivia item is a PDF document
 */
export const isPdfItem = (item: SpeTriviaItem): boolean => {
  if (item.fileType === 'pdf') return true;
  if (item.docxFileName && item.docxFileName.toLowerCase().endsWith('.pdf')) return true;
  if (item.docxFileUrl && item.docxFileUrl.startsWith('data:application/pdf')) return true;
  return false;
};

/**
 * Main utility to download trivia study files (PDF or DOCX)
 * Supports Base64 data URLs, remote URLs, cached browser files, and dynamic fallback generation
 */
export const downloadTriviaFile = (item: SpeTriviaItem) => {
  const isPdf = isPdfItem(item);
  let defaultFileName = item.docxFileName;

  if (!defaultFileName) {
    const cleanTitle = item.title.replace(/[^a-zA-Z0-9_-]/g, '_');
    defaultFileName = isPdf ? `${cleanTitle}_SPE_Trivia.pdf` : `${cleanTitle}_SPE_Trivia.docx`;
  }

  // Check fileUrl on item or local storage cache
  let fileUrl = item.docxFileUrl;
  if (!fileUrl && item.id) {
    try {
      fileUrl = localStorage.getItem(`spe_trivia_file_${item.id}`) || '';
    } catch {
      fileUrl = '';
    }
  }

  // 1. If base64/data URI is provided
  if (fileUrl && fileUrl.startsWith('data:')) {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = defaultFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // 2. If external HTTP url is provided
  if (fileUrl && fileUrl.startsWith('http')) {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank';
    link.download = defaultFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // 3. Fallback: Generate a clean formatted HTML / Word blob
  const sampleQuestions = item.previewQuestions && item.previewQuestions.length > 0
    ? item.previewQuestions.map((pq, idx) => `
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f8fafc; border-left: 4px solid #0056b3; border-radius: 6px;">
          <p style="font-weight: bold; font-size: 13pt; color: #0a2540; margin-bottom: 8px;">Question ${idx + 1}: ${pq.q}</p>
          <ul style="margin-left: 20px; list-style-type: upper-alpha;">
            ${pq.options.map((opt, optIdx) => `
              <li style="margin: 6px 0; color: ${optIdx === pq.answerIdx ? '#059669; font-weight: bold;' : '#334155;'}">
                ${opt} ${optIdx === pq.answerIdx ? ' &nbsp; [CORRECT ANSWER]' : ''}
              </li>
            `).join('')}
          </ul>
          <p style="margin-top: 10px; font-size: 11pt; color: #475569; background: #e2e8f0; padding: 8px 12px; border-radius: 4px;">
            <strong>Technical Explanation:</strong> ${pq.explanation}
          </p>
        </div>
      `).join('')
    : `
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f8fafc; border-left: 4px solid #0056b3; border-radius: 6px;">
          <p style="font-weight: bold; font-size: 13pt; color: #0a2540;">Module Summary & Evaluation Questions</p>
          <p style="color: #334155; line-height: 1.6;">${item.description}</p>
        </div>
      `;

  const keyFactsList = item.keyFacts && item.keyFacts.length > 0
    ? `
        <h3 style="color: #0056b3; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; margin-top: 24px;">💡 Key Facts & Industry Best Practices</h3>
        <ul style="padding-left: 20px;">
          ${item.keyFacts.map(fact => `<li style="margin: 8px 0; color: #1e293b; line-height: 1.5;">${fact}</li>`).join('')}
        </ul>
      `
    : '';

  const docHtmlContent = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${item.title}</title>
      <style>
        body {
          font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
          font-size: 12pt;
          line-height: 1.6;
          color: #0f172a;
          margin: 40px;
        }
        .header {
          text-align: center;
          border-bottom: 3px double #0056b3;
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        .logo-text {
          font-size: 16pt;
          font-weight: bold;
          color: #0056b3;
          letter-spacing: 1px;
        }
        .chapter-title {
          font-size: 11pt;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-top: 4px;
        }
        .title {
          font-size: 20pt;
          font-weight: bold;
          color: #0a2540;
          margin: 16px 0 8px 0;
        }
        .meta-table {
          width: 100%;
          border-collapse: collapse;
          margin: 18px 0 28px 0;
          background-color: #f1f5f9;
        }
        .meta-table td {
          padding: 8px 12px;
          border: 1px solid #cbd5e1;
          font-size: 10.5pt;
        }
        .meta-table td.label {
          font-weight: bold;
          color: #334155;
          width: 25%;
          background-color: #e2e8f0;
        }
        .footer-note {
          margin-top: 40px;
          border-top: 1px solid #cbd5e1;
          padding-top: 12px;
          font-size: 9.5pt;
          color: #94a3b8;
          text-align: center;
        }
        @media print {
          body { margin: 20mm; }
          .footer-note { position: fixed; bottom: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-text">SOCIETY OF PETROLEUM ENGINEERS</div>
        <div class="chapter-title">PEM AKAMIGAS STUDENT CHAPTER — SPE TRIVIA ACADEMY</div>
      </div>

      <div class="title">${item.title}</div>
      <p style="font-size: 12pt; color: #475569; margin-top: -4px;">${item.description}</p>

      <table class="meta-table">
        <tr>
          <td class="label">Format / Document:</td>
          <td>${isPdf ? 'Adobe PDF Document (.pdf)' : 'Microsoft Word (.docx)'}</td>
          <td class="label">Difficulty Level:</td>
          <td>${item.level || 'Beginner - Intermediate'}</td>
        </tr>
        <tr>
          <td class="label">Category / Domain:</td>
          <td>${item.category}</td>
          <td class="label">Total Questions:</td>
          <td>${item.questionCount || (item.previewQuestions ? item.previewQuestions.length : 10)} Questions</td>
        </tr>
        <tr>
          <td class="label">Published Date:</td>
          <td colspan="3">${item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'September 2025'}</td>
        </tr>
      </table>

      ${keyFactsList}

      <h3 style="color: #0056b3; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; margin-top: 30px;">📝 Evaluation Questions & Explanations</h3>
      ${sampleQuestions}

      <div class="footer-note">
        This document is officially published by the SPE PEM Akamigas Student Chapter as learning & petroleum competition preparatory material.<br>
        &copy; ${new Date().getFullYear()} Society of Petroleum Engineers (SPE) PEM Akamigas Student Chapter. All rights reserved.
      </div>
    </body>
    </html>
  `;

  if (isPdf) {
    // If fallback printable PDF is needed, create HTML blob download or open view
    const blob = new Blob([docHtmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = defaultFileName.endsWith('.html') ? defaultFileName : `${defaultFileName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } else {
    const blob = new Blob([docHtmlContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = defaultFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

/**
 * Backward compatibility alias
 */
export const downloadTriviaDocx = (item: SpeTriviaItem) => {
  downloadTriviaFile(item);
};
