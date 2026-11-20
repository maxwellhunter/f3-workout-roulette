# Vercel production deployment

## GitHub source and automatic deployments

Configured November 20, 2026.

- Public repository: https://github.com/maxwellhunter/f3-workout-roulette
- Production branch: `main`.
- Existing live app: https://f3-workout-roulette.vercel.app
- The repository is connected to the existing `f3-workout-roulette` Vercel project. Pushes to `main` trigger production builds with `npm ci` and `npm run build:web`, publishing `dist` on Node 24.x.
- Initial source commit: `94f5b475bbf32f388a41282ae9c0aa531de69cdc`. It includes the app, assets, tests, sources, license, documentation, and phone previews. Local configuration, environment files, dependencies, and generated builds are excluded.
- Current code is tracked in its own repository. The direct-upload and uncommitted-workspace notes below describe the earlier releases before the GitHub connection. GitHub commit checks and Vercel deployment history record subsequent build results.
- TypeScript and lint passed before publication; the application release below also passed all 49 tests and web/iOS/Android exports.

## Latest application change — browser button haptics

Verified November 20, 2026 (America/New_York).

- Live URL: https://f3-workout-roulette.vercel.app
- Status: READY, production, both aliases assigned, no alias error.
- Deployment: `dpl_7nKmnnxSyvQTsfSxHnv6eVYHfMMt`.
- Immutable URL: https://f3-workout-roulette-34wt11u4j-mphunter4s-projects.vercel.app
- Same project/workspace and Node 24.x settings. Eight new/changed source files were uploaded in a 34-file manifest. Build logs report a 45-second build and successful publication. No dependency, environment, domain, preference-storage, or access changes.
- Browser buttons now request subtle tap feedback: a short vibration where supported, and trusted switch-label feedback on supported iPhones. Disabled controls and scrims are excluded. Unavailable feedback leaves normal button actions intact. The feature adds no visible UI and leaves native controls and the timer chime unchanged.
- TypeScript, ESLint, all 49 tests, and web/iOS/Android exports passed. Production loads the tested script `index-7684d70ee517faa785e6243ddcf8acf0.js`. The local-only interaction fixture is absent from the deployment source and was removed from local dist after testing; its temporary server was stopped.
- Live at 320 × 568: opened the deck, browsed to Rifle Carry, started and paused its timer successfully. The main controls and subtitle remain visible. The browser console had no warnings or errors. No live favorites or exclusions were changed.
- Screenshot: `phone-button-haptics.jpg`, captured from production. Viewport overrides were reset, the preview tab returned to localhost, and the live tab was reloaded for a fresh start.
- Detailed local checks in verification.md cover single-action forwarding, removal during a tap, disabled controls, keyboard access, hidden-input cleanup, and scrolling. Actual tactile output and touch gestures on physical iPhone/Android hardware remain unverified. iPhone feedback uses a browser workaround and is best effort; native exports verify compilation only.

## Previous release — expanded block classics

Verified November 20, 2026 (America/New_York).

- Live URL: https://f3-workout-roulette.vercel.app
- Status: READY, production, both aliases assigned, no alias error.
- Deployment: `dpl_DKgdmNYntuxNFKeQ9gipPpfx1pB2`.
- Immutable URL: https://f3-workout-roulette-3035jz2tm-mphunter4s-projects.vercel.app
- Same project/workspace and Node 24.x settings. One changed application source file was uploaded within the existing 31-file manifest. Build and publication took approximately 26 seconds. No dependency, environment, domain, storage-key/format, or access changes.
- F3 Classics now contains 22 bodyweight and 14 block exercises. Added Block Swings, Man Makers, Chest Press, Skull Crushers, Coupon Lunges, Rifle Carry, Murder Bunnies, and Block Merkins. Names, plain-English subtitles, instructions, and search aliases are included. Blockees finds the Man Makers card; it is not duplicated in the draw pool. Dedicated warm-ups remain excluded.
- TypeScript, ESLint, all 46 tests, and web/iOS/Android exports passed. Production loads the tested script `index-72169ee978c47fed09abdae75858da4e.js`.
- Live checks at 320 × 568: Block deck and Browse each show 14; all-equipment Browse shows 36. Block Swings appears in the block list. Searching Blockees returns one Man Makers card, with Block burpee + overhead press below its F3 title and 5 reps. No horizontal/vertical workout overflow; its action row ends at y560. All eight additions were separately selected and measured locally at the same size.
- No live saved choices were changed. The browser console contained no warnings or errors. Local preference tests were cleaned up.
- Screenshots: `phone-block-classics-expanded.jpg` and `phone-man-makers.jpg`, captured from production at 320 × 568. Temporary viewport overrides were reset, the local preview tab was restored, and the existing live tab was left on Man Makers.
- Source remains the reviewed, uncommitted workspace. Native exports verify compilation only; physical-device behavior was not independently measured.

