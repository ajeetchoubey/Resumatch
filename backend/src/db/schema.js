import { pgTable, uuid, text, integer, jsonb, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// ============================================
// ENUMS
// ============================================
export const analysisStatusEnum = pgEnum('analysis_status', ['processing', 'complete', 'failed']);

// ============================================
// USERS TABLE (synced from Supabase Auth)
// ============================================
export const users = pgTable('users', {
    id: uuid('id').primaryKey(), // matches auth.users.id
    email: text('email').notNull().unique(),
    fullName: text('full_name'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// RESUMES TABLE
// ============================================
export const resumes = pgTable('resumes', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    originalFilename: text('original_filename').notNull(),
    filePath: text('file_path').notNull(), // path in Supabase Storage
    parsedText: text('parsed_text'), // extracted text content
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// JOB DESCRIPTIONS TABLE (for saved/reusable JDs)
// ============================================
export const jobDescriptions = pgTable('job_descriptions', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(), // e.g., "Senior Frontend Engineer"
    company: text('company'), // e.g., "Google"
    content: text('content').notNull(), // the full JD text
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// ANALYSES TABLE
// ============================================
export const analyses = pgTable('analyses', {
    id: uuid('id').primaryKey().defaultRandom(),
    resumeId: uuid('resume_id').notNull().references(() => resumes.id, { onDelete: 'cascade' }),
    // Hybrid JD: either reference saved JD OR store ad-hoc text
    jdId: uuid('jd_id').references(() => jobDescriptions.id, { onDelete: 'set null' }),
    jdText: text('jd_text'), // for ad-hoc JD paste (one of jdId or jdText should be set)
    matchScore: integer('match_score'), // 0-100
    analysisResult: jsonb('analysis_result'), // Gemini's full response
    status: analysisStatusEnum('status').default('processing').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ============================================
// RESUME EMBEDDINGS TABLE (Phase 2)
// Uncomment after enabling pgvector extension in Supabase:
// Dashboard -> Database -> Extensions -> Search "vector" -> Enable
// ============================================
// import { vector } from 'drizzle-orm/pg-core';
// export const resumeEmbeddings = pgTable('resume_embeddings', {
//     id: uuid('id').primaryKey().defaultRandom(),
//     resumeId: uuid('resume_id').notNull().references(() => resumes.id, { onDelete: 'cascade' }),
//     section: text('section').notNull(),
//     contentHash: text('content_hash').notNull(),
//     embedding: vector('embedding', { dimensions: 768 }),
//     createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
// });
