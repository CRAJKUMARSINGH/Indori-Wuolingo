# 13 · Roles, Responsibilities, and How to Join

Everything about who does what, how contributors are recognized, and how to officially become a named contributor to Indori-Wuolingo.

---

## The three contributor roles

The project is optimized for a 3-person core team working asynchronously. Roles are not rigid titles — they describe the primary area each person focuses on. Everyone reviews code regardless of role.

---

### Role 1 — Mobile / UI

**Primary responsibility:** What users see and touch.

**Owns:**
- All screens in `app/` (onboarding, tabs, lesson, complete)
- `components/ExerciseView.tsx` and any new exercise renderers
- `constants/colors.ts` and the design token system
- Animations, haptics, and native feel
- `app/(tabs)/_layout.tsx` — tab bar configuration

**Day-to-day:**
- Implements new screens and UI features
- Ensures consistency across web and device
- Catches layout regressions and visual bugs
- Reviews all PRs that touch `app/` or `components/`

**Skills helpful:** React Native, Expo, TypeScript, UI design sense, Figma or Excalidraw for wireframes

---

### Role 2 — Content / Data

**Primary responsibility:** What users learn.

**Owns:**
- `data/curriculum.ts` — all lessons, exercises, units, badges
- Content quality: vocabulary accuracy, cultural relevance, difficulty curve
- Audio asset pipeline (recording, naming, placement)
- Language expert coordination for new language tracks

**Day-to-day:**
- Authors and reviews new lesson content
- Manages the content backlog (what units come next)
- Coordinates with native speakers and language reviewers
- Reviews all PRs that touch `data/`

**Skills helpful:** Hindi or target-language proficiency, content writing, audio editing, spreadsheet management for large content batches

---

### Role 3 — Platform / QA

**Primary responsibility:** Everything works and ships reliably.

**Owns:**
- `contexts/AppContext.tsx` — state, persistence, streak logic
- `vercel.json`, `netlify.toml`, build pipeline
- TypeScript health (`pnpm run typecheck` always passes)
- Release tagging and changelog
- Bug triage — routing reported bugs to the right person
- `package.json` dependencies and upgrades

**Day-to-day:**
- Reviews all PRs for correctness and edge cases
- Runs manual QA checklist before releases
- Catches regressions in gamification logic
- Monitors the deployed app for errors
- Upgrades Expo SDK, dependencies, and tooling

**Skills helpful:** TypeScript, CI/CD, Expo build system, debugging AsyncStorage persistence, attention to detail

---

## Rotating responsibilities

Roles are a starting point, not a permanent assignment. They rotate when:
- A contributor wants to work in a different area
- Workload becomes unbalanced
- The team grows and roles need to split further

Rotation is announced in the team channel and reflected in this file.

---

## How to become a contributor

There is no application form. Contribution is the process.

### Path 1 — Code or content contribution

1. **Set up the project** — follow [01-getting-started.md](./01-getting-started.md)
2. **Find an issue** — look for `good first issue` or `help wanted` labels on GitHub
3. **Make your first PR** — follow [03-how-to-contribute.md](./03-how-to-contribute.md)
4. **Get it merged** — once your first PR is approved and merged, you are a contributor
5. **Get added to the contributors list** — open a PR that adds your name to `CONTRIBUTORS_LIST.md`

No prior experience with Expo, React Native, or Hindi is required for your first contribution. Bug reports, documentation improvements, and small content fixes are all valid first contributions.

### Path 2 — Language expertise

If you speak one of the target Indian languages fluently:
1. Reach out via a GitHub Issue tagged `language-contribution`
2. Describe your background and the language you can help with
3. Review a sample of existing content and provide corrections
4. Once you have reviewed content that gets merged, you are a contributor

### Path 3 — Audio recording

If you are a native speaker willing to record audio assets:
1. Open a GitHub Issue tagged `audio-needed`
2. A maintainer will provide a word list and recording spec
3. Record and submit the files via PR
4. Once merged, you are a contributor

---

## The contributors list

All contributors are listed in `CONTRIBUTORS_LIST.md` at the repository root.

Format:

```markdown
| Name | GitHub | Role | Contributions |
|---|---|---|---|
| Priya Sharma | @priyasharma | Content / Hindi | Units 1–3 content, badge system |
| Rohan Mehta | @rohanmehta | Mobile / UI | Lesson player, ExerciseView |
| Kavya Iyer | @kavyaiyer | Platform / QA | Build pipeline, AppContext |
```

To add yourself:
1. Open a PR that adds your row to `CONTRIBUTORS_LIST.md`
2. Reference your merged PR(s) in the description
3. A maintainer approves and merges

---

## Permissions and access

| Level | Who has it | What they can do |
|---|---|---|
| **Contributor** | Anyone with a merged PR | Open issues, comment, open PRs |
| **Reviewer** | Regular contributors (3+ merged PRs) | Request changes, approve PRs |
| **Maintainer** | Core 3-person team | Merge PRs, push tags, manage settings |

Maintainer access is extended manually by existing maintainers after demonstrated consistent contribution.

---

## Code of conduct (short version)

- Be direct and respectful in reviews
- Criticism is about code and content — never about people
- Assume good intent
- Ask before making large architectural changes
- Keep decisions that affect the whole repo in GitHub Issues, not private chat

---

## Recognizing contributions

All of these count toward being named a contributor:

| Type | Example |
|---|---|
| Code | New screen, exercise type, bug fix |
| Content | Lesson exercises, badge definitions |
| Audio | Native speaker recordings |
| Language review | Correcting translations or script |
| Documentation | Improving this folder |
| QA | Filing a detailed bug report |
| Design | Providing Figma mockups or design feedback |
| PR review | Substantive review comments on merged PRs |

There is no minimum size. A one-line fix that improves the experience counts the same as a new feature.

---

## Current core team

| Name | Role | Focus |
|---|---|---|
| _(add yourself here)_ | Mobile / UI | Screens, animations, design |
| _(add yourself here)_ | Content / Data | Curriculum, Hindi accuracy |
| _(add yourself here)_ | Platform / QA | Build, testing, releases |
