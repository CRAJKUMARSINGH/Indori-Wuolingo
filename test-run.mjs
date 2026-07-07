/**
 * IndiLingo — Full robotic lesson test
 * 21 users × 15 languages × ALL lessons
 * Validates exercise payloads (including match_pairs) and completes each lesson via API.
 *
 * Usage:
 *   node test-run.mjs
 *   API_URL=http://localhost:3001/api node test-run.mjs
 */

const API = process.env.API_URL ?? "http://localhost:3001/api";
const USERS_PER_LANGUAGE = 21;
const EXPECTED_LANGUAGES = 15;

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  magenta: "\x1b[35m",
  blue: "\x1b[34m",
};

const log = {
  info: (msg) => console.log(`${COLORS.cyan}ℹ ${msg}${COLORS.reset}`),
  ok: (msg) => console.log(`${COLORS.green}✓ ${msg}${COLORS.reset}`),
  fail: (msg) => console.log(`${COLORS.red}✗ ${msg}${COLORS.reset}`),
  warn: (msg) => console.log(`${COLORS.yellow}⚠ ${msg}${COLORS.reset}`),
  header: (msg) => console.log(`\n${COLORS.bold}${COLORS.magenta}══ ${msg} ══${COLORS.reset}`),
  sub: (msg) => console.log(`  ${COLORS.dim}${msg}${COLORS.reset}`),
};

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: [],
  lessonsCompleted: 0,
  exercisesValidated: 0,
  usersCreated: 0,
  matchPairsValidated: 0,
};

async function api(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  return { status: res.status, data };
}

function assert(condition, label, detail = "") {
  results.total++;
  if (condition) {
    results.passed++;
    log.ok(`${label}${detail ? ` — ${detail}` : ""}`);
    return true;
  }
  results.failed++;
  const msg = `${label}${detail ? ` — ${detail}` : ""}`;
  results.errors.push(msg);
  log.fail(msg);
  return false;
}

function validateMatchPairs(exercise) {
  const half = exercise.options.length / 2;
  if (!Number.isInteger(half) || half < 1) {
    return { ok: false, reason: "options must split into two equal columns" };
  }

  let pairs;
  try {
    pairs = JSON.parse(exercise.correctAnswer);
  } catch {
    return { ok: false, reason: "correctAnswer is not valid JSON pairs" };
  }

  if (!Array.isArray(pairs) || pairs.length !== half) {
    return {
      ok: false,
      reason: `expected ${half} pairs, got ${Array.isArray(pairs) ? pairs.length : "invalid"}`,
    };
  }

  for (const pair of pairs) {
    if (!Array.isArray(pair) || pair.length !== 2) {
      return { ok: false, reason: "each pair must be [left, right]" };
    }
    if (!exercise.options.includes(pair[0]) || !exercise.options.includes(pair[1])) {
      return { ok: false, reason: `pair items must exist in options: ${JSON.stringify(pair)}` };
    }
  }

  const left = exercise.options.slice(0, half);
  const right = exercise.options.slice(half);
  for (let i = 0; i < pairs.length; i++) {
    const [a, b] = pairs[i];
    const expectedLeft = left[i];
    const expectedRight = right[i];
    const matches =
      (a === expectedLeft && b === expectedRight) ||
      (a === expectedRight && b === expectedLeft);
    if (!matches) {
      return {
        ok: false,
        reason: `pair ${JSON.stringify(pair)} does not align with column split at index ${i}`,
      };
    }
  }

  return { ok: true, pairCount: half };
}

