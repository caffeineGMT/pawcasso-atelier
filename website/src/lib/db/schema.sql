-- Quality scores table for AI-generated portrait evaluation
CREATE TABLE IF NOT EXISTS quality_scores (
  id SERIAL PRIMARY KEY,
  portrait_id UUID UNIQUE NOT NULL,
  portrait_url TEXT NOT NULL,
  original_photo_url TEXT NOT NULL,
  order_id TEXT NOT NULL,
  score DECIMAL(3,1) NOT NULL CHECK (score >= 0 AND score <= 10),
  status VARCHAR(20) NOT NULL CHECK(status IN ('pending_review','approved','rejected')) DEFAULT 'pending_review',
  auto_approved BOOLEAN DEFAULT false,
  reviewer_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_status ON quality_scores(status);
CREATE INDEX IF NOT EXISTS idx_order ON quality_scores(order_id);
CREATE INDEX IF NOT EXISTS idx_created_at ON quality_scores(created_at DESC);
