# Verification — simplified landing screen

November 20, 2026.

- Reduced the opening screen to a 72px Draw a move button and a muted 44px Change deck link. Removed the duplicate header selector, numbered flow, example workout details, editable summary panel, and entrance animation. The remaining card stack is decorative, non-interactive, and hidden from assistive technology.
- Verified zero horizontal/vertical overflow at 320 × 568 and 402 × 874. In 568 × 320 landscape, both footer actions remain visible (Draw: y188–260; Change deck: y268–312), with content scrolling available above them.
- Change deck opens the existing panel with equipment, reps, favorites, and Browse. Selecting Block updates the quiet equipment label. Drawing then displays a block workout and restores the header's deck selector.
- Empty Favorites shows exactly one button, Choose your deck; it opens settings and F3 Classics restores the ordinary landing screen. The normal landing accessibility tree contains only Draw workout and Change workout deck buttons.
- TypeScript, ESLint, and web/iOS/Android exports pass. No browser warnings or errors occurred. Catalog, storage, rep selection, and timer logic are unchanged; this follow-up was verified through the affected UI flows.
- Screenshot: `phone-landing-simple.jpg`. Physical iPhone Home Screen rendering and the previously reported system blur remain unverified.

# Previous verification — browser button haptics

November 20, 2026.

- Added a browser-only Pressable enhancement to the workout, deck, Browse, rep-range, sheet, and retry buttons. There are no additional screen rows, dependencies, settings, requests, or storage changes. Native Pressable behavior is preserved by a platform-specific re-export.
- Supported vibration browsers request one 10ms pulse from the existing onPress handler; absent, denied, and throwing APIs remain harmless. iOS uses feature/device detection and a trusted label-to-switch tap. The switch forwards one click to the existing button handler, then stays connected until the default action completes even if that click removes the card/sheet. Hidden switches are excluded from keyboard and accessibility navigation and cleaned up after unmount.
- TypeScript, ESLint, all 49 tests, and final web/iOS/Android exports passed. New unit coverage checks supported/unsupported device selection, vibration receiver/duration, and harmless unavailable/denied/error outcomes.
- In the local-only browser fixture, one tap produced exactly one action and one switch change. Enter produced one more action without an extra switch change. Tapping a control that immediately removes itself still produced exactly one action and one switch change. Clicking a disabled overlay changed neither count. Every hidden input had tabIndex -1 and aria-hidden true; no checkbox appeared in the accessibility tree.
- Scrolling the fixture from scrollTop 0 to 202 left action/switch counts unchanged. Removing the enhancement cleaned up all overlay labels and hidden inputs. These checks validate event routing and ordinary scrolling, not physical touch or tactile output on an iPhone.
- The actual app passed Draw, deck selection, rep presets, Browse search/selection, timer Start/Pause, favorite add/remove, and exclusion/restore checks. Star and Exclude each changed state once; an excluded move was disabled. All test preferences were restored. At 320 × 568 the paused Rifle Carry still had zero horizontal/vertical overflow and actions ending at y560. No browser warnings or errors were recorded.
- Production details and screenshot follow in deployment.md. A physical iPhone/Android is still needed to assess the actual vibration feel and device-specific gestures. No timer-completion vibration or native haptics was introduced.

# Previous verification — expanded block classics

November 20, 2026.

- TypeScript, ESLint, all 46 tests, and web/iOS/Android exports passed. The active catalog now has 36 exercises: 22 bodyweight and 14 block. Only the exercise catalog changed in the application source.
- Added Block Swings, Man Makers, Chest Press, Skull Crushers, Coupon Lunges, Rifle Carry, Murder Bunnies, and Block Merkins. Sources and explicit movement variations are recorded in SOURCES.md. Dedicated warm-ups remain excluded.
- Tests cover catalog counts, searchable Man Maker/Blockee aliases resolving to one card, new saved/excluded IDs, restoration of the old block-reverse-lunges ID, counted range values in fives, alternating lunge totals, and Rifle Carry retaining its 20-second dose.
- Selected and measured all eight additions at 320 × 568. Each has zero horizontal/vertical overflow, its plain-English subtitle below the F3 title, and its action row ending at y560 inside the viewport. The block deck shows 14.
- Rifle Carry opens in Ready state. Start/Pause worked; changing to 20–30 reps retained the paused 20 seconds. Block Swings then loaded at 25 reps. Default reps were restored afterward.
- Starred and excluded Block Swings in Browse, reloaded, and verified it remained the sole favorite with its choose action disabled and Restore available. Restored and unstarred it; Favorites returned to zero. No test preferences remain.
- The local browser console had no warnings or errors. Production checks and screenshots are recorded in deployment.md. Native exports verify compilation only.