## Previous release — F3 Classics

Verified November 20, 2026 (America/New_York).

- Live URL: https://f3-workout-roulette.vercel.app
- Status: READY, production, both aliases assigned, no alias error.
- Deployment: `dpl_CaoKuKdp7SpjsY5v4TVdi3BduoS4`.
- Immutable URL: https://f3-workout-roulette-jcvfhvgys-mphunter4s-projects.vercel.app
- Same project/workspace and Node 24.x settings. Four changed source files were uploaded within the existing 31-file manifest. Build and publication took approximately 27 seconds. No dependency, environment, domain, storage-key/format, or access changes.
- The default deck is F3 Classics: 22 bodyweight and 6 block exercises. Dedicated warm-ups and general-fitness extras were retired. F3 names appear above plain-English subtitles on workout cards, in Browse, and in How to. Old names remain searchable for renamed classics, and stable IDs preserve preferences. Retired preference IDs remain stored but are never listed or drawn.
- TypeScript, ESLint, all 43 tests, and web/iOS/Android exports passed. Production loads the tested script `index-a819e8122c5843a191d755786fce7f14.js`.
- Live checks at 320 × 568: welcome/default shows F3 Classics with 22 bodyweight moves; all-equipment Browse shows 28, Block deck and Browse each show 6. Boxer, arm circles, and side straddle searches each return zero. Bicycle finds Freddie Mercury, and its main card shows Bicycle crunches underneath without scrolling.
- No live favorites/exclusions were changed. The browser console contained no warnings or errors. All 28 cards were separately selected and measured locally at 320 × 568 with zero horizontal/vertical overflow and visible actions.
- Screenshots: `phone-f3-classics-deck.jpg` and `phone-f3-classics.jpg`, captured from production at 320 × 568. Temporary viewport overrides were reset; the live tab was left on Freddie Mercury.
- Source remains the reviewed, uncommitted workspace. Native exports verify compilation only; physical-device behavior was not independently measured.

## Previous release — compact Browse filters

Verified November 20, 2026 (America/New_York).

- Live URL: https://f3-workout-roulette.vercel.app
- Status: READY, production, both aliases assigned, no alias error.
- Deployment: `dpl_6hUc6JjpaeLkPRAbmGn1DqbR6igp`.
- Immutable URL: https://f3-workout-roulette-d9ck3o8ly-mphunter4s-projects.vercel.app
- Same project/workspace and Node 24.x settings. Three changed source files were uploaded within the existing 31-file manifest. Build and publication took approximately 38 seconds. No dependency, environment, domain, catalog, storage, or access changes.
- Browse now uses a shorter header, compact All/Favorites/Excluded tabs with an inline count, and one row for search and the equipment dropdown. The menu overlays the list. Workout rows and their star/exclusion controls keep their existing sizing.
- TypeScript, ESLint, all 40 tests, and web/iOS/Android exports passed. The live script matches the tested build: `index-561755f925c47b9a952fc25fa9f502a4.js`.
- Live verification at 320 × 568: 347px of list height versus the previous 209px (+138px, approximately 66%), no horizontal overflow, All 76, Block 16, and Block + `squat` five matches. Favorites and Excluded each displayed their zero-result state; no live saved choices were changed.
- Back returns to deck settings, still fitting in 425px without scrolling. The live browser console contained no warnings or errors.
- Screenshot: `phone-browse-compact.jpg`, captured from production at 320 × 568. Viewport overrides were reset and the existing live tab was left showing Browse.
- Source remains the reviewed, uncommitted workspace. Native exports verify compilation only; physical-device behavior was not independently measured.

## Previous release — Browse filters and deck-panel entry

Verified November 20, 2026 (America/New_York).

