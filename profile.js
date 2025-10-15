const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../db/pool');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, path.join(__dirname, '..', 'uploads')); },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).substr(2,9)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage, limits:{ fileSize:5*1024*1024 } });

router.post('/upload', upload.fields([{ name:'photo', maxCount:1 }, { name:'document', maxCount:1 }]), async (req, res) => {
  try {
    const userId = req.body.userId;
    const photoFile = req.files['photo'] ? req.files['photo'][0] : null;
    const docFile = req.files['document'] ? req.files['document'][0] : null;
    const updates = []; const params = [];
    if (photoFile) { updates.push('photo_url = ?'); params.push(`/uploads/${photoFile.filename}`); }
    if (docFile) { updates.push('document_url = ?'); params.push(`/uploads/${docFile.filename}`); }
    if (updates.length > 0) {
      params.push(userId);
      const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
      await pool.execute(sql, params);
    }
    res.json({ success:true, photo: photoFile ? `/uploads/${photoFile.filename}` : null, document: docFile ? `/uploads/${docFile.filename}` : null });
  } catch (err) {
    console.error(err); res.status(500).json({ success:false, message: err.message });
  }
});

module.exports = router;
