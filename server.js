import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const FILE_DIR = path.join(__dirname, 'user_files');

// Ensure the user_files directory exists
try {
  await fs.access(FILE_DIR);
} catch {
  await fs.mkdir(FILE_DIR);
}

app.post('/api/create-file', async (req, res) => {
  const { filename, content } = req.body;
  const filePath = path.join(FILE_DIR, filename);

  try {
    await fs.writeFile(filePath, content);
    res.json({ success: true, message: `File ${filename} created successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: `Error creating file: ${error.message}` });
  }
});

app.post('/api/edit-file', async (req, res) => {
  const { filename, content } = req.body;
  const filePath = path.join(FILE_DIR, filename);

  try {
    await fs.writeFile(filePath, content);
    res.json({ success: true, message: `File ${filename} edited successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: `Error editing file: ${error.message}` });
  }
});

app.delete('/api/delete-file', async (req, res) => {
  const { filename } = req.body;
  const filePath = path.join(FILE_DIR, filename);

  try {
    await fs.unlink(filePath);
    res.json({ success: true, message: `File ${filename} deleted successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: `Error deleting file: ${error.message}` });
  }
});

// Read memory
app.get('/api/read-memory', async (req, res) => {
  const filePath = path.join(__dirname, 'memory', 'memory.json');
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.json({});
    } else {
      res.status(500).json({ success: false, message: 'Error reading memory file' });
    }
  }
});

// Write memory
app.post('/api/write-memory', async (req, res) => {
  const filePath = path.join(__dirname, 'memory', 'memory.json');
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(req.body.content, null, 2));
    res.json({ success: true, message: 'Memory updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error writing memory file' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