# Previous verification — F3 Classics and plain-English subtitles

November 20, 2026.

- TypeScript, ESLint, all 43 tests, and web/iOS/Android exports passed. The catalog is now 28 classics (22 bodyweight, 6 block); F3 Classics replaces All moves as the selected default deck. Equipment still defaults to Bodyweight.
- The active catalog excludes dedicated warm-ups and general-fitness extras. Tests cover retired IDs never reaching Browse or draws, F3/previous/plain-name search, stable renamed IDs, and preservation of retired saved preferences without making them selectable.
- Selected every one of the 28 cards through Browse at a measured 320 × 568. Every card had zero horizontal and vertical overflow, a visible plain-English subtitle below the F3 name, and its action row ended at y560 inside the viewport. Compact cards move the long description into How to.
- The standard deck panel still fits without scrolling (425px viewport/content). F3 Classics shows 22 under Bodyweight; Browse shows all 28. Searching Boxer gives zero; bicycle finds Freddie Mercury and selects it with Bicycle crunches directly below the title.
- Starred and excluded Werkins using the old search term wide pushups, reloaded, and verified the renamed move remains starred and disabled in Favorites. Restored and unstarred the test move; Favorites returned to zero.
- Searched forearm plank to load Chilcutts in Ready state. Start/Pause worked, and changing the rep range to 50–100 preserved its paused 16 seconds. Searching BBSU loaded Big Boy Sit-ups at 90 reps; How to showed the correct name, subtitle, three steps, and counting convention.
- No local browser warnings or errors. All test preferences were cleaned up. Production verification/screenshots are recorded in deployment.md; native export verifies compilation, not physical-device behavior.

# Previous verification — compact Browse filters

November 20, 2026.

- TypeScript, ESLint, all 40 existing tests, and web/iOS/Android exports passed. Layout changes add no dependencies and leave catalog, filtering rules, timers, and preference storage unchanged.
- At a measured 320 × 568, the list grows from 209px to 347px high: +138px, approximately 66% more room. Its top moves from y357.88 to y219.88. The header is shorter, filters occupy two rows, and the active tab includes the result count.
- All/Favorites/Excluded and Back measure 44px tall. The equipment trigger is 46px tall; search and menu options retain 44px minimum targets. Workout star and Exclude/Restore targets remain 52 × 52 and 66 × 52. No horizontal overflow.
- The gear dropdown overlays the list; choosing Block shows 16 moves and closes it. Combining Block with search `squat` shows five matches. Bodyweight shows 60. Tapping outside dismisses the menu without choosing a workout.
- Back returns to the unchanged deck panel, whose 425px viewport and content fit without scrolling. No local browser warnings or errors were recorded.
- Production verification and the final phone screenshot are recorded in `deployment.md`. Native exports verify compilation only.

# Previous verification — Browse filters inside Choose your deck

November 20, 2026.

- TypeScript, ESLint, all 40 tests, and final web/iOS/Android exports passed. Three new tests cover All/Favorites/Excluded membership, excluded favorites appearing in both relevant views, intersections with search/equipment, and immediate empty results after removing/restoring the last matching item.
- Browse is now the first action in Choose your deck and is absent from the main workout controls. At 320 × 568, the standard deck panel fits without scrolling (425px viewport and content). Redundant Equipment/Draw from captions were removed to make room for the 52px Browse entry.
- Browse and deck settings share one modal. Back returns to the deck panel, and selecting a workout closes it. Escape performs the same library → deck → workout transitions. Existing How to sheets retain their Done control.
- Favorites and Excluded initially show their respective empty states. Starred Air Squats and Al Gore, excluded Al Gore, and verified Favorites showed both moves while Excluded showed only Al Gore. The excluded favorite remained disabled for selection and offered Restore.
- Combined Favorites + Block produced no matches; Bodyweight + search `hold` showed only Al Gore. Excluded + the same search also showed Al Gore. Restore removed it immediately from Excluded. Removing both stars updated Favorites from two to one to zero without closing Browse.
- Selected 20–30 reps in the deck panel, browsed to Merkins, and loaded it at 30 reps. Empty Favorites offers Choose a deck, where Browse remains available for recovery.
- Paused Block Curl Hold at 15 seconds, opened deck/Browse, changed the library filter, then used Escape twice. The workout stayed paused at 15. Resume and Next measure 144 × 64 at 320px width; the workout card has no vertical overflow. No Browse button remains in that row.
- No local browser warnings or errors. All local test favorites/exclusions were restored. Production verification and screenshots are recorded in `deployment.md`. Native export verifies compilation only.

