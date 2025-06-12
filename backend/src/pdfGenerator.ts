import fsExtra from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

interface PdfData {
  NAME: string;
  EMAIL: string;
  PHONE: string;
}

// Define paths consistently
// __dirname here will be /app/backend/src/ (or /app/backend/dist/src/ if compiled then run)
// To ensure paths are relative to project root /app/backend/
const projectRootDir = path.join(__dirname, '..'); // Goes from src to backend/
const templatesDir = path.join(projectRootDir, 'src', 'templates'); // Correctly /app/backend/src/templates
const outputDir = path.join(projectRootDir, 'tmp'); // /app/backend/tmp/

export async function generatePdfFromData(data: PdfData): Promise<string> {
  const timestamp = Date.now();
  const uniqueId = `${timestamp}_${Math.random().toString(36).substring(2, 7)}`;

  const templatePath = path.join(templatesDir, 'resume_template.tex');
  const tempTexPath = path.join(outputDir, `resume_${uniqueId}.tex`);
  const outputPdfPath = path.join(outputDir, `resume_${uniqueId}.pdf`);
  const logFilePath = path.join(outputDir, `resume_${uniqueId}.log`);
  const auxFilePath = path.join(outputDir, `resume_${uniqueId}.aux`);

  console.log(`Generating PDF for: ${JSON.stringify(data)}`);
  console.log(`Output directory: ${outputDir}`);
  console.log(`Template path: ${templatePath}`);
  console.log(`Temp .tex path: ${tempTexPath}`);
  console.log(`Output .pdf path: ${outputPdfPath}`);

  try {
    await fsExtra.ensureDir(outputDir);

    let templateContent = await fsExtra.readFile(templatePath, 'utf8');

    templateContent = templateContent.replace('<<NAME>>', data.NAME);
    templateContent = templateContent.replace('<<EMAIL>>', data.EMAIL);
    templateContent = templateContent.replace('<<PHONE>>', data.PHONE);

    await fsExtra.writeFile(tempTexPath, templateContent);

    const command = `pdflatex -output-directory=${outputDir} -interaction=nonstopmode ${tempTexPath}`;

    console.log(`Running pdflatex (1st pass) for ${uniqueId}...`);
    try {
      const { stdout, stderr } = await execPromise(command);
      if (stdout) console.log(`pdflatex (1st pass) stdout for ${uniqueId}:\n${stdout}`);
      if (stderr) console.warn(`pdflatex (1st pass) stderr for ${uniqueId}:\n${stderr}`);
    } catch (error: any) {
      console.error(`Error during pdflatex (1st pass) for ${uniqueId}:`, error.message);
      if (error.stdout) console.error(`pdflatex stdout (1st pass error) for ${uniqueId}:\n${error.stdout}`);
      if (error.stderr) console.error(`pdflatex stderr (1st pass error) for ${uniqueId}:\n${error.stderr}`);
      if (await fsExtra.pathExists(logFilePath)) {
        const logContent = await fsExtra.readFile(logFilePath, 'utf8');
        console.error(`Contents of log file (${logFilePath}) on 1st pass error:\n${logContent}`);
      }
      throw new Error(`pdflatex (1st pass) failed for ${uniqueId}: ${error.message}`);
    }

    console.log(`Running pdflatex (2nd pass) for ${uniqueId}...`);
    try {
      const { stdout, stderr } = await execPromise(command);
      if (stdout) console.log(`pdflatex (2nd pass) stdout for ${uniqueId}:\n${stdout}`);
      if (stderr) console.warn(`pdflatex (2nd pass) stderr for ${uniqueId}:\n${stderr}`);
    } catch (error: any) {
      console.error(`Error during pdflatex (2nd pass) for ${uniqueId}:`, error.message);
      if (error.stdout) console.error(`pdflatex stdout (2nd pass error) for ${uniqueId}:\n${error.stdout}`);
      if (error.stderr) console.error(`pdflatex stderr (2nd pass error) for ${uniqueId}:\n${error.stderr}`);
      if (await fsExtra.pathExists(logFilePath)) {
        const logContent = await fsExtra.readFile(logFilePath, 'utf8');
        console.error(`Contents of log file (${logFilePath}) on 2nd pass error:\n${logContent}`);
      }
      throw new Error(`pdflatex (2nd pass) failed for ${uniqueId}: ${error.message}`);
    }

    if (await fsExtra.pathExists(outputPdfPath) && (await fsExtra.stat(outputPdfPath)).size > 0) {
      console.log(`PDF generated successfully for ${uniqueId} at: ${outputPdfPath}`);
      return outputPdfPath; // Return the path to the generated PDF
    } else {
      throw new Error(`PDF generation failed for ${uniqueId}. Output file not found or is empty: ${outputPdfPath}`);
    }
  } catch (error) {
    console.error(`Error in generatePdfFromData for ${uniqueId}:`, error);
    // Ensure partial temp files are cleaned up even if the main function fails mid-way
    await cleanupTempFiles(tempTexPath, outputPdfPath, auxFilePath, logFilePath);
    throw error; // Re-throw the error to be caught by the caller
  }
}

export async function cleanupTempFiles(texPath: string, pdfPath: string, auxPath: string, logPath: string) {
  console.log(`Cleaning up temporary files: ${texPath}, ${pdfPath}, ${auxPath}, ${logPath}`);
  const filesToDelete = [texPath, pdfPath, auxPath, logPath];
  for (const filePath of filesToDelete) {
    try {
      if (await fsExtra.pathExists(filePath)) {
        await fsExtra.remove(filePath);
        console.log(`Successfully removed ${filePath}`);
      }
    } catch (cleanupError) {
      console.warn(`Warning: Failed to clean up ${filePath}:`, cleanupError);
    }
  }
}
