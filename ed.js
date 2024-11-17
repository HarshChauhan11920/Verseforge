// Apply formatting to selected text
function formatText(command) {
  document.execCommand(command, false, null);
}

// Align text based on selection
function alignText(alignType) {
  document.execCommand("justify" + alignType, false, null);
}

// Change font color based on selected color
function changeFontColor(color) {
  document.execCommand("foreColor", false, color);
}

// Function to download content as a PDF
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  // Get the content from the editor area and replace line breaks with new lines
  const content = document.getElementById("editor").innerHTML.replace(/<div>|<br>/g, '\n').replace(/<\/div>/g, '');

  // Split content by newline to handle multiline text
  const lines = content.split('\n');

  let y = 10; // Starting y position
  const pageHeight = pdf.internal.pageSize.height; // Height of the page
  const lineHeight = 10; // Height between each line

  // Add each line to the PDF and create a new page if necessary
  lines.forEach((line) => {
      if (y + lineHeight > pageHeight) {
          pdf.addPage(); // Add a new page if content exceeds page height
          y = 10; // Reset y position for new page
      }
      pdf.text(10, y, line.trim());
      y += lineHeight; // Increment y position for the next line
  });

  // Save the PDF with a filename
  pdf.save("lyrics.pdf");
}

// Load lyrics from local storage when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const lyricsToEdit = localStorage.getItem("lyricsToEdit");
  if (lyricsToEdit) {
      document.getElementById("editor").textContent = lyricsToEdit;
      localStorage.removeItem("lyricsToEdit"); // Clear the stored lyrics after loading
  }
});