# Previous verification — Browse favorites, exclusions, and bottom controls

November 20, 2026.

- TypeScript, ESLint, all 37 tests, and final web/iOS/Android exports passed. Five new tests cover separate preference storage, persistence/restoration, failed writes and malformed data, exclusions overriding every draw deck, and current/empty-card reconciliation. Existing favorites data keeps its original key and format.
- Browse is now in the bottom action row rather than the header. At a measured 320 × 568, a paused Block Curl Hold fits without scrolling: Resume and Next are 98 × 64, Browse is 84 × 64. The full F3 Roulette brand fits in the header.
- Each Browse row has independent choose, star, and Exclude/Restore controls. Star targets measure 52 × 52 and exclusion targets 66 × 52, with no horizontal overflow. Pressing either preference control keeps the list open and does not choose that row.
- Saved Air Squats and excluded Al Gore, then reloaded: both states persisted and the bodyweight deck had 59 moves. Excluded rows remain searchable but cannot be chosen until restored.
- Switched to the one-favorite deck, then excluded Air Squats: its star remained saved, the current card cleared, and Browse became the recovery action. Restore returned Air Squats to Favorites with its star intact. Removing its star in Browse also updated the main deck.
- Paused Block Curl Hold, then starred and excluded unrelated Al Gore; the current exercise, exact remaining time, and Paused status were preserved. Excluding Block Curl Hold itself replaced it with an eligible block exercise.
- Excluded 15 block moves through the UI, leaving only Block Curls: it was selected and Next was disabled. Excluding the last move displayed the empty deck with Browse recovery. Restored all 16 moves and verified the block deck count returned to 16. All test favorites/exclusions were removed or restored.
- No local browser warnings or errors were recorded. Production verification and screenshots are recorded in `deployment.md`. Native exports verify compilation; physical-device storage, touch, and speaker behavior were not independently measured.

# Previous verification — workout library

November 20, 2026.

- TypeScript, ESLint, all 32 tests, and web/iOS/Android exports passed. Four library tests cover catalog completeness and sorting, search punctuation/case and equipment aliases, combined filters, and dose previews for ranges/timers/per-side moves.
- At a measured 320 × 568 viewport, Browse fits in the existing header. All main controls remain at least 52px tall, including the longest `★ All equipment` label, with no horizontal overflow. The full brand and header also fit at 430 × 740.
- The library initially shows 76 moves, including 60 Bodyweight and 16 Block. Searching `squat` with Block selected produces five matches. An unknown name produces the empty state. `pushups` finds eight matching moves, including Merkins, despite punctuation differences.
- Selected the 20–30 range, then chose Merkins from search; it loaded at 20 reps. The library preview shows the range and keeps timed durations unchanged. Selecting Block Curl Hold switches the main equipment deck to Block and loads its original 15 seconds in Ready state.
- After Start, reopening the library and reselecting Block Curl Hold preserves Running. Pause followed by opening/closing the library preserves the exact remaining time and Paused status. Choosing unsaved Merkins from an empty Block/Favorites deck returns to Bodyweight/All moves.
- Scrolled the list through its final Wide Push-ups row while search, equipment filters, result count, and Done stayed visible. Changing the equipment filter resets the list to the top. Existing deck and How to panels still open and close correctly after sharing the sheet component.
- No local browser warnings or errors were recorded. Favorites data was not modified. Physical phone keyboard behavior and native device execution were not independently measured.
- Production verification and screenshot are recorded in `deployment.md` after release.

# Previous verification — reps in fives

November 20, 2026.

