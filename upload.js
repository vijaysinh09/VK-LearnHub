const fs = require('fs');

async function upload() {
  const data = JSON.parse(fs.readFileSync('courses_bulk_upload.json', 'utf8'));
  try {
    const res = await fetch('http://localhost:5000/courses/bulkupload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    console.log("Upload result:", result);
  } catch (err) {
    console.error("Failed to upload:", err.message);
  }
}
upload();
