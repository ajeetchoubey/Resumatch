import express from 'express';
import multer from 'multer';
import { supabase } from '../services/supabaseClient.js';
import { parseFile } from '../services/parserService.js';
import { analyzeResume } from '../services/geminiService.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/analyze
 * 
 * Option 1: Upload file directly (multipart/form-data)
 * - file: PDF/DOCX file
 * - jdText: Job description text
 * 
 * Option 2: Analyze existing file from Supabase Storage
 * - filePath: Path to file in Supabase Storage
 * - jdText: Job description text
 * - resumeId: ID of the resume record to update
 */
router.post('/analyze', upload.single('file'), async (req, res) => {
    try {
        const { jdText, filePath, resumeId } = req.body;
        let resumeText;
        let filename;

        // Validate job description
        if (!jdText || jdText.trim().length === 0) {
            return res.status(400).json({ error: 'Job description is required' });
        }

        // Option 1: File uploaded directly
        if (req.file) {
            filename = req.file.originalname;
            resumeText = await parseFile(req.file.buffer, filename);
        }
        // Option 2: File already in Supabase Storage
        else if (filePath) {
            const { data, error } = await supabase
                .storage
                .from('resumes')
                .download(filePath);

            if (error) {
                return res.status(404).json({ error: 'File not found in storage' });
            }

            const buffer = Buffer.from(await data.arrayBuffer());
            filename = filePath.split('/').pop();
            resumeText = await parseFile(buffer, filename);
        }
        else {
            return res.status(400).json({ error: 'Either file or filePath is required' });
        }

        // Analyze with Gemini
        const analysis = await analyzeResume(resumeText, jdText);

        // If resumeId provided, update the database record
        if (resumeId) {
            const { error: updateError } = await supabase
                .from('resumes')
                .update({
                    parsed_text: resumeText,
                    jd_text: jdText,
                    analysis_result: analysis,
                    status: 'complete'
                })
                .eq('id', resumeId);

            if (updateError) {
                console.error('Failed to update resume record:', updateError);
            }
        }

        res.json({
            success: true,
            filename,
            analysis,
            parsedTextLength: resumeText.length
        });

    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            error: 'Analysis failed',
            message: error.message
        });
    }
});

export default router;