- TypeScript, ESLint, all 28 tests, and the production web export pass.
- All counted catalog defaults are multiples of five, enforced by the catalog test. Twenty-nine defaults were rounded to the nearest five. A before/after comparison confirmed every timed record was identical.
- Range tests cover every available step and both endpoints, plus 1,000 draw positions for each tested range. Custom ranges reject nonmultiples such as 12–20 and 10–23, values below 5 or above 100, reversed bounds, decimals, and malformed input.
- In the browser, entering a minimum of 12 disabled Apply and showed “Use multiples of 5 (5, 10, 15…).” A custom 20–30 range was tested across 25 draws, including 21 counted cards, producing only 20, 25, and 30.
- Default restored Squat Knee Drives to 15 reps. The browser console returned no warnings or errors.
- Hosted verification used the same script filename as the tested production export. Twelve live draws included eight counted exercises, with values 20, 25, and 30 only. The measured viewport was 320 × 568; the console was clear. See `deployment.md` and `phone-reps-in-fives.jpg`.

# Previous verification — rep-range settings

November 20, 2026. Rep ranges are chosen in the deck sheet, applied to counted exercises, and reflected in the card and How to. This is a local client flow with no API, account, or database dependency.

- TypeScript, ESLint, and all 28 automated tests pass. The five new tests cover invalid custom input, inclusive random endpoints, fixed counts, unchanged timers/defaults, and dynamic counting instructions (including odd alternating totals).
- At 320 × 568, the normal preset sheet and custom editor each have zero vertical overflow. Controls are at least 52px high. Custom inputs replace the preset grid to keep the panel compact; instructions and validation errors retain a scroll fallback.
- Selected 30–50 reps, drew Step Jacks at 42, and verified How to showed 42 total / 21 per side. A reversed 50–20 custom range disabled Apply and displayed an inline error.
- A fixed 100–100 range applied to counted cards. Thirty additional block draws covered 15 distinct cards, including Block Romanian Deadlifts and Block Split Squats. Every counted card displayed 100; timed cards retained their durations. No workout overflow or offscreen primary action was observed.
- A Forearm Plank stayed at its original 30 seconds with a 100-rep override. Paused it at 10 seconds, changed the range to 20–30, and confirmed it remained paused at 10. Resume reached Time’s up / Restart without a sound-error message.
- In the final web build, Block Rows drew 50 reps with the 30–50 range. Saving it, changing equipment to All, and selecting its single-favorite deck preserved 50 reps. Default restored the original 8 reps. The temporary favorite was removed and the preview reloaded.
- Local browser console had no warnings or errors in this pass. Physical phone keyboard behavior and audible speaker playback were not independently measured.
- Final web/iOS/Android exports passed. Hosted verification confirmed a 46-rep draw in 30–50 and an immediate change to 37 when custom 35–45 was applied. Both deck modes fit at a measured 320 × 568 viewport. Production console was clear, and its script filename matches the tested web export. See `deployment.md` and `phone-rep-range.jpg`.

# Previous verification — mobile-first workout layout

November 20, 2026. Local preview: http://localhost:8087. Live release details are in `deployment.md`.

## Chevron alignment follow-up

- Replaced the font-dependent down-arrow character with a two-stroke chevron in a fixed, centered icon area. The button keeps its existing accessible label and 52px minimum height.
- Checked Bodyweight, All equipment, and the longest label, ★ All equipment, at 320 × 568. The icon stays aligned, the longest label remains on one line, and the button still opens/closes the deck panel. No local browser warnings or errors were recorded.
- TypeScript, ESLint, and a clean production web export pass. The production button also passed the 320 × 568 alignment and open/close check, with no console warnings/errors. Screenshot: `phone-chevron-fixed.jpg`. This visual-only follow-up adds no dependencies or behavior changes; the broader checks below describe the mobile layout release.

## Automated checks

- TypeScript, ESLint, and all 23 tests pass after the final label change.
- Production exports for web, iOS, and Android pass, including the new web CSS import. Native exports verify compilation, not physical-device behavior.
- The existing tests cover the 76-card catalog, 60 original bodyweight IDs, equipment/favorite intersections, draw selection, filter reconciliation, saved-data compatibility, storage failures/retries, and all countdown transitions.
- No catalog, storage, selection, countdown, or audio implementation changed for this layout update.

## Actual browser checks