function validateExercise(exercise, context) {
  results.exercisesValidated++;
  assert(typeof exercise.id === "number", `${context} exercise has numeric id`, `id=${exercise.id}`);
  assert(Boolean(exercise.type), `${context} exercise has type`, exercise.type);
  assert(typeof exercise.question === "string" && exercise.question.length > 0, `${context} exercise has question`);
  assert(typeof exercise.correctAnswer === "string", `${context} exercise has correctAnswer`);
  assert(Array.isArray(exercise.options) && exercise.options.length > 0, `${context} exercise has options`, `count=${exercise.options?.length ?? 0}`);

  if (exercise.type === "match_pairs") {
    const check = validateMatchPairs(exercise);
    assert(check.ok, `${context} match_pairs structure valid`, check.ok ? `${check.pairCount} pairs` : check.reason);
    if (check.ok) results.matchPairsValidated++;
  } else {
    assert(
      exercise.options.includes(exercise.correctAnswer),
      `${context} correctAnswer is in options`,
      exercise.correctAnswer,
    );
  }

  if (exercise.type === "script_practice") {
    assert(Boolean(exercise.nativeScript), `${context} script_practice has nativeScript`);
  }
}

async function checkHealth() {
  log.header("HEALTH CHECK");
  try {
    const { status, data } = await api("GET", "/healthz");
    assert(status === 200, "API is reachable", `${API}/healthz status=${status}`);
    assert(data?.status !== undefined, "Health response valid", JSON.stringify(data));
    return true;
  } catch (e) {
    log.fail(`Cannot reach API at ${API}/healthz — ${e.message}`);
    return false;
  }
}

async function getLanguages() {
  log.header("FETCH ALL LANGUAGES");
  const { status, data } = await api("GET", "/languages");
  assert(status === 200, "GET /languages returns 200");
  assert(Array.isArray(data), "Languages response is array");
  assert(data.length === EXPECTED_LANGUAGES, `Exactly ${EXPECTED_LANGUAGES} languages seeded`, `count=${data.length}`);
  if (Array.isArray(data)) {
    log.sub(data.map((l) => l.name).join(", "));
  }
  return Array.isArray(data) ? data : [];
}

async function getUnitsForLanguage(languageId, userId) {
  const path = userId
    ? `/users/${userId}/languages/${languageId}/units`
    : `/languages/${languageId}/units`;
  const { status, data } = await api("GET", path);
  if (status !== 200 || !Array.isArray(data)) return [];
  return data;
}

async function getLesson(lessonId) {
  const { status, data } = await api("GET", `/lessons/${lessonId}`);
  if (status !== 200) return null;
  return data;
}

async function createUser(name) {
  const { status, data } = await api("POST", "/users", { name });
  if (status !== 201) return null;
  results.usersCreated++;
  return data;
}

async function completeLesson(lessonId, userId, correctCount) {
  const { status, data } = await api("POST", `/lessons/${lessonId}/complete`, {
    userId,
    correctCount,
  });
  if (status !== 200) return { ok: false, data };
  results.lessonsCompleted++;
  return { ok: true, data };
}

function collectLessons(units) {
  const lessons = [];
  for (const unit of units) {
    for (const lesson of unit.lessons ?? []) {
      lessons.push({ ...lesson, unitTitle: unit.title });
    }
  }
  return lessons;
}

