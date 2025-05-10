'use client';

// This is a JavaScript file to avoid TypeScript issues with jsPDF
export const generatePDF = async (
  title,
  headerData,
  rowsData,
  fileName
) => {
  try {
    // Dynamically import modules only on client side
    const jspdfModule = await import('jspdf');
    const jsPDF = jspdfModule.jsPDF;
    await import('jspdf-autotable');
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(title || 'Report', 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Use autotable
    doc.autoTable({
      startY: 40,
      head: [headerData],
      body: rowsData,
      theme: 'grid',
      headStyles: {
        fillColor: [74, 108, 247],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 244, 255]
      }
    });
    
    // Save the PDF
    doc.save(fileName || 'report.pdf');
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
}; 