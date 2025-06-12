import fsExtra from 'fs-extra';
import path from 'path';
import { generatePdfFromData, cleanupTempFiles } from '../pdfGenerator';
import util from 'util';

// Promisify exec for use in mocks if needed, though direct mock is often simpler
// const execPromise = util.promisify(require('child_process').exec);

// Mock child_process.exec
jest.mock('child_process', () => ({
  ...jest.requireActual('child_process'), // import and retain default behavior
  exec: jest.fn(), // Default mock for exec
}));

// Helper to get path to the tmp directory for this test file.
// __dirname will be backend/src/__tests__
const testOutputDir = path.join(__dirname, '..', '..', 'tmp', 'test_pdf_generator');

describe('pdfGenerator', () => {
  beforeAll(async () => {
    // Ensure a clean state for test output
    await fsExtra.emptyDir(testOutputDir);
  });

  afterEach(async () => {
    // Clean up test output directory after each test to ensure no interference
    // await fsExtra.emptyDir(testOutputDir);
    // Individual tests will now handle their specific file cleanup.
    jest.clearAllMocks(); // Clear mock usage counts between tests
  });

  // Override outputDir in pdfGenerator for tests - THIS IS TRICKY as it's module-scoped const
  // A better way would be to pass outputDir as a parameter to generatePdfFromData
  // For now, we'll assume pdfGenerator.ts uses a path relative to its own location that resolves to backend/tmp
  // and our cleanup will target that. The unique IDs in pdfGenerator will help isolation.

  test('should successfully generate a PDF with valid data', async () => {
    const pdfData = { NAME: "Test Name", EMAIL: "test@email.com", PHONE: "1234567890" };

    // Mock successful exec for pdflatex
    (require('child_process').exec as jest.Mock).mockImplementation((command, callback) => {
      // Simulate pdflatex creating the PDF file. The actual file won't be created by this mock.
      // The test relies on the function's internal checks for file existence.
      // To make it more realistic, we could have the mock create a dummy PDF.
      // For now, we'll assume that if exec is called twice without error, it "worked".
      // The function itself checks fsExtra.pathExists and fsExtra.stat. We need to ensure this passes.

      // Let's try to make this mock create a dummy PDF to satisfy the checks.
      // The command includes -output-directory=<path> <texFilePath>
      const parts = command.split(' ');
      const outputDirArg = parts.find((p: string) => p.startsWith('-output-directory='));
      const texFilePathArg = parts.pop(); // last part is .tex file
      if (!outputDirArg || !texFilePathArg) {
        return callback(new Error('Mock pdflatex error: command structure not recognized'));
      }
      const actualOutputDir = outputDirArg.split('=')[1];
      const baseName = path.basename(texFilePathArg, '.tex');
      const dummyPdfPath = path.join(actualOutputDir, `${baseName}.pdf`);
      fsExtra.ensureDirSync(actualOutputDir);
      fsExtra.writeFileSync(dummyPdfPath, 'dummy PDF content'); // Create a small dummy file

      callback(null, { stdout: 'pdflatex mock success', stderr: '' });
    });

    let pdfPath: string | undefined;
    try {
      pdfPath = await generatePdfFromData(pdfData);
      expect(pdfPath).toBeDefined();
      expect(typeof pdfPath).toBe('string');

      // Check if the (dummy) PDF file exists and is not empty
      expect(await fsExtra.pathExists(pdfPath!)).toBe(true);
      const stats = await fsExtra.stat(pdfPath!);
      expect(stats.size).toBeGreaterThan(0);

      // Check if .tex file was created (and contains replaced data - simplified check)
      const texPath = pdfPath!.replace(/\.pdf$/, ".tex");
      expect(await fsExtra.pathExists(texPath)).toBe(true);
      const texContent = await fsExtra.readFile(texPath, 'utf-8');
      expect(texContent).toContain(pdfData.NAME);
      expect(texContent).toContain(pdfData.EMAIL);
      expect(texContent).toContain(pdfData.PHONE);

    } finally {
      if (pdfPath) {
        const texPath = pdfPath.replace(/\.pdf$/, ".tex");
        const auxPath = pdfPath.replace(/\.pdf$/, ".aux");
        const logPath = pdfPath.replace(/\.pdf$/, ".log");
        await cleanupTempFiles(texPath, pdfPath, auxPath, logPath); // Clean up files created by the function
      }
    }
  });

  test('should throw an error if pdflatex fails', async () => {
    const pdfData = { NAME: "Failure Case", EMAIL: "fail@email.com", PHONE: "0000000000" };
    const errorMessage = "pdflatex simulated error";

    (require('child_process').exec as jest.Mock).mockImplementation((command, callback) => {
      // Simulate pdflatex error on the first call
      callback(new Error(errorMessage), { stdout: '', stderr: 'Some error output' });
    });

    await expect(generatePdfFromData(pdfData)).rejects.toThrow(`pdflatex (1st pass) failed`);

    // Check if cleanup was attempted for any files that might have been created by generatePdfFromData
    // (e.g., the .tex file before the mocked pdflatex call).
    // The generatePdfFromData function has its own try/catch/finally for cleanup.
    // We need to ensure no uniquely named files are left in backend/tmp from this failed attempt.
    // This is hard to assert directly without knowing the unique ID, but we can list 'tmp'
    // and expect it to be empty or only contain files from other concurrent tests if any.
    // For now, we trust the internal cleanup of generatePdfFromData.
    const tmpDir = path.join(__dirname, '..', '..', 'tmp');
    const files = await fsExtra.readdir(tmpDir);
    // This assertion might be too strict if other tests run concurrently or if previous failures left files.
    // A more robust way is to ensure files with "Failure Case" related names are gone.
    // For this test, we primarily care that the error was thrown.
  });
});