- Live URL: https://f3-workout-roulette.vercel.app
- Status: READY, production, both aliases assigned, no alias error.
- Deployment: `dpl_86P2GfTe81yYSF6j7ybHGfSk1QBm`.
- Immutable URL: https://f3-workout-roulette-be5836jp2-mphunter4s-projects.vercel.app
- Same project/workspace and Node 24.x settings. Four changed source files were uploaded within the existing 31-file manifest. Build and publication took approximately 34 seconds. No dependency, environment, domain, storage-format, or access changes.
- Browse moved into Choose your deck; the bottom action row now contains only workout controls. All/Favorites/Excluded filters combine with search and equipment. Excluded favorites remain visible in Favorites for management, while still excluded from draws. Back returns to deck settings within the same modal.
- TypeScript, ESLint, all 40 tests, and web/iOS/Android exports passed. The live script filename matches the tested build: `index-a73b829d1d0125d429fb4f931c85c252.js`.
- Live checks at 320 × 568: no Browse button on the workout screen; Browse is the first action in the deck panel. The standard deck panel has 425px content and viewport height, with no scrolling required.
- Live Favorites showed two starred test moves, including excluded Al Gore. Excluded showed only Al Gore; Restore immediately changed the result count from one to zero. Removing the test stars immediately emptied Favorites. All original saved choices were preserved and the test changes were cleaned up.
- The production browser console contained no warnings or errors. Screenshots: `phone-browse-in-deck.jpg` and `phone-browse-filters.jpg`. Viewport overrides were reset; the existing live tab was left with Choose your deck open so Browse is visible.
- Source remains the reviewed, uncommitted workspace. Native exports verify compilation only; physical-device behavior was not independently measured.

## Previous release — Browse stars, exclusions, and bottom placement

Verified November 20, 2026 (America/New_York).

- Live URL: https://f3-workout-roulette.vercel.app
- Status: READY, production, both aliases assigned, no alias error.
- Deployment: `dpl_3A6x669MSRYESGU3szpfq4ndDDbZ`.
- Immutable URL: https://f3-workout-roulette-ozr8lcrm5-mphunter4s-projects.vercel.app
- Same project/workspace and Node 24.x settings. Nine new/changed source files were uploaded in a 31-file manifest. Build and publication took approximately 33 seconds. No dependency, environment, domain, or access changes were made.
- Browse now sits beside the bottom workout controls. Each library row has separate star and Exclude/Restore actions. Exclusions persist under their own versioned key, override every draw deck, and preserve saved stars. Existing favorites storage stays compatible. Empty and single-move decks have explicit recovery/disabled-Next behavior.
- TypeScript, ESLint, all 37 tests, and final web/iOS/Android exports passed. The live browser loads the final tested bundle: `index-4482f5efdc933db99b90185e5c762dd2.js`.
- Live verification at 320 × 568: Browse is 84 × 64 at the bottom. Timed workouts show Start and Next at 98 × 64 alongside Browse, with no horizontal overflow. Al Gore loads in Ready state.
- Saved Air Squats and excluded Al Gore from the live list; both states survived a page reload. Al Gore's choose action was disabled and Restore was available. Removed the test favorite and restored the test exclusion afterward, returning to the original preferences. No production test preferences remain.
- Production console returned no warnings or errors. Screenshots: `phone-browse-bottom.jpg` and `phone-browse-favorites.jpg`. Viewport overrides were reset; the existing live tab was left on the initial Bodyweight screen with Browse at the bottom.
- Source remains the reviewed, uncommitted workspace. Native exports verify compilation only; physical-device storage and touch/audio behavior remain unverified.

## Previous release — searchable workout library

Verified November 20, 2026 (America/New_York).

- Live URL: https://f3-workout-roulette.vercel.app
- Status: READY, production, both aliases assigned, no alias error.
- Deployment: `dpl_4jfnQpA7ZhVL8hnCV1HU2tbenrGA`.
- Immutable URL: https://f3-workout-roulette-deglefb47-mphunter4s-projects.vercel.app
- Same project/workspace and Node 24.x build settings. Four new/changed application files were uploaded in a 28-file source manifest; unchanged sources reused their content hashes. Build and publication took approximately 33 seconds.
- Added a header Browse control and searchable A–Z list of all 76 exercises, with equipment filters, plain-English names, rep-range previews, and tap-to-load selection. The shared sheet preserves the existing deck and How to controls.
- TypeScript, ESLint, all 32 tests, and production exports passed. The hosted script filename matches the final tested web export: `index-913233f7ea5f8b02c0f3ad36682f8062.js`.
- Live verification at a measured 320 × 568 viewport: Browse showed 76 moves and Block showed 16. Search for `pushups` found Merkins; selecting it with the 20–30 range loaded 30 reps. The production browser console returned no warnings or errors.
- Screenshot: `phone-workout-library.jpg`, showing the complete-list picker on a small phone viewport. Temporary viewport settings were reset; the existing production tab was left with the library open. No favorites, environment, access, or dependency changes were made.
- Source remains the reviewed, uncommitted local workspace. Native exports verify compilation only; physical-device keyboard and speaker behavior were not re-tested for this change.