- At 320 × 568, 329 draws reached every one of the 76 cards. Each had zero vertical overflow in the workout scroll area, zero horizontal overflow, and every action stayed inside the viewport with a height of at least 52px.
- At 320 × 480, 30 additional bodyweight draws reached 23 distinct cards, with the same overflow and control checks passing. The short summary is available in How to at this height.
- At 390 × 664, the timed card also fit without scrolling. Ordinary Start/Pause/Resume and Next controls measure 64px tall. Removed the arrow from Next move after noticing it wrapped onto a second line at 320px; rechecked that both timer actions then measured 64px.
- The deck panel exposes all equipment choices and All moves/Favorites counts, using large buttons. Filter changes retain an eligible card or replace an excluded one as before.
- How to opens a separate panel with readable instructions. Its body scrolls through all three steps, counting, and timer guidance while Done stays visible. Escape closes it and returns focus to How to.
- Started Block March, paused at 10 seconds, opened and closed instructions, and verified the display remained at 10. Resume reached zero with Time’s up! and Restart, without a sound-error message. Speaker playback was not independently measured.
- Restarted, changed to Bodyweight, then returned to Block/Favorites: Block March reset to 20 seconds and waited for Start. The single-favorite Next control was disabled while Start remained available.
- Saved Block March, reloaded, and retrieved it via Block/Favorites. Removing it showed Nothing saved here, and Browse moves returned to a block card. Test favorites were removed through the UI.
- The development console contained one historical Metro disconnection warning, with no application error observed in this pass. Hosted console validation is recorded separately in `deployment.md`.

## Screenshots

- `phone-mobile-timer.jpg`: 320 × 568, paused timer, 52px secondary controls and 64px bottom actions.
- `phone-mobile-instructions.jpg`: 320 × 568, scrolled instructions with Done still visible.
- `phone-mobile-first.jpg`: final hosted mobile layout.
- Earlier screenshots are retained for reference and show the previous layout.

## Limits

The no-scroll result applies to the main workout view at the tested sizes and default text scaling. Detailed instructions intentionally scroll. Enlarged text and short landscape screens have a scroll fallback, with the primary controls outside that scroll area. Physical-device storage and audio have not been exercised. Timers/chimes require the app to remain open; there is no lock-screen/background alarm. Favorites are local to each browser origin or native app installation.

## Landing screen redesign — November 20, 2026

- Replaced the oversized empty workout card with a two-line headline, a stacked example-card illustration, a short Draw / Work / Repeat guide, a deck editor shortcut, and a pinned 72px first-draw button. No new dependencies or external assets.
- Verified zero vertical or horizontal overflow in the opening scroll area at 320 × 568, 375 × 667, and 402 × 874. At 568 × 320 landscape, the scroll fallback works and the primary button stays within the viewport (top 240px, bottom 312px).
- At 320 × 568, changing to Block and 50–100 reps updated the example card, dose range, and 14-move summary without drawing a workout. The full “Curls for the Girls” name remained readable. The preview shares Browse's tested dose formatter, including timed and per-side counts.
- Empty Favorites shows a clear explanation and an active Choose your deck action. Verified it fits without scrolling and opens settings; switching back to F3 Classics restores the normal opening view.
- The first-draw action loaded Mountain Climbers with 30 seconds and status Ready; the timer still requires Start. No browser warnings or errors were recorded.
- All 49 existing tests, TypeScript, ESLint, and production web/iOS/Android exports pass. The entrance animation is gated by prefers-reduced-motion; it runs once on web and does not add native animation dependencies.
- Screenshots: `phone-landing-redesign.jpg` (402 × 874) and `phone-landing-compact.jpg` (320 × 568).
- These are browser viewport checks and native compilation checks. Physical iPhone Home Screen rendering, including the previously reported system top-edge blur, remains unverified; this change does not claim to fix that iOS overlay.

## Counted workouts and open-distance Bear Crawl — November 21, 2026

