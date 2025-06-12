import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { generatePdfFromData, cleanupTempFiles } from './pdfGenerator'; // Assuming pdfGenerator.ts is in the same directory

const app = express();
const port = process.env.PORT || 3002; // Changed port to 3002

app.use(cors());
app.use(bodyParser.json());

interface GeneratePdfBody {
  NAME: string;
  EMAIL: string;
  PHONE: string;
}

app.post('/api/generate-pdf', async (req: Request<{}, {}, GeneratePdfBody>, res: Response) => {
  const { NAME, EMAIL, PHONE } = req.body;

  if (!NAME || !EMAIL || !PHONE) {
    return res.status(400).json({ error: 'Missing required fields: NAME, EMAIL, PHONE' });
  }

  let pdfPath: string | null = null;
  // Construct paths for potential cleanup, even if generation fails early
  // This is a bit simplified; unique names from pdfGenerator would be more robust here if known beforehand
  // For now, pdfGenerator itself handles its uniquely named files internally for generation.
  // The cleanup here will target the specific file returned by generatePdfFromData.

  try {
    pdfPath = await generatePdfFromData({ NAME, EMAIL, PHONE });

    res.sendFile(pdfPath, { headers: { 'Content-Type': 'application/pdf' } }, async (err) => {
      if (err) {
        console.error('Error sending PDF file:', err);
        // Potentially, res.headersSent might be true, so we can't send another error response
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error sending PDF file' });
        }
      } else {
        console.log('PDF file sent successfully.');
      }

      // Cleanup after sending or if sending failed but PDF was created
      if (pdfPath) {
        // Derive related temp file paths from the returned pdfPath
        const texPath = pdfPath.replace(/\.pdf$/, ".tex");
        const auxPath = pdfPath.replace(/\.pdf$/, ".aux");
        const logPath = pdfPath.replace(/\.pdf$/, ".log");
        await cleanupTempFiles(texPath, pdfPath, auxPath, logPath);
      }
    });
  } catch (error: any) {
    console.error('Failed to generate PDF:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
    }
    // If pdfPath was generated before error, attempt cleanup (though pdfGenerator tries this too)
    // This generic cleanup might not be needed if pdfGenerator is robust.
    // For now, relying on pdfGenerator's internal cleanup on its error.
  }
});

// Start the server only if this script is run directly (not imported as a module)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default app; // Export app for testing purposes
