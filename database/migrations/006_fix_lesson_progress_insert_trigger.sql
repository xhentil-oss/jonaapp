USE appjonacademy_db;

-- trg_lesson_progress_refresh only fires on UPDATE, but the very first time a
-- student completes a lesson there is no existing lesson_progress row, so the
-- backend does an INSERT (not UPDATE) and the trigger never runs — enrollment
-- progress stays at 0 forever and certificates never auto-issue. This adds
-- the missing AFTER INSERT counterpart with the same recalculation logic.

DELIMITER //

CREATE TRIGGER trg_lesson_progress_insert
AFTER INSERT ON lesson_progress
FOR EACH ROW
BEGIN
  DECLARE v_total    INT;
  DECLARE v_done     INT;
  DECLARE v_progress DECIMAL(5,2);

  SELECT c.lessons_count INTO v_total
    FROM enrollments e
    JOIN courses c ON c.id = e.course_id
   WHERE e.id = NEW.enrollment_id;

  IF v_total IS NOT NULL AND v_total > 0 THEN
    SELECT COUNT(*) INTO v_done
      FROM lesson_progress
     WHERE enrollment_id = NEW.enrollment_id
       AND is_completed = 1;

    SET v_progress = ROUND((v_done / v_total) * 100, 2);

    UPDATE enrollments
       SET progress_percent = v_progress,
           status           = CASE WHEN v_progress >= 100 THEN 'perfunduar' ELSE 'aktiv' END,
           completed_at     = CASE WHEN v_progress >= 100 THEN NOW() ELSE NULL END
     WHERE id = NEW.enrollment_id;
  END IF;
END //

DELIMITER ;

-- Backfill: recompute progress for enrollments that already have completed
-- lessons but were never recalculated because of the missing trigger above.
-- This UPDATE still fires trg_auto_issue_certificate normally, so anyone who
-- already finished a course gets their certificate retroactively.
UPDATE enrollments e
JOIN courses c ON c.id = e.course_id
JOIN (
  SELECT enrollment_id, COUNT(*) AS done_count
  FROM lesson_progress
  WHERE is_completed = 1
  GROUP BY enrollment_id
) lp ON lp.enrollment_id = e.id
SET e.progress_percent = ROUND(lp.done_count / c.lessons_count * 100, 2),
    e.status = CASE WHEN lp.done_count / c.lessons_count * 100 >= 100 THEN 'perfunduar' ELSE 'aktiv' END,
    e.completed_at = CASE WHEN lp.done_count / c.lessons_count * 100 >= 100 AND e.completed_at IS NULL THEN NOW() ELSE e.completed_at END
WHERE c.lessons_count > 0;

