import request from 'supertest';
import app from '../server'; // Import the Express app
import fsExtra from 'fs-extra';
import path from 'path';

// Mock pdfGenerator.ts to prevent actual PDF generation during API tests
// and to control its behavior for different test cases.
import { generatePdfFromData, cleanupTempFiles } from '../pdfGenerator';
jest.mock('../pdfGenerator', () => ({
  generatePdfFromData: jest.fn(),
  cleanupTempFiles: jest.fn(),
}));

const mockGeneratePdfFromData = generatePdfFromData as jest.MockedFunction<typeof generatePdfFromData>;
const mockCleanupTempFiles = cleanupTempFiles as jest.MockedFunction<typeof cleanupTempFiles>;

describe('PDF Generation API', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock usage after each test
  });

  describe('POST /api/generate-pdf', () => {
    test('should return a PDF for valid data', async () => {
      const validData = { NAME: "Jane Doe API", EMAIL: "jane.api@example.com", PHONE: "555-9876" };
      const mockPdfPath = path.join(__dirname, '..', '..', 'tmp', 'test_api_output.pdf'); // Dummy path

      // Create a dummy PDF file for res.sendFile to use
      await fsExtra.ensureDir(path.dirname(mockPdfPath));
      await fsExtra.writeFile(mockPdfPath, 'dummy PDF content for API test');

      mockGeneratePdfFromData.mockResolvedValue(mockPdfPath);
      mockCleanupTempFiles.mockResolvedValue(undefined); // Simulate successful cleanup

      const response = await request(app)
        .post('/api/generate-pdf')
        .send(validData)
        .expect('Content-Type', /pdf/)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.length).toBeGreaterThan(0); // Check if some data is received
      expect(mockGeneratePdfFromData).toHaveBeenCalledWith(validData);
      // Supertest handles the actual file sending, so we don't get res.sendFile's callback easily here.
      // We trust that if sendFile was called with a valid path, and cleanup was mocked, it's okay.
      // The cleanup mock being called would be a good check, but res.sendFile's callback makes it tricky.
      // Instead, we'll verify that after the request, the dummy file is gone (simulating cleanup)
      // This requires the server's cleanup to be robust or for us to call it.
      // For now, we verify generatePdfFromData was called. The server's internal cleanup logic is tested implicitly.
      // Await a small delay for the async res.sendFile callback and cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(mockCleanupTempFiles).toHaveBeenCalled();


      // Clean up the dummy file explicitly as part of the test, since the server's cleanup is mocked path-wise
      await fsExtra.remove(mockPdfPath);
    });

    test('should return 400 if required data is missing', async () => {
      const invalidData = { NAME: "Missing Email" }; // Missing EMAIL and PHONE

      const response = await request(app)
        .post('/api/generate-pdf')
        .send(invalidData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Missing required fields');
      expect(mockGeneratePdfFromData).not.toHaveBeenCalled();
    });

    test('should return 500 if PDF generation fails', async () => {
      const validData = { NAME: "Error Case", EMAIL: "error@example.com", PHONE: "111-2222" };
      const errorMessage = "Simulated PDF generation error";

      mockGeneratePdfFromData.mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .post('/api/generate-pdf')
        .send(validData)
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Failed to generate PDF');
      expect(response.body.details).toContain(errorMessage);
      expect(mockGeneratePdfFromData).toHaveBeenCalledWith(validData);
      // Check if cleanup was called by generatePdfFromData's own error handling
      // This depends on how the mock is set up and if the original function's finally block calls it.
      // Since we fully mocked generatePdfFromData, its internal cleanup call won't happen unless we mock that too.
      // The server's own catch block for generatePdfFromData doesn't explicitly call cleanupTempFiles.
    });
  });
});
