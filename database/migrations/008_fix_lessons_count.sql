USE appjonacademy_db;

-- lessons_count drifted: migration 004 pre-set it to the expected final
-- total, then migration 007 inserted the real lesson rows and the
-- AFTER INSERT trigger incremented on top of that, doubling it. Recompute
-- it from the actual lessons table so it's correct regardless of history.
UPDATE courses c
SET lessons_count = (SELECT COUNT(*) FROM lessons l WHERE l.course_id = c.id);