## Previous release — rep counts in fives

Verified November 20, 2026 (America/New_York).

- Live URL: https://f3-workout-roulette.vercel.app
- Status: READY, production, both aliases assigned, no alias error.
- Deployment: `dpl_5F8rWZRtHyHh77QQrwQzgknSXMR4`.
- Immutable URL: https://f3-workout-roulette-ah3m23y8g-mphunter4s-projects.vercel.app
- Same project/workspace and Node 24.x build settings. Three changed source files were uploaded within the existing 25-file source manifest. Build and publication took approximately 34 seconds.
- Range draws now choose uniformly among multiples of five. Custom endpoints must be multiples of five from 5 to 100. Twenty-nine counted defaults were rounded to the nearest five, including per-side exercises. Every timed catalog record is unchanged.
- TypeScript, ESLint, all 28 tests, and a production web export passed. The hosted script filename matches the tested build: `index-034a528f0c4b7f8c0ca928eb468f679e.js`.
- Live verification at a measured 320 × 568 viewport: twelve draws included eight counted cards, displaying only 20, 25, and 30 for the 20–30 range. No browser warnings or errors were recorded.
- Screenshot: `phone-reps-in-fives.jpg`, cropped to the rep-range controls. Viewport overrides were reset, and the existing live tab was reloaded to the default screen. No favorites or access settings were changed.

## Previous release — configurable rep ranges

Verified November 20, 2026 (America/New_York).

- Live URL: https://f3-workout-roulette.vercel.app
- Status: READY, production, both project aliases assigned, no alias error.
- Deployment: `dpl_CUz72fkx2d5M8J2Q9outi47rLidD`.
- Immutable URL: https://f3-workout-roulette-o0oktucw6-mphunter4s-projects.vercel.app
- Existing project `prj_HSK5qVUgDmTfwwxoYmdHtvWELJQu`, workspace `team_bGA14VDpzdBsKUlipAJPIDPe`, Node 24.x / Expo web export. Build and publication reached READY in approximately 30 seconds.
- Reviewed source: 25 application files. Five new/changed files were uploaded; 20 unchanged files reused their verified content hashes from the previous release. Source remains the uncommitted local workspace, with no Git integration, credential, access, or environment changes.
- Added Default, 10–20, 20–30, 30–50, 50–100, and Custom rep choices. Custom accepts whole numbers from 1 to 100, including equal bounds. Current and future counted cards use the range; timers retain their duration and state. How to derives numeric counting guidance from the displayed count.
- TypeScript, ESLint, all 28 automated tests, and final web/iOS/Android exports passed. See `verification.md` for local behavior checks. Native exports verify compilation only.
- On the live site, 30–50 reps produced a 46-rep Sumo Squats card. Applying custom 35–45 changed the same card to 37 reps. Both preset and custom panels fit at a measured 320 × 568 viewport without scrolling. The live browser console returned no warnings or errors.
- Hosted script filename matches the validated local web export: `index-57b494662ad357811e11b351930d9cfb.js`. The production source loaded through the existing public app URL.
- Screenshot: `phone-rep-range.jpg`, captured from production at 320 × 568. Temporary viewport overrides were reset. No production favorites were modified.
- This remains a static client app with no server functions; browser checks are the relevant runtime evidence. No monitoring or log-drain configuration changed. Physical phone keyboard behavior and audible speaker playback were not independently measured.

## Previous release — centered chevron

Verified November 20, 2026 (America/New_York).

