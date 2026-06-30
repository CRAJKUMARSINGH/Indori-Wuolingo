# Indori-Wuolingo — 200-Week Action Plan

**Duration:** 200 weeks (~3 years 10 months)
**Start baseline:** Working English → Hindi MVP with 3 units, 7 lessons, and core gamification
**End goal:** India's leading mobile Indian language learning platform with 5+ languages, 100k+ active users, and sustainable revenue

---

## How to read this plan

Each phase has a theme, a goal, and week-by-week tasks organized by workstream:

| Symbol | Workstream |
|---|---|
| 🏗 | Engineering & product |
| 📚 | Content & curriculum |
| 🎨 | Design & UX |
| 📣 | Growth & marketing |
| 💰 | Monetization |
| 🔧 | Ops, infra & team |

Tasks marked **[P1]** are must-do for the phase to succeed. Tasks marked **[P2]** should be done if bandwidth allows. Tasks marked **[P3]** are stretch goals.

---

## Phase 0 — Foundation (Weeks 1–4)

**Theme:** Lock the fundamentals before building more.
**Goal:** Stable repo, contributor workflow active, app working on all target devices.

### Week 1
- 🏗 [P1] Verify app runs cleanly on iOS, Android (Expo Go), and web
- 🏗 [P1] Set up GitHub repository with branch protection on `main`
- 🔧 [P1] Add CI pipeline — typecheck on every PR (GitHub Actions)
- 🔧 [P1] All three contributors onboarded: clone, install, run locally
- 📚 [P1] Audit all 45+ existing exercises for Hindi script accuracy

### Week 2
- 🏗 [P1] Fix any bugs found during Week 1 audit
- 🏗 [P1] Add error boundaries to all major screens
- 🔧 [P1] Set up issue templates on GitHub (bug, feature, content request)
- 🔧 [P1] Assign contributor roles per `contrib/CONTRIBUTING.md`
- 📚 [P2] Have a native Hindi speaker review Unit 1 exercises

### Week 3
- 🏗 [P1] Add proper loading states across all screens
- 🏗 [P1] Fix any AsyncStorage edge cases (first launch, corrupted data)
- 🎨 [P1] Polish onboarding screen animations
- 🎨 [P2] Improve lesson node visual path (zigzag pattern on wide screens)
- 📚 [P1] Add 2 more lessons to Unit 1 (Greetings: Days of the week, Time of day)

### Week 4
- 🏗 [P1] Add app version display on Profile screen
- 🏗 [P2] Add basic crash/error logging (console for now, Sentry later)
- 📚 [P1] Add Unit 4 skeleton: Colors (रंग)
- 🔧 [P1] Document all known issues in GitHub Issues
- 🔧 [P1] Establish weekly sync rhythm for the three contributors

---

## Phase 1 — Lesson Engine Expansion (Weeks 5–16)

**Theme:** Build the full lesson engine and expand content significantly.
**Goal:** 5 units, 20+ lessons, 3 exercise types, smooth learning loop.

### Week 5
- 🏗 [P1] Design and implement `listen_and_choose` exercise type (audio simulation)
- 🏗 [P1] Add `arrange_words` exercise type — tap words in correct order
- 📚 [P1] Add Unit 4 lessons: Colors (redness, greenness, blue, yellow, white, black)

### Week 6
- 🏗 [P1] Integrate audio playback using `expo-av` for pre-recorded Hindi word audio
- 🏗 [P1] Record or source 50 native Hindi word audio files
- 📚 [P1] Add audio metadata to curriculum.ts (audioUrl field per word)

### Week 7
- 🏗 [P1] Add `match_pairs` exercise type — drag left word to right translation
- 🎨 [P1] Redesign lesson complete screen with confetti animation
- 📚 [P1] Add Unit 5: Food & Drink (खाना-पीना) — 3 lessons, 18 exercises

### Week 8
- 🏗 [P1] Implement daily streak reminder system (local push notifications via `expo-notifications`)
- 🏗 [P1] Add streak freeze mechanic (1 free freeze per week)
- 🎨 [P2] Add animated XP counter on lesson complete screen

