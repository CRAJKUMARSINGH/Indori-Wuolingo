# 12 · Testing Checklist

Manual test steps to run before opening any PR. This project does not have automated tests yet — manual testing is the quality gate.

Run through the relevant sections based on what you changed.

---

## Always — run before every PR

```bash
pnpm run typecheck
```

Zero TypeScript errors required. No exceptions.

---

## Onboarding flow

Test after any change to `app/onboarding/` or `contexts/AppContext.tsx`:

- [ ] Open the app with no saved data (use Profile → Reset All Progress if needed)
- [ ] Welcome screen appears and "Get Started" button works
- [ ] Language screen: can type a name, select Hindi (other languages show "Soon")
- [ ] Name field is required — continue button is disabled when name is empty
- [ ] Goals screen: can select a daily goal and proficiency level
- [ ] Tapping "Start Learning!" navigates to the Home tab
- [ ] After completing onboarding, reopening the app goes directly to Home (not welcome)
- [ ] Profile screen shows the correct name and target language

---

## Home screen and lesson path

Test after any change to `app/(tabs)/index.tsx`, `contexts/AppContext.tsx → useUnlockedLessons`:

- [ ] First lesson of Unit 1 is unlocked (available to tap)
- [ ] All other lessons appear locked (padlock icon)
- [ ] Tapping a locked lesson does nothing
- [ ] Tapping an available lesson navigates to the lesson player
- [ ] After completing a lesson, it shows as completed (green checkmark) on the home screen
- [ ] The next lesson in the unit unlocks after completing the previous one
- [ ] XP, streak, and hearts in the header update correctly after completing a lesson

---

## Lesson player

Test after any change to `app/lesson/[lessonId].tsx`, `components/ExerciseView.tsx`:

- [ ] Progress bar fills as exercises are completed
- [ ] Hearts display matches the current heart count
- [ ] Correct answer: turns green, shows checkmark, advances after ~1.2 seconds
- [ ] Wrong answer: turns red, hearts decrease by 1, advances after ~1.2 seconds
- [ ] Cannot tap again after answering (options are disabled after first tap)
- [ ] Leaving the lesson mid-way shows a confirmation alert
- [ ] Leaving and confirming navigates back to Home
- [ ] Completing the last exercise navigates to the lesson complete screen
- [ ] If hearts reach 0: alert appears, tapping OK navigates back to Home
- [ ] On device: haptic feedback fires on correct (success) and wrong (error) answers

---

## MULTIPLE_CHOICE exercises

- [ ] All 4 options are visible and tappable
- [ ] Correct option highlights green on selection
- [ ] Wrong option highlights red on selection
- [ ] `promptScript` (Devanagari) displays correctly if present
- [ ] `hint` appears below the prompt if present

---

## WORD_ORDER exercises

- [ ] All word tiles appear in shuffled order
- [ ] Tapping a tile moves it to the answer row
- [ ] Tapping a placed tile moves it back to the bank
- [ ] Correct sentence: turns green and advances
- [ ] Wrong sentence: turns red and resets the tile positions
- [ ] Check button is disabled when no tiles are placed

---

## Lesson complete screen

Test after any change to `app/lesson/complete.tsx`:

- [ ] The unit's color is used as the gradient background
- [ ] XP counter animates from 0 to the earned amount
- [ ] Correct star count is shown (1–3 stars based on accuracy)
- [ ] Accuracy percentage is correct
- [ ] Streak count matches the updated streak
- [ ] "Continue" button navigates back to Home and the lesson shows as complete
- [ ] "Practice Again" button restarts the same lesson

---

## Practice / Review tab

- [ ] Empty state shows when no lessons are completed
- [ ] After completing a lesson, it appears in the "Spaced Review" list
- [ ] Tapping a lesson in the review list launches the lesson player
- [ ] Weak words (answered wrong in a lesson) appear in the "Weak Words" section
- [ ] Stats (lessons done, total XP, day streak) match the Profile tab

---

## Leaderboard tab

- [ ] Leaderboard renders without error
- [ ] Your entry is highlighted in the list
- [ ] Top 3 appear in the podium
- [ ] Rank order is correct (highest XP first)

---

## Profile tab

- [ ] Name and language match what was entered in onboarding
- [ ] XP, streak, lessons done, minutes studied are correct
- [ ] Per-unit progress bars update after completing a lesson
- [ ] Earned badges appear highlighted, unearned badges appear locked
- [ ] Reset progress button shows a confirmation alert
- [ ] After confirming reset: progress clears, redirects to onboarding

---

## New content (lessons / exercises)

Run after adding to `curriculum.ts`:

- [ ] The new lesson appears in the correct position in the home screen path
- [ ] The lesson is locked until the previous lesson is completed
- [ ] Each exercise in the new lesson completes correctly
- [ ] `correctIndex` is verified — the correct answer actually wins
- [ ] `correctSentence` in WORD_ORDER matches the tiles exactly
- [ ] New lesson completion awards the correct XP amount
- [ ] Any new badge condition triggers correctly

---

## Deployment (web export)

Run after changes to `app.json`, `vercel.json`, `netlify.toml`, or `package.json` scripts:

```bash
pnpm --filter @workspace/indori-wuolingo run build:web
```

- [ ] Build completes without errors
- [ ] `dist/` folder is created with `index.html` and `_expo/` assets
- [ ] Opening `dist/index.html` locally (or serving with `npx serve dist`) shows the app
- [ ] Navigation works (routes don't 404 on refresh in the served build)

---

## Notes

- Test on web for quick iteration
- Test on a real device for anything involving touch, haptics, or animations
- Test on both iOS and Android if your change touches platform-specific code (`Platform.OS === 'ios'`)
- If you cannot test on a specific platform, note it in the PR: `Tested on web and Android only. iOS not available.`