async function runTest() {
  console.log(`\n${COLORS.bold}${COLORS.blue}╔════════════════════════════════════════════════════════════╗`);
  console.log(`║  IndiLingo — 21 Users × 15 Languages × ALL Lessons Test   ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝${COLORS.reset}\n`);
  log.info(`API base: ${API}`);

  const healthy = await checkHealth();
  if (!healthy) process.exit(1);

  const languages = await getLanguages();
  if (languages.length === 0) process.exit(1);

  let langsTested = 0;
  let totalLessonsInCorpus = 0;
  const lessonCache = new Map();

  for (const language of languages) {
    log.header(`LANGUAGE: ${language.name} (${language.nativeName})`);

    const units = await getUnitsForLanguage(language.id, null);
    assert(units.length > 0, `${language.name} has units`, `count=${units.length}`);
    if (units.length === 0) continue;

    const lessons = collectLessons(units);
    assert(lessons.length > 0, `${language.name} has lessons`, `count=${lessons.length}`);
    if (lessons.length === 0) continue;

    totalLessonsInCorpus += lessons.length;
    log.sub(`${lessons.length} lessons across ${units.length} units`);

    for (const lessonMeta of lessons) {
      const lesson = await getLesson(lessonMeta.id);
      lessonCache.set(lessonMeta.id, lesson);
      assert(lesson !== null, `GET /lessons/${lessonMeta.id}`, lessonMeta.title);
      if (!lesson) continue;

      assert(
        Array.isArray(lesson.exercises) && lesson.exercises.length > 0,
        `Lesson "${lesson.title}" has exercises`,
        `count=${lesson.exercises?.length ?? 0}`,
      );

      for (let i = 0; i < (lesson.exercises?.length ?? 0); i++) {
        validateExercise(lesson.exercises[i], `${language.name} / ${lesson.title} / ex${i + 1}`);
      }
    }

    const langUsers = [];
    for (let i = 0; i < USERS_PER_LANGUAGE; i++) {
      const name = `${language.name.replace(/\s+/g, "_")}_Bot${String(i + 1).padStart(2, "0")}`;
      const user = await createUser(name);
      assert(user?.id !== undefined, `Create user "${name}"`, user ? `id=${user.id}` : "failed");
      if (user) langUsers.push(user);
    }

    for (const user of langUsers) {
      for (const lessonMeta of lessons) {
        const lesson = lessonCache.get(lessonMeta.id) ?? (await getLesson(lessonMeta.id));
        if (!lesson?.exercises?.length) continue;

        const perfectScore = lesson.exercises.length;
        const result = await completeLesson(lessonMeta.id, user.id, perfectScore);
        assert(
          result.ok,
          `User ${user.name} completes "${lessonMeta.title}"`,
          result.ok
            ? `xp=${result.data.xpEarned}, stars=${result.data.stars}, totalXp=${result.data.totalXp}`
            : JSON.stringify(result.data),
        );
      }
    }

    langsTested++;
    log.sub(`→ ${langUsers.length} users × ${lessons.length} lessons = ${langUsers.length * lessons.length} completions`);
  }

  log.header("LEADERBOARD CHECK");
  const { status, data: leaderboard } = await api("GET", "/leaderboard");
  assert(status === 200, "GET /leaderboard returns 200");
  assert(Array.isArray(leaderboard) && leaderboard.length > 0, "Leaderboard populated", `entries=${leaderboard?.length ?? 0}`);

  console.log(`\n${COLORS.bold}${COLORS.blue}╔════════════════════════════════════════════════════════════╗`);
  console.log(`║                     TEST SUMMARY                           ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝${COLORS.reset}`);
  console.log(`  Languages tested     : ${COLORS.green}${langsTested}${COLORS.reset} / ${EXPECTED_LANGUAGES}`);
  console.log(`  Unique lessons       : ${COLORS.green}${totalLessonsInCorpus}${COLORS.reset} per language corpus`);
  console.log(`  Users created        : ${COLORS.green}${results.usersCreated}${COLORS.reset} (target ${EXPECTED_LANGUAGES * USERS_PER_LANGUAGE})`);
  console.log(`  Lesson completions   : ${COLORS.green}${results.lessonsCompleted}${COLORS.reset}`);
  console.log(`  Exercises validated  : ${COLORS.green}${results.exercisesValidated}${COLORS.reset}`);
  console.log(`  match_pairs validated: ${COLORS.green}${results.matchPairsValidated}${COLORS.reset}`);
  console.log(`  Assertions           : ${COLORS.green}${results.passed} passed${COLORS.reset} / ${COLORS.red}${results.failed} failed${COLORS.reset} (total: ${results.total})`);

  if (results.errors.length > 0) {
    console.log(`\n${COLORS.red}${COLORS.bold}Failures (first 20):${COLORS.reset}`);
    results.errors.slice(0, 20).forEach((e) => console.log(`  ${COLORS.red}• ${e}${COLORS.reset}`));
    if (results.errors.length > 20) {
      console.log(`  ${COLORS.dim}… and ${results.errors.length - 20} more${COLORS.reset}`);
    }
  } else {
    console.log(`\n${COLORS.green}${COLORS.bold}All assertions passed.${COLORS.reset}`);
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

runTest().catch((e) => {
  log.fail(`Unexpected error: ${e.message}`);
  console.error(e);
  process.exit(1);
});