### Week 9
- 🏗 [P1] Build spaced repetition review engine — resurface words with high error rates
- 🏗 [P1] Add "Review" mode to Practice tab, pulling from `wordErrors` in ProgressContext
- 📚 [P2] Tag all existing exercises with `difficulty: 1 | 2 | 3` for review prioritization

### Week 10
- 📚 [P1] Add Unit 6: Travel & Directions (यात्रा) — 3 lessons, 18 exercises
- 🏗 [P1] Add lesson time tracking (minutes spent per session)
- 🔧 [P1] Set up basic analytics event logging (local for now) — lesson started, completed, abandoned

### Week 11
- 🎨 [P1] Full UI audit and refinement sprint — padding, typography, color consistency
- 🎨 [P1] Add dark mode support
- 🏗 [P2] Implement adaptive difficulty — easier options if user has 3+ errors in a session

### Week 12
- 🏗 [P1] Add script tracing exercise — show stroke order for Devanagari characters
- 📚 [P1] Create standalone "Script School" mini-unit — learn to read 15 key Devanagari characters
- 📚 [P1] Add 10 more audio files

### Week 13
- 🏗 [P1] Build leaderboard screen (local, comparing user's XP over time as a solo ranking)
- 🏗 [P2] Add weekly XP summary notification
- 📚 [P1] Add Unit 7: Shopping (बाज़ार) — 2 lessons, 12 exercises

### Week 14
- 🏗 [P1] Add offline detection and graceful handling
- 🏗 [P1] Implement resume-lesson feature (save progress mid-lesson)
- 🎨 [P2] Add heart refill animation and countdown timer

### Week 15
- 📚 [P1] Content QA sprint — all 7 units reviewed by native speaker
- 🏗 [P1] Fix all reported content and UI bugs
- 🔧 [P1] Write internal release notes for Phase 1 completion

### Week 16
- 🏗 [P1] Full regression test all screens and flows
- 📚 [P2] Add 20 more audio files (target: 70 total)
- 🔧 [P1] Tag `v0.2.0` in git
- 🔧 [P1] Prepare Phase 2 plan and share with all contributors

---

## Phase 2 — Beta Launch (Weeks 17–24)

**Theme:** Get the app in front of real users and fix what breaks.
**Goal:** 50 beta testers, lesson completion data, Day-7 retention measured.

### Week 17
- 🔧 [P1] Set up TestFlight (iOS) and Google Play Internal Testing (Android)
- 🔧 [P1] Build and submit first beta builds
- 🏗 [P1] Integrate Sentry for crash reporting (both mobile and web)
- 📣 [P1] Identify 50 target beta testers (friends, community members, Reddit language learners)

### Week 18
- 📣 [P1] Invite all 50 beta testers with onboarding instructions
- 🏗 [P1] Add PostHog analytics — track lesson started, completed, session length, screen views
- 📣 [P1] Create beta feedback form (Google Form or Notion)

### Week 19
- 🔧 [P1] Review first week of beta feedback and crash reports
- 🏗 [P1] Fix all P0 and P1 bugs from beta feedback
- 📣 [P2] Conduct 5 live user interviews (video call, screen share)
- 📚 [P2] Add any missing vocabulary flagged by beta users

### Week 20
- 🏗 [P1] Fix all P2 bugs from beta feedback
- 🎨 [P1] Improve onboarding based on drop-off data
- 📣 [P1] Share progress update with beta testers

### Week 21
- 🏗 [P1] Add in-app feedback button (shake to report)
- 📚 [P1] Add content requested by beta testers (up to 2 new lessons)
- 🏗 [P2] Implement referral tracking for early growth

### Week 22
- 📣 [P1] Run second beta cohort onboarding (expand to 150 users)
- 🏗 [P1] A/B test onboarding Goal screen (3 options vs 4 options)
- 🎨 [P2] Polish Profile screen based on usage data

### Week 23
- 🔧 [P1] Analyze 4-week beta retention: D1, D7, D14
- 🏗 [P1] Fix top 5 drop-off points identified in analytics
- 📚 [P1] Ensure all 7 units are complete and tested

### Week 24
- 🔧 [P1] Final beta QA pass
- 🔧 [P1] Submit iOS app to App Store review
- 🔧 [P1] Submit Android app to Play Store review
- 📣 [P1] Prepare launch week content (social posts, blog, announcement)

---

## Phase 3 — Public Launch (Weeks 25–32)

**Theme:** Go live and build initial user base.
**Goal:** 1,000 downloads, 200 DAU, first press coverage.

### Week 25 — Launch Week
- 📣 [P1] App Store and Play Store go live
- 📣 [P1] Post launch announcement on Reddit (r/languagelearning, r/india, r/hindi)
- 📣 [P1] Post on Twitter/X, LinkedIn, Instagram
- 📣 [P1] Submit to Product Hunt
- 📣 [P2] Reach out to 10 Indian language learning communities

### Week 26
- 🔧 [P1] Monitor crash reports and fix launch bugs within 48 hours
- 📣 [P1] Engage with all App Store and Play Store reviews
- 📣 [P1] Post daily on social during launch week
- 📣 [P2] Pitch to 5 tech journalists or India-focused newsletters

### Week 27
- 🏗 [P1] Analyze first-week data: installs, sessions, D1 retention
- 📣 [P1] Run first user acquisition campaign on Instagram (small budget: $50)
- 📚 [P1] Add 2 bonus lessons for users who complete all 7 units

### Week 28
- 🎨 [P1] App Store screenshot and listing optimization based on first-week data
- 📣 [P1] Reach out to Hindi-language YouTubers and educators for partnership
- 🏗 [P2] Add "Share score" feature — users can share lesson complete cards

### Week 29
- 📣 [P1] Launch email newsletter for users who sign up on the web
- 🏗 [P1] Build simple web landing page at indori.app (or similar)
- 📚 [P2] Add festival-themed bonus content (Diwali, Holi vocabulary)

### Week 30
- 🔧 [P1] Review 4-week post-launch metrics and adjust strategy
- 🏗 [P1] Implement deep links for sharing specific lessons
- 📣 [P2] Submit to 5 more app directories and education marketplaces

### Week 31
- 📣 [P1] Run second acquisition campaign targeting diaspora users
- 🏗 [P2] Add Apple Watch complication for daily streak check
- 📚 [P1] Launch Unit 8: Work & School (काम-स्कूल) — 3 lessons

### Week 32
- 🔧 [P1] Full metrics review: Downloads, DAU, D7 retention, session length
- 🔧 [P1] Tag `v1.0.0` — first stable public release milestone
- 📣 [P1] Publish case study blog post: "How we built an Indian language learning app in 32 weeks"

---

## Phase 4 — Growth & Retention (Weeks 33–52)

**Theme:** Grow the user base and dramatically improve retention.
**Goal:** 5,000 DAU, D30 retention above 25%, 15+ lessons completed per active user.

### Weeks 33–36 — Engagement Mechanics
- 🏗 [P1] Add friend challenges — invite a friend, compete on weekly XP
- 🏗 [P1] Build weekly leaderboard among friends (requires simple backend + accounts)
- 🔧 [P1] Launch backend user accounts with email auth (Replit Auth or similar)
- 🏗 [P1] Migrate AsyncStorage data to backend on first sign-in

### Weeks 37–40 — Content Volume
- 📚 [P1] Expand to 12 units and 30+ lessons for Hindi
- 📚 [P1] Add 100 more Hindi audio files (target: 200 total)
- 📚 [P1] Launch "Culture & Festivals" unit — Bollywood references, festivals, food names
- 📚 [P2] Add grammar hint cards within lessons (not exercises, just reference tooltips)

### Weeks 41–44 — Social & Sharing
- 🏗 [P1] Build streak share cards — custom shareable image with user's streak count
- 📣 [P1] Run user-generated content campaign — users post their Hindi words learned
- 🎨 [P1] Redesign Profile screen with shareable public profile link
- 📣 [P2] Partner with 2 Indian language schools for classroom pilot

### Weeks 45–48 — Push Notification Optimization
- 🏗 [P1] A/B test push notification timing (morning vs evening)
- 🏗 [P1] Add personalized notification copy based on streak length
- 🏗 [P1] Implement streak save notification (send 1 hour before midnight if not yet studied)
- 🔧 [P1] Review notification open rates and iterate

### Weeks 49–52 — Year 1 Review
- 🔧 [P1] Full product and business review: what worked, what did not
- 📣 [P1] Publish "Year 1 in numbers" post on social and newsletter
- 🔧 [P1] Set budget and headcount plan for Year 2
- 🔧 [P2] Apply to relevant startup programs or grants (DPIIT, Startup India, EdTech accelerators)
- 📣 [P1] Launch referral program — invite friends for bonus XP or hearts

---

## Phase 5 — Language Expansion (Weeks 53–80)

**Theme:** Add the second Indian language and prove the content platform scales.
**Goal:** 2 fully playable language tracks, 10,000 DAU.

### Weeks 53–56 — Platform Preparation
- 🏗 [P1] Refactor curriculum.ts to support multiple language tracks
- 🏗 [P1] Add language selection to onboarding (English → Hindi or English → Marathi)
- 🔧 [P1] Hire or contract 1 Marathi language content specialist
- 📚 [P1] Design Marathi curriculum structure (same unit structure as Hindi)

### Weeks 57–64 — Marathi Track Build
- 📚 [P1] Build 5 Marathi units with 15 lessons and 90+ exercises
- 📚 [P1] Source or record 100 Marathi audio files
- 🏗 [P1] Add Marathi Devanagari script exercises (Marathi uses the same script as Hindi)
- 🎨 [P1] Add language-specific color theming

### Weeks 65–68 — Marathi Beta
- 📣 [P1] Recruit 100 Marathi-speaker beta testers from Maharashtra communities
- 🔧 [P1] Content QA by native Marathi speaker
- 🏗 [P1] Fix all Marathi-track bugs
- 📣 [P2] Partner with Marathi-language media or YouTube channels

### Weeks 69–72 — Marathi Public Launch
- 📣 [P1] Announce Marathi track — press release, social, community posts
- 📣 [P1] Target diaspora Marathi-speaking communities outside India
- 🔧 [P1] Monitor Marathi-track D1 and D7 retention separately

### Weeks 73–76 — Tamil Track Planning
- 🔧 [P1] Hire Tamil language content specialist
- 🏗 [P1] Add Tamil script support (new script, requires Unicode rendering check on Android)
- 📚 [P1] Build Tamil curriculum skeleton: 5 units, lesson outlines
- 🏗 [P2] Add script selector in onboarding for Tamil (shows Tamil script vs romanization)

### Weeks 77–80 — Consolidation
- 🔧 [P1] Review multi-language platform performance
- 📚 [P1] Bring Hindi track to 50+ lessons
- 🏗 [P1] Build content management internal tool (simple web UI to add exercises without code changes)
- 🔧 [P2] Explore partnership with NCERT or state education boards

---

## Phase 6 — Monetization (Weeks 81–120)

**Theme:** Build sustainable revenue without harming the free experience.
**Goal:** $10,000 MRR, positive unit economics, subscription churn below 15% monthly.

### Weeks 81–88 — Monetization Design
- 💰 [P1] Define free vs premium feature split
  - Free: 5 lessons/day, 3 hearts per session, basic practice
  - Premium: unlimited lessons, unlimited hearts, offline mode, advanced review, speaking practice
- 💰 [P1] Integrate RevenueCat for iOS and Android in-app purchases
- 🏗 [P1] Build paywall screen with clear value proposition
- 🎨 [P1] Design premium badge and profile indicator

### Weeks 89–92 — Subscription Launch
- 💰 [P1] Launch monthly subscription (₹199/month or $3.99/month)
- 💰 [P1] Launch annual subscription (₹999/year or $17.99/year) with 20% discount display
- 📣 [P1] Send announcement to all existing users with 7-day free trial offer
- 🔧 [P1] Track conversion rate, trial-to-paid, and churn from day one

### Weeks 93–96 — Speaking Practice (Premium Feature)
- 🏗 [P1] Integrate speech-to-text for pronunciation scoring (basic word-level matching)
- 🏗 [P1] Build speaking exercise screen with record/playback/score UI
- 📚 [P1] Add speaking exercises to 10 existing lessons (one per lesson)
- 📣 [P1] Market speaking practice as key premium differentiator

### Weeks 97–104 — B2B Exploration
- 💰 [P1] Design and build "Teams" plan for institutions (schools, coaching centers)
- 💰 [P1] Contact 20 Hindi-medium schools, coaching institutes, and corporate HR departments
- 💰 [P2] Build teacher dashboard: class progress, completion rates
- 📣 [P2] Attend 2 EdTech conferences or education expos in India

### Weeks 105–112 — Pricing Optimization
- 💰 [P1] A/B test pricing: ₹149 vs ₹199 monthly
- 💰 [P1] Test annual pre-paid discount messaging
- 🔧 [P1] Review conversion funnel — where do users drop from paywall
- 🏗 [P1] Add "Family plan" for up to 4 members at ₹499/month

### Weeks 113–120 — Revenue Milestone Review
- 🔧 [P1] Review subscription metrics: MRR, churn, LTV
- 💰 [P1] Launch gift subscription feature for festive seasons
- 📣 [P1] Referral-to-subscription campaign: refer a friend, both get 2 free months
- 🔧 [P1] Project path to $10k MRR and revise plan accordingly

---

## Phase 7 — Platform Maturity (Weeks 121–160)

**Theme:** Become a complete learning platform, not just a lesson app.
**Goal:** 50,000 DAU, 5 language tracks, strong brand, institutional customers.

### Weeks 121–128 — Tamil Track Launch
- 📚 [P1] Complete Tamil track: 5 units, 15 lessons, 90+ exercises, 100 audio files
- 🏗 [P1] Verify Tamil Unicode rendering on all Android versions
- 📣 [P1] Launch Tamil track with targeted campaign in Tamil Nadu and Tamil diaspora

### Weeks 129–136 — Bengali Track
- 🔧 [P1] Hire Bengali content specialist
- 📚 [P1] Build Bengali track: 5 units, 15 lessons
- 🏗 [P1] Add Bengali script support (separate script from Devanagari)
- 📣 [P1] Launch in West Bengal and Bangladesh diaspora communities

### Weeks 137–144 — AI-Assisted Learning
- 🏗 [P1] Integrate AI for conversational practice (simple Hindi/English chatbot)
- 🏗 [P1] Build "conversation mode" — guided AI dialogue with scoring
- 📣 [P1] Market as premium feature: "Practice real conversations with AI"
- 🔧 [P2] Explore LLM-assisted content generation for exercise creation

### Weeks 145–152 — Web Platform
- 🏗 [P1] Launch proper web app (responsive, not just Expo web) at indori.app
- 🏗 [P1] Enable web-to-mobile sync (account-based, not AsyncStorage)
- 📣 [P1] Target desktop learners: diaspora, students, professionals
- 🎨 [P1] Design web-specific UI (wider layout, keyboard navigation)

### Weeks 153–160 — Institutional Growth
- 💰 [P1] Sign first 5 institutional B2B contracts
- 🔧 [P1] Build admin portal for institutions: student management, progress reports
- 📣 [P2] Publish academic case study with early classroom pilot data
- 💰 [P2] Apply for government language promotion grants (Hindi Prachar Sabha, state programs)

---

## Phase 8 — Scale & Leadership (Weeks 161–200)

**Theme:** Become India's go-to Indian language learning platform.
**Goal:** 100,000 DAU, 7+ language tracks, Series A funding conversation, editorial presence.

### Weeks 161–168 — Telugu Track
- 📚 [P1] Launch Telugu track: 5 units, 15 lessons
- 🏗 [P1] Telugu script support
- 📣 [P1] Launch campaign in Telangana and Andhra Pradesh communities

### Weeks 169–176 — Gujarati Track
- 📚 [P1] Launch Gujarati track: 5 units, 15 lessons
- 📣 [P1] Target Gujarati diaspora (large UK, US, East Africa communities)
- 💰 [P1] Premium plan localized pricing for key diaspora markets

### Weeks 177–184 — Community & Creator Features
- 🏗 [P1] Launch community challenges — monthly group learning events
- 🏗 [P2] Build user-contributed phrase submissions (community can suggest new words)
- 📣 [P1] Launch "Word of the Day" push notification with cultural context
- 🎨 [P2] Build custom avatar system with Indian cultural elements

### Weeks 185–192 — Business Scaling
- 💰 [P1] Target $100k ARR milestone
- 🔧 [P1] Hire first full-time content editor
- 🔧 [P1] Hire growth/marketing specialist
- 💰 [P2] Explore Series A conversations with EdTech-focused investors

### Weeks 193–196 — Platform Solidification
- 🏗 [P1] Full backend infrastructure audit — scalability, cost, reliability
- 🔧 [P1] SOC 2 or ISO 27001 preparation (if pursuing enterprise contracts)
- 📚 [P1] Reach 100+ lessons for Hindi, 50+ for each other language
- 🔧 [P1] Write internal "State of the Platform" document

### Weeks 197–200 — 200-Week Retrospective
- 🔧 [P1] Full product retrospective: all metrics against plan
- 📣 [P1] Publish "4 years of Indori-Wuolingo" public story
- 🔧 [P1] Set 3-year strategic plan for next phase
- 📣 [P2] Apply to appear in 5 major media outlets or podcasts
- 🔧 [P1] Celebrate with the team — recognize contributions of all three founding contributors

---

## Quarterly milestone summary

| Quarter | Weeks | Key milestone |
|---|---|---|
| Q1 | 1–12 | Stable app, 5 exercise types, 20+ lessons |
| Q2 | 13–24 | Beta launch, App Store live, 1k downloads |
| Q3 | 25–36 | 5k DAU, friends leaderboard, accounts |
| Q4 | 37–52 | Year 1 review, referral program, 10k DAU target |
| Q5 | 53–64 | Marathi track live |
| Q6 | 65–80 | Tamil planning, 50+ Hindi lessons |
| Q7 | 81–92 | Subscription launched, RevenueCat live |
| Q8 | 93–104 | Speaking practice, B2B exploration |
| Q9 | 105–116 | Pricing optimization, $5k MRR |
| Q10 | 117–128 | $10k MRR, Tamil launch |
| Q11 | 129–140 | Bengali track, AI conversation practice |
| Q12 | 141–152 | Web platform, 50k DAU target |
| Q13 | 153–164 | 5 institutional contracts, Telugu launch |
| Q14 | 165–176 | Gujarati launch, 7 language tracks |
| Q15 | 177–188 | Community features, $100k ARR target |
| Q16 | 189–200 | 100k DAU, Series A readiness, 4-year retrospective |

---

## Key metrics to track every week

| Metric | Target at Week 52 | Target at Week 100 | Target at Week 200 |
|---|---|---|---|
| DAU | 5,000 | 30,000 | 100,000 |
| D1 retention | 45% | 50% | 55% |
| D7 retention | 22% | 28% | 35% |
| D30 retention | 12% | 18% | 25% |
| Lessons completed / DAU | 1.5 | 2.0 | 2.5 |
| Streak continuation rate | 40% | 50% | 60% |
| MRR | $0 | $5,000 | $100,000+ |
| Language tracks | 1 | 3 | 7 |
| Total lessons | 30 | 80 | 200+ |

---

## Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Content quality problems | High | High | Native speaker review every 4 weeks |
| Slow user growth | Medium | High | Focus on referral loops and community before paid acquisition |
| Contributor burnout on a 3-person team | High | High | Keep weekly scope small, rotate hard tasks, take planned breaks |
| Competitor copies the concept | Medium | Medium | Build community and brand moat early, not just features |
| Audio licensing problems | Low | Medium | Source own recordings from day one, document licenses |
| App Store rejection | Low | High | Follow guidelines strictly, review before each submission |
| Backend scaling bottleneck | Low | High | Keep frontend-only as long as possible, design for migration |

---

*Last updated: Week 0 — June 2026*
*Review and update this plan every 13 weeks (once per quarter).*
