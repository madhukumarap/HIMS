const fs = require("fs");
const mammoth = require("mammoth");
const cheerio = require("cheerio");

const docxFilePath =
  "C:/Users/Asus/Downloads/BACKEND Build and Deployment.docx";

// Check if the file exists
if (!fs.existsSync(docxFilePath)) {
  console.error("Error: File does not exist.");
  return;
}

// convert HTML content from the DOCX file
mammoth
  .convertToHtml({ path: docxFilePath })
  .then((htmlResult) => {
    const htmlContent = htmlResult.value;

    // Save HTML content to a file
    const htmlFilePath = "parsed_content.html";
    fs.writeFile(htmlFilePath, htmlContent, (err) => {
      if (err) {
        console.error("Error writing to HTML file:", err);
      } else {
        console.log(`HTML content saved to ${htmlFilePath}`);

        // Parse HTML for text and images
        parseHtmlContent(htmlContent);
      }
    });
  })
  .catch((error) => {
    console.error("Error extracting HTML content from DOCX file:", error);
  });

function parseHtmlContent(htmlContent) {
  const $ = cheerio.load(htmlContent);

  // Extract and save text
  const textContent = $("body").text();
  const textFilePath = "parsed_text.txt";
  fs.writeFile(textFilePath, textContent, (err) => {
    if (err) {
      console.error("Error writing to text file:", err);
    } else {
      console.log(`Text content saved to ${textFilePath}`);
    }
  });

  // Extract and save images
  const images = [];
  $("img").each((index, element) => {
    const dataUri = $(element).attr("src");
    const base64Data = dataUri.split(",")[1]; // Extract base64 data
    const imageExtension = "png"; // Assuming images are PNG, you may need to adjust based on actual formats

    images.push({ data: base64Data, extension: imageExtension });
  });

  images.forEach((image, index) => {
    const imageFilePath = `image_${index + 1}.${image.extension}`;
    fs.writeFile(imageFilePath, image.data, { encoding: "base64" }, (err) => {
      if (err) {
        console.error(`Error writing image ${index + 1} file:`, err);
      } else {
        console.log(`Image ${index + 1} saved to ${imageFilePath}`);
      }
    });
  });
}
