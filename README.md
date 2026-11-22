# F3 Workout Roulette

A standalone Expo / React Native app for iOS, Android, and web. Draw one exercise at a time from **F3 Classics: 22 bodyweight moves plus 14 cinder-block moves**. The compact charcoal, white, and red screen puts the exercise and large dose first, with a favorite star and clear counts or a distance prompt. Primary actions stay at the bottom; deck controls and full instructions open in separate panels.

An independent F3-inspired project. Exercise terminology and adaptations are documented in [SOURCES.md](SOURCES.md).

The UI keeps its dark background and uses red (`#D32F2F`) for primary actions and selections, with white counts and labels. This palette follows the black/white/red direction of [F3 Nation's website](https://f3nation.com/); the red is an app choice for contrast, not a published national color specification. Shared colors live in `src/theme.ts`.

**Repository:** [maxwellhunter/f3-workout-roulette](https://github.com/maxwellhunter/f3-workout-roulette)

## Live site

**https://f3-workout-roulette.vercel.app** — production deployment on Vercel, verified November 20, 2026. It opens without Vercel authentication. The hosted origin has its own local favorites; localhost favorites do not automatically transfer.

`vercel.json` configures `npm ci`, `npm run build:web`, the `dist` output directory and the single-page fallback. Production uses Node 24.x. The local `.vercel` project link, dependencies, generated builds, and environment files are ignored by Git.

The GitHub repository is connected to the existing Vercel project. Pushing to `main` triggers a production deployment at the live URL above. The GitHub connection and earlier deployment history are recorded in [docs/deployment.md](docs/deployment.md).

## Local preview

Clone the repository and start the web preview:

```sh
git clone https://github.com/maxwellhunter/f3-workout-roulette.git
cd f3-workout-roulette
npm ci
npm run web -- --localhost --port 8087
```

Open **http://localhost:8087**. Node 24.x is recommended to match production. No environment variables, account, or backend are needed. Use a different port if 8087 is occupied. A localhost-only preview cannot be opened directly from another device. Native use requires an Expo SDK 58-compatible client or development build; physical-device execution has not been verified.

## Behavior

- **Opening screen:** “Your next move.” uses large italic type over a faint, cropped roulette dial. The selected deck's name and move count lead to one centered 72px Draw a move button. Tapping Draw spins the dial once over 600ms, slowing to a stop before revealing the workout. Draw and Change deck are locked during the spin; Next move remains instant. Reduced motion, an unavailable motion preference, or a hidden dial skips the animation and delay. A quieter 44px Change deck link beneath Draw opens equipment, reps, favorites, and Browse. The header's deck selector appears once a workout is drawn. The dial is noninteractive and hidden from assistive technology; enlarged text and very narrow screens use a freely wrapping heading. Empty decks show “No moves yet.” with a single Choose your deck recovery action. Compact and full layouts account for the available safe-area height.
- **Home Screen icon:** a bold charcoal F3 mark on a lime icon background, with an opaque 180px Apple touch icon, 192px/512px web app icons, and 16px/32px/48px browser favicons. In iPhone Safari, use Share → Add to Home Screen; the saved name is “F3 Roulette” and it opens in standalone mode. The editable artwork is `assets/icon.svg`; the HTML metadata and web app manifest live in `public/`. This does not add offline caching.
- **Mobile layout:** All 36 workout cards fit without scrolling at 320 × 568 with default text sizing. Main and workout-row controls are at least 52px tall; primary actions are at least 64px. Compact Browse filters and Back retain at least 44px tap targets. The layout uses the usable browser height, with scrolling available for enlarged text or landscape. On compact screens, the F3 name and plain-English subtitle replace the longer summary, which remains in How to. Detailed instructions can scroll independently while Done stays visible.
- **Button haptics on web:** enabled buttons request a light tap response. Android browsers with the Vibration API use one 10ms pulse. Supported iPhone Safari versions use feedback from a trusted tap on an invisible switch label; [WebKit documents switch haptics from iOS 18](https://webkit.org/blog/15865/webkit-features-in-safari-18-0/#switch). The label approach is informed by [ios-haptics](https://github.com/tijnjh/ios-haptics). Disabled buttons and background scrims do not trigger it. Unsupported devices keep ordinary controls without an error or extra UI. Feedback depends on the browser, hardware, and phone settings; physical-device feel has not been verified. Native controls are unchanged.
- **F3 Classics:** the default curated deck contains 36 exercises with F3 names and plain-English subtitles. Warm-ups (including Boxer Shuffle, Side Straddle Hops, arm circles, and high knees) and general-fitness extras are absent from Browse and every draw deck. This is a source-backed editorial selection, not a popularity ranking. The equipment selection still starts at Bodyweight.
- **Browse:** open Choose your deck, then tap Browse workouts. Two compact rows hold All / Favorites / Excluded and search beside an All gear / Bodyweight / Block dropdown. The matching count appears in the active tab, and the equipment menu overlays the list rather than pushing it down. Favorites shows every starred move, including excluded favorites, so both preferences can be managed. Removing a star or restoring a move updates the filtered list immediately. Search and Back stay visible while the list scrolls. Back returns to the deck settings; choosing a move closes the panel and loads it with the selected rep range. Separate star and Exclude/Restore controls keep Browse open. Browsing or reselecting the current move preserves its count. Choosing a move outside the active deck switches equipment as needed and leaves Favorites mode only when the selected move is not saved. Browse filters reset when the library is closed and do not change the draw deck. No Browse button occupies the main workout action row.
- **Block classics:** 14 choices include Block Swings, Man Makers (also searchable as Blockees), Chest Press, Skull Crushers, Coupon Lunges, Rifle Carry, Murder Bunnies, and Block Merkins alongside the original six. Man Makers use the one-block burpee/overhead-press version. Rifle Carry and Murder Bunnies use “Pick your distance”; the other block moves use reps. All counts use multiples of five.
- **Equipment:** use Change deck on the opening screen or the top deck button during a workout to choose All / Bodyweight / Block and F3 Classics / Favorites. Starts with Bodyweight on each page load, so no equipment is required unexpectedly. Counts in the panel reflect the selected equipment and deck. “Block” means one cinder block.
- **Rep range:** Choose your deck also offers Default, 10–20, 20–30, 30–50, 50–100, and Custom. All rep counts use multiples of five. Custom accepts minimum/maximum values from 5 to 100 in steps of five; equal values give a fixed count. Ranges choose uniformly from the included multiples of five (for example, 20–30 gives 20, 25, or 30) and apply immediately to the current card. Per-side exercises use that count on each side, and How to updates its totals. Default restores each exercise’s count, rounded to the nearest five. The same range applies to spoken holds. Traveling moves always say “Pick your distance” and have no numeric target. The range resets to Default on reload, like the equipment selection.
- **Favorites:** tap the star on a workout card or in Browse to save/remove; both stay in sync. Switch F3 Classics / Favorites to revisit saved cards. Equipment filters and exclusions also apply to Favorites. Saved IDs persist through AsyncStorage on native and localStorage on web, using the existing versioned key. Renamed movements retain their original IDs. Saved IDs for retired cards remain stored but do not appear in lists, counts, or draws.
- **Exclusions:** Exclude removes a move from every draw deck, including Favorites. It stays visible in Browse with an Excluded label and Restore control, and must be restored before it can be chosen manually. Excluding a favorite keeps its star; restoring it makes it eligible again. Excluding the current workout replaces it with an eligible move or clears an empty deck. Changing an unrelated move preserves the current count. Exclusions persist separately from favorites on this device/browser origin.
- Favorites load asynchronously; Classics draws remain available during loading or a load failure. Failed writes leave the last saved state intact. Retry is available after a read failure; malformed/future data is not silently erased.
- Draws wait for exclusions to load, and a load failure offers Retry instead of drawing a possibly excluded move. Failed exclusion writes keep the previous saved state. Neither preference list silently overwrites malformed/future data.
- A zero-match deck offers Choose a deck, which includes Browse for saving or restoring moves. With one eligible move, that card is shown and Next is disabled. No back-to-back repeats when alternatives exist. Every eligible card has equal draw probability; no category balancing.
- Changing equipment/decks keeps an eligible current card. An excluded card is replaced, or cleared if no cards match. Changing cards closes the previous instructions. Filter changes do not delete favorites.
- **How to:** open three steps, counting guidance, and the full summary in a panel. Close with Done, Escape on web, Android Back, or the backdrop. Opening instructions preserves the current count. New cards close the panel.
- **Counted workouts:** Flutter Kicks, Mountain Climbers, American Hammers, LBCs, Freddie Mercury, Alternating Shoulder Taps, Peter Parkers, and Plank Jacks show “in cadence.” Each complete four-count cycle is one displayed rep; How to explains the movement on each beat. These are app defaults grounded in F3 examples, since counting can vary by Q. Al Gore and Chilcutts use spoken count holds; Side Plank uses the displayed spoken count on each side. All traveling exercises—Bear Crawl, Crab Walk, Rifle Carry, and Murder Bunnies—say “Pick your distance” on the card and in Browse, with finish-point guidance in How to. Every numeric target follows the rep range, in fives. There are no timed cards, countdown controls, or completion sounds.
- No accounts, backend, analytics, or session history. Favorites and exclusions are local to this app/browser origin; current card, filter and rep range reset on reload. See `SOURCES.md` for terminology, technique references and adaptations.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build:web
```

The suite covers all 36 active records, preservation of historical preference IDs, every first draw and allowed next-card transition, 10,000 draws without consecutive repeats, equipment/favorite/exclusion intersections, separate preference persistence, filter reconciliation, empty/single decks, saved-ID compatibility, load/write failures, malformed storage, library search, rep-range validation and endpoints, whole-cycle cadence targets (including odd counts), spoken hold counts, open-distance handling for every traveling move, and dynamic per-side counting instructions. Native bundle export verifies compilation, not device behavior.

Browser verification and screenshots are recorded in `docs/verification.md`. Physical-device storage and haptics remain unverified.

## Main files

- `App.tsx`: screen, equipment/deck controls, favorite interaction, how-to, and count/distance UI.
- `src/LandingScreen.tsx`: responsive opening screen, decorative card stack, and empty/loading states.
- `src/mobile.css`: web viewport sizing, touch behavior, and keyboard focus outlines.
- `src/HapticPressable.web.tsx` and `src/buttonHaptics.ts`: browser tap feedback, with a native Pressable re-export in `src/HapticPressable.tsx`.
- `src/exercises.ts`: bundled catalog, equipment metadata, filtering and uniform selection.
- `src/favorites.ts` and `src/useFavorites.ts`: separate favorites/exclusions keys and list hooks.
- `src/savedExercises.ts`, `src/useSavedExercises.ts`, and `src/PreferenceNotice.tsx`: shared durable list storage, asynchronous state, and recovery notices.
- `src/repRanges.ts` and `src/RepRangePicker.tsx`: rep-range choices, validation, random counts, and counting text.
- `src/WorkoutLibrary.tsx` and `src/library.ts`: searchable exercise picker and dose previews.
- `src/Sheet.tsx`: shared modal panel with pinned Done control and optional virtualized list body.
- `tests/`: logic, storage, compatibility, and count/distance checks; `haptics-browser.html` is a local-only interaction fixture excluded from deployments.
- `SOURCES.md`: source references and app-specific adaptations.

Everything is contained in this directory; sibling projects are untouched.

## Contributing

Open an issue or pull request with the problem, proposed behavior, and relevant checks. Keep controls easy to read and tap on small phones, preserve F3 names with plain-English explanations, and cite movement sources when changing the catalog. Run the checks above before submitting. Exercise IDs are saved on users' devices, so keep existing IDs stable when renaming movements.

The existing [MIT license](LICENSE) includes the Expo starter attribution.
