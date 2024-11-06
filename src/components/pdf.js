import { jsPDF } from "jspdf";

const generatePdf = (list) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.text("My List Header", 10, 20);

  // Line separator
  doc.setLineWidth(0.5);
  doc.line(10, 25, 200, 25);

  // List Content
  doc.setFontSize(12);
  list.forEach((item, index) => {
    doc.text(`${index + 1}. ${item}`, 10, 40 + index * 10);
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.line(10, pageHeight - 30, 200, pageHeight - 30);
  doc.setFontSize(10);
  doc.text("This is the footer text", 10, pageHeight - 20);

  return doc.output("blob"); // Returns a blob for previewing
};