- Live URL: https://f3-workout-roulette.vercel.app
- Status: READY, production, with both aliases assigned and no alias error.
- Deployment: `dpl_4m7ua1RX7Yv7iaZG1bbeH8EYnYwZ`.
- Immutable URL: https://f3-workout-roulette-p3un54sn7-mphunter4s-projects.vercel.app
- Same project and workspace as below; Node 24.x / Expo web export. Build and publication reached READY in approximately 37 seconds.
- Only `App.tsx` changed in the uploaded application source: the down-arrow text character is now a centered, fixed-size chevron drawn with two borders. No dependency or behavior changes.
- TypeScript, ESLint, and a clean production web export passed. The button and longest label were checked at 320 × 568 locally. Production was reloaded and checked at the same size: centered icon, 52px button height, no label overflow, and the deck panel opens/closes correctly.
- No hosted browser warnings or errors were recorded. This is a static client app; no monitoring or log-drain configuration changed.
- Production screenshot: `phone-chevron-fixed.jpg`. Viewport overrides were reset, and the hosted tab was left on the default Bodyweight screen.
- Source remains the reviewed, uncommitted local workspace. No Git integration, environment changes, or permission changes were made.

## Previous release — mobile-first layout

Verified November 20, 2026 (America/New_York).

- Live URL: https://f3-workout-roulette.vercel.app
- Status: READY, production; both project aliases assigned with no alias error.
- Project: f3-workout-roulette (`prj_HSK5qVUgDmTfwwxoYmdHtvWELJQu`).
- Workspace: mphunter4s-projects, the user's existing personal workspace (`team_bGA14VDpzdBsKUlipAJPIDPe`).
- Deployment: `dpl_A694dNK5PxfAXL3ct7HmaCHquiEF`.
- Immutable URL: https://f3-workout-roulette-666b7go59-mphunter4s-projects.vercel.app
- Build: Expo web export, Node 24.x, `npm ci` → `npm run build:web` → `dist`. Vercel reported build completion in 25 seconds.
- Source: 22 reviewed workspace files, uploaded through authenticated Vercel tools. The app remains uncommitted in the parent repository; parent HEAD `e59c2ec` is not a commit of this app. No Git integration or automatic deployments were added.
- This release replaces the previous production deployment `dpl_HNbZzHC62pwSmLVN4ovdonVUf5MS` with the compact mobile layout. Timer, audio, catalog, and storage implementations are unchanged.
- Existing project settings, domain, and protection defaults were preserved. No custom domain, paid add-on, database, backend, or secret environment variables were added. The production app remains accessible anonymously.

### Validation

- TypeScript, ESLint, all 23 tests, and local production exports for web/iOS/Android passed before release.
- Vercel installed dependencies and built successfully from the uploaded source.
- Anonymous HTTP requests retrieved the app HTML, JavaScript, and new mobile CSS successfully.
- Hosted JavaScript exactly matches the clean local web-only release build (SHA-256): `b9def86ab54709a4d69c02f66f958816d8907249822d66bbdc9118dcb271a64d`.
- Hosted CSS also matches the local release (SHA-256): `4f1beb13cdd0624c2d1db2b0ed0ee7f234ecc2a4e99631a5f6807c5583889510`.
- Actual hosted browser checks: default Bodyweight/60, All/76, Block/16, drawing cards, opening/closing both panels, and correct single/zero favorites behavior.
- Started Block Curl Hold, paused at 4 seconds, opened/closed How to, and confirmed the remaining time stayed at 4. Resume finished at zero with Time’s up! and Restart, with no sound error.
- Saved Block Curl Hold, reloaded, and retrieved it through Block/Favorites. Removed it, used Browse moves from the empty state, reloaded again, and verified the block favorites count was zero. No test favorites remain.
- At 320 × 568 the hosted Lateral Shuffle card had zero horizontal or vertical overflow; the three secondary controls measured 52px high and both bottom actions 64px. The local exhaustive 76-card layout pass is detailed in `verification.md`.
- Hosted browser console contained no warnings or errors. A release-specific error/fatal runtime-log scan over 30 minutes returned no logs; this static client app has no server functions.
- Screenshot: `phone-mobile-first.jpg`, captured from production at 320 × 568. Browser viewport overrides were reset after testing. The hosted tab is left on a bodyweight timed card, ready for Start.

### Limits and observations

- Physical-device output and audible speaker playback were not independently measured. Keep the app open and media volume up; there is no background/lock-screen alarm.
- Favorites are browser/device-local and origin-specific. Localhost favorites do not transfer to the hosted URL.
- No server runtime logs are expected for this static client app. Browser console, HTTP checks, and matching release files are the relevant checks; no monitoring service or log drain was added.
- No dependencies were changed in this mobile layout release. Prior lockfile advisories are not addressed by this UI update.