- Converted all eight former timed cards: Flutter Kicks and Mountain Climbers use reps; Al Gore and Chilcutts use spoken count holds; Side Plank uses a spoken count per side; Crab Walk and Rifle Carry use footsteps; Bear Crawl says “Pick your distance.” All 36 exercise IDs remain unchanged.
- Rep ranges apply to every numeric count in multiples of five. Bear Crawl has a null amount and ignores numeric ranges. Browse previews, the workout card, instructions, and accessibility labels share the same units. Removed the countdown controls, chime implementation, unused audio asset, and audio dependency.
- Passed all 47 current tests, TypeScript, ESLint, and production web/iOS/Android exports. Tests cover all converted units, range endpoints, odd alternating totals, per-side hold instructions, open-distance previews, and stable preference IDs. Native exports verify compilation only.
- At 320 × 568, selected all seven converted numeric cards through Browse with a fixed 100-count range. Every card displayed 100 with the correct reps/count/steps unit, had no timer button, and fit its 418px workout area without scrolling.
- Flutter Kicks selected from the 20–30 range displayed 30 reps; How to explained 30 total and 15 per side. Side Plank's instructions changed from a spoken 100 count per side to 20 when Default was restored.
- Bear Crawl displayed “Pick your distance” both in the compact Browse row and on its card. Changing its range to a fixed 100 left no numeric target. The card fit without scrolling at 320 × 568 (418px workout area) and 390 × 844 (694px workout area).
- Verified desktop rendering at 1280 × 720. Reset viewport overrides and reloaded the local preview after testing; no favorites or exclusions were changed.
- Screenshots: `phone-flutter-reps.jpg`, `phone-bear-distance.jpg`, and `phone-spoken-hold.jpg`, all at 320 × 568. Earlier timer verification and screenshots above describe historical releases; the current deck has no timers.

## Flutter Kicks in cadence — November 21, 2026

- Corrected Flutter Kicks to four-count cadence for the user's AO. The workout card, Browse, and screen-reader label show “in cadence.” How to explains one kick per beat and one displayed rep per complete “1, 2, 3, ONE” cycle. Rep ranges continue to select complete cycles in multiples of five.
- At 320 × 568, Browse previewed “20 in cadence”; the card showed 20 IN CADENCE and the instructions matched. Applying a fixed 100 range updated both the card and instructions. Both counts fit the 418px workout area without scrolling.
- All 47 tests, TypeScript, ESLint, and the production web export pass. No native API or component change was needed. Screenshot: `phone-flutter-cadence.jpg`. The prior single-kick Flutter Kicks verification describes the superseded release.

## All traveling moves use chosen distance — November 21, 2026

- Audited all 36 active exercises. Bear Crawl, Crab Walk, Rifle Carry, and Murder Bunnies are the traveling variations; each now uses “Pick your distance,” a null numeric amount, and finish-point instructions. Stationary reverse lunges return to the starting position and retain reps.
- Removed the unused numeric steps unit and generalized the rep-range note to traveling moves. The existing distance handling now applies to all four cards, Browse previews, instructions, and accessibility labels. Exercise IDs and saved preferences are unchanged.
- Passed 48 tests, TypeScript, ESLint, and the production web export. Regression checks cover the complete traveling set, range immunity, absence of stale rep targets, and stationary block/lunge counts.
- At 320 × 568 with 50–100 reps selected, picked all four through Browse. Every preview and card showed “Pick your distance,” with zero numeric targets and no scrolling in the 418px workout area. Restoring Default kept Murder Bunnies open distance. Switching back to Flutter Kicks restored 20 IN CADENCE.
- Verified Crab Walk's updated instructions and saved `phone-crab-distance.jpg`. Reset the viewport and reloaded the local preview after verification. Earlier step-count and Murder Bunnies rep-count notes describe superseded releases.

## Cadence review across the deck — November 21, 2026

- Reviewed all 36 exercises against F3 counting guidance and workout examples, recorded in `SOURCES.md`. Mountain Climbers, American Hammers, LBCs, Freddie Mercury, Alternating Shoulder Taps, Plank Jacks, and Peter Parkers now join Flutter Kicks as four-count cadence defaults. How to explains the exact beat sequence; each displayed rep is a complete cycle. Other rep cards, spoken holds, and traveling moves retain their counting modes.
- Passed all 51 tests, TypeScript, ESLint, and the production web export. Regression checks cover the eight cadence cards, default/ranged/fixed Browse previews, whole-cycle range endpoints, and odd targets without uneven left/right splitting. Exercise IDs, default numbers, and draw probabilities are unchanged.
- At 320 × 568, selected Mountain Climbers through Browse and verified its default 30 IN CADENCE plus four-beat instructions. A fixed 35 target showed American Hammers as 35 in cadence in Browse, on the card, and in How to, without a 17/18 split.
- Selected every cadence card with a fixed 100 target. Each showed 100 IN CADENCE, matching its Browse accessibility label, with no vertical or horizontal overflow in the 296 × 418 workout area. No browser console errors were recorded.
- Saved `phone-mountain-cadence.jpg`, restored the default rep setting, reset the viewport override, and closed the temporary preview. The screenshot uses the tested production web build; physical-device behavior was not separately exercised. Earlier single-count notes for these exercises describe superseded releases.

## Red actions and white counts — November 21, 2026

- Kept the existing dark background and card surface. Primary actions, selected equipment/decks/rep ranges, Browse filters, and saved favorites now use red with white labels. Rep counts, cadence units, distance prompts, and instruction text are white; secondary copy uses neutral gray. The header mark and landing artwork now use black and white with a red card accent.
- White on the primary red (`#D32F2F`) measures 4.98:1 contrast; white on the pressed red (`#B52323`) measures 6.50:1. The red control surface has 3.25:1 contrast against the dark card surface. Small text does not rely on red against a dark background. Focus outlines remain white and all existing touch target sizes are preserved.
- Passed TypeScript, ESLint, all 51 existing tests, and the production web export. Reviewed the changed React components: changes are styling and style-name updates, with no new hooks, handlers, dependencies, data requests, or preference behavior.
- At 320 × 568, the landing screen fits its 296 × 356 scroll area and the Draw button remains 72px high. Verified red selections in Choose your deck, Browse's Favorites/Excluded/equipment filters, saved stars, the custom-range Apply button, and the restore action. The equipment chevron stays white on a selected red background.
- Selected Mountain Climbers with 30 and then 100 cadence cycles, checked How to, and confirmed white counts/units. Crab Walk keeps a white “Pick your distance” prompt. The workout area remains 296 × 418 without vertical or horizontal overflow; Next still draws a different move.
- The landing screen also fits at 390 × 844. No browser console errors were recorded. Removed the temporary favorite and exclusion, reloaded to default settings, reset the viewport, and closed the temporary tab. Screenshots: `phone-red-landing.jpg`, `phone-red-deck.jpg`, and `phone-red-workout.jpg`.

## Plain landing screen — November 21, 2026

- Removed the decorative tilted cards, oversized repeated F3 mark, promotional headline, and button arrow. The landing now shows “Your next move.” with the selected deck name and eligible move count. The red Draw button remains 72px high, with the existing 44px Change deck action below it. The dark background, red actions, and white type remain.
- Loading, unavailable, and empty decks use the same simple heading/detail layout. Empty Favorites has a clear explanation and exactly one recovery button. No exercise, count, storage, or drawing logic changed.
- Passed TypeScript, ESLint, all 51 existing tests, and the production web export. At 320 × 480, 320 × 568, and 390 × 844, the normal landing has no horizontal or vertical scroll overflow. The corresponding scroll areas measure 296 × 268, 296 × 356, and 366 × 632.
- Changing equipment from Bodyweight to Block updated the displayed count from 22 to 14. Empty Favorites fit at 320 × 568 and Choose your deck reopened settings; selecting F3 Classics restored the normal screen. Draw a move loaded Bear Crawl and its distance prompt correctly.
- No browser console errors were recorded. Reloaded to defaults, reset the viewport override, and closed the temporary preview. Screenshot: `phone-landing-plain.jpg` at 320 × 568. Earlier landing screenshots show superseded designs.

## Landing typography and roulette dial — November 21, 2026

- Kept the existing words, deck summary, and two actions. “move.” now uses larger italic type beside a quiet, cropped roulette dial with one red index mark. The dial uses native views with no new dependencies, images, fonts, animation, or stacked cards.
- The graphic cannot receive pointer input and is hidden from accessibility trees. The heading is exposed as “Your next move.” The normal browser accessibility tree still contains only Draw workout and Change workout deck buttons. Enlarged text and viewports narrower than 320px use the freely wrapping heading; the decoration's clipping is separate from the text.
- Passed TypeScript, ESLint, and the production web export. No exercise, count, preference, or drawing logic changed.
- At 320 × 480, 320 × 568, and 390 × 844, the landing fits without horizontal or vertical overflow, and Draw remains 72px high. Also checked the narrow-screen fallback at 280 × 568 without overflow. The empty Favorites explanation and its single recovery action still work; switching back to F3 Classics and pressing Draw loaded Plank Jacks in cadence.
- No browser console errors were recorded. Reloaded to defaults, reset the viewport, and closed the temporary preview. Screenshots: `phone-landing-dial.jpg` (320 × 568) and `phone-landing-dial-large.jpg` (390 × 844). Native screen-reader behavior was not exercised on a physical device.
