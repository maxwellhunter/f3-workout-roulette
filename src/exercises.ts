export type Equipment = 'bodyweight' | 'block';
export type EquipmentFilter = Equipment | 'all';
export const DEFAULT_EQUIPMENT_FILTER: EquipmentFilter = 'bodyweight';

export type Exercise = {
  id: string;
  equipment: Equipment;
  name: string;
  plainName: string;
  aliases?: readonly string[];
  category: 'Upper body' | 'Legs' | 'Core' | 'Cardio' | 'Full body';
  description: string;
  steps: readonly string[];
  counting: string;
} & (
  | { amount: number; unit: 'reps' | 'cadence' | 'per side' | 'count' | 'count per side' }
  | { amount: null; unit: 'distance' }
);

// Curated F3 Classics only; warm-ups and general-fitness extras are retired.
// Doses are app defaults; each card explains its single-count or cadence convention.
// Traveling movements always use open distance, with no numeric amount.
// Reference sources and adapted movement variations are documented in SOURCES.md.
export const exercises: readonly Exercise[] = [
  {
    "id": "merkins",
    "name": "Merkins",
    "plainName": "Push-ups",
    "category": "Upper body",
    "amount": 10,
    "unit": "reps",
    "description": "Lower and press up with a straight body.",
    "steps": [
      "Set your hands below your shoulders and extend your legs into a plank.",
      "Bend your elbows back and slightly out as your chest lowers.",
      "Press the floor away to return. Lower your knees if needed."
    ],
    "counting": "One lower-and-press cycle is 1 rep.",
    "equipment": "bodyweight"
  },
  {
    "id": "lbcs",
    "name": "LBCs",
    "plainName": "Small abdominal crunches",
    "category": "Core",
    "amount": 20,
    "unit": "cadence",
    "description": "Lift your shoulder blades in a small, controlled crunch.",
    "steps": [
      "Lie on your back with knees bent and feet flat.",
      "Exhale and curl your ribs toward your hips, lifting just your shoulder blades.",
      "Lower slowly; keep your chin relaxed and do not pull on your neck."
    ],
    "counting": "Use four-count cadence: “1, 2, 3, ONE,” then “1, 2, 3, TWO.” Lift, lower, lift, lower across the four beats. One full cycle (two crunches) is 1 rep; complete {amount} reps in cadence.",
    "equipment": "bodyweight",
    "aliases": [
      "Little Baby Crunches"
    ]
  },
  {
    "id": "american-hammers",
    "name": "American Hammers",
    "plainName": "Seated twists",
    "category": "Core",
    "amount": 20,
    "unit": "cadence",
    "description": "Twist from side to side while seated, with heels down.",
    "steps": [
      "Sit with knees bent, heels on the floor, and hands together.",
      "Lean back a little while keeping your chest lifted.",
      "Rotate your ribs and hands to one side, then the other."
    ],
    "counting": "Use four-count cadence: “1, 2, 3, ONE,” then “1, 2, 3, TWO.” Twist left, right, left, right across the four beats. One full cycle is 1 rep; complete {amount} reps in cadence.",
    "equipment": "bodyweight"
  },
  {
    "id": "al-gore",
    "name": "Al Gore",
    "plainName": "Squat hold",
    "category": "Legs",
    "amount": 30,
    "unit": "count",
    "description": "Hold a squat with your arms reaching forward.",
    "steps": [
      "Stand about shoulder-width apart and send your hips back.",
      "Bend your knees to a comfortable squat depth, heels grounded.",
      "Reach forward as if hugging a tree and hold without bouncing."
    ],
    "counting": "Hold while counting aloud to {amount} at a steady pace. Keep breathing.",
    "equipment": "bodyweight"
  },
  {
    "id": "burpees",
    "name": "Burpees",
    "plainName": "Squat, plank, push-up, jump",
    "category": "Full body",
    "amount": 5,
    "unit": "reps",
    "description": "Move through a squat, plank, push-up, and small jump.",
    "steps": [
      "Squat and put your palms on the floor; step or hop back into a plank.",
      "Do one push-up, using your knees if needed.",
      "Bring your feet back in, stand, and make a small soft-landing hop."
    ],
    "counting": "The full sequence is 1 rep.",
    "equipment": "bodyweight"
  },
  {
    "id": "air-squats",
    "name": "Squats",
    "plainName": "Bodyweight squats",
    "category": "Legs",
    "amount": 20,
    "unit": "reps",
    "description": "Sit your hips back, then stand tall.",
    "steps": [
      "Stand with feet about shoulder-width apart and toes slightly out.",
      "Bend knees and hips together, keeping your heels down.",
      "Press through your feet and return to standing."
    ],
    "counting": "One squat and stand is 1 rep.",
    "equipment": "bodyweight",
    "aliases": [
      "Air Squats"
    ]
  },
  {
    "id": "reverse-lunges",
    "name": "Reverse Lunges",
    "plainName": "Step-back lunges",
    "category": "Legs",
    "amount": 10,
    "unit": "per side",
    "description": "Step back into a lunge, then return to standing.",
    "steps": [
      "Stand tall with feet hip-width apart.",
      "Step one foot back and lower both knees, keeping the front knee over the foot.",
      "Push through your front foot to return and alternate legs."
    ],
    "counting": "Count each leg separately: {amount} per side, {total} total.",
    "equipment": "bodyweight"
  },
  {
    "id": "squat-jumps",
    "name": "Jump Squats",
    "plainName": "Squat jumps",
    "category": "Legs",
    "amount": 10,
    "unit": "reps",
    "description": "Jump from a squat and land softly.",
    "steps": [
      "Start in a comfortable squat with feet shoulder-width apart.",
      "Push through your feet to jump straight up.",
      "Land with bent knees and reset before jumping again."
    ],
    "counting": "Each jump and landing is 1 rep.",
    "equipment": "bodyweight",
    "aliases": [
      "Squat Jumps"
    ]
  },
  {
    "id": "forearm-plank",
    "name": "Chilcutts",
    "plainName": "Forearm plank hold",
    "category": "Core",
    "amount": 30,
    "unit": "count",
    "description": "Hold a straight line on your forearms and toes.",
    "steps": [
      "Place elbows below shoulders and extend your legs.",
      "Brace your abdomen and keep hips in line with your shoulders.",
      "Look down and breathe normally while holding still."
    ],
    "counting": "Hold while counting aloud to {amount} at a steady pace; lower your knees if needed.",
    "equipment": "bodyweight",
    "aliases": [
      "Chilcutt",
      "Chillcut",
      "Elbow Plank"
    ]
  },
  {
    "id": "side-plank",
    "name": "Side Plank",
    "plainName": "Side core hold",
    "category": "Core",
    "amount": 20,
    "unit": "count per side",
    "description": "Lift your hips in a side support, then repeat on the other side.",
    "steps": [
      "Lie on one side with elbow below shoulder and feet stacked or staggered.",
      "Lift your hips to align head, hips, and feet; use your bottom knee for support if needed.",
      "Hold while counting aloud, then lower and repeat the same count on the other side."
    ],
    "counting": "Count aloud to {amount} at a steady pace on each side. Lower and switch sides between holds.",
    "equipment": "bodyweight"
  },
  {
    "id": "flutter-kicks",
    "name": "Flutter Kicks",
    "plainName": "Alternating leg kicks",
    "category": "Core",
    "amount": 20,
    "unit": "cadence",
    "description": "Make small alternating leg kicks while lying on your back.",
    "steps": [
      "Lie on your back and lift both legs, with a slight knee bend if needed.",
      "Raise one leg a little as the other lowers, alternating kicks on each cadence beat.",
      "Keep your lower back down; lift your legs higher if your back starts to arch."
    ],
    "counting": "Use four-count cadence: “1, 2, 3, ONE,” then “1, 2, 3, TWO.” Each beat is one alternating kick; each full cycle is 1 rep. Complete {amount} reps in cadence.",
    "equipment": "bodyweight"
  },
  {
    "id": "bicycle-crunches",
    "name": "Freddie Mercury",
    "plainName": "Bicycle crunches",
    "category": "Core",
    "amount": 20,
    "unit": "cadence",
    "description": "Bring each knee toward the opposite shoulder with a slow twist.",
    "steps": [
      "Lie on your back with knees lifted and fingertips lightly beside your head.",
      "Turn your ribs toward one knee as the other leg extends.",
      "Return through center and switch, without pulling your neck."
    ],
    "counting": "Use four-count cadence: “1, 2, 3, ONE,” then “1, 2, 3, TWO.” Bring the right knee in, then left, right, left, twisting toward each knee. One full cycle is 1 rep; complete {amount} reps in cadence.",
    "equipment": "bodyweight",
    "aliases": [
      "Freddy Mercury",
      "Freddie Mercuries"
    ]
  },
  {
    "id": "shoulder-taps",
    "name": "Alternating Shoulder Taps",
    "plainName": "Plank shoulder taps",
    "category": "Upper body",
    "amount": 20,
    "unit": "cadence",
    "description": "Tap opposite shoulders from a steady high plank.",
    "steps": [
      "Set hands under shoulders and place feet a little wider than hips.",
      "Lift one hand to tap the opposite shoulder without turning your hips.",
      "Replace your hand and alternate sides."
    ],
    "counting": "Use four-count cadence: “1, 2, 3, ONE,” then “1, 2, 3, TWO.” Tap with your right hand, replace it, tap with your left hand, replace it. One full cycle is 1 rep; complete {amount} reps in cadence.",
    "equipment": "bodyweight",
    "aliases": [
      "Shoulder Taps"
    ]
  },
  {
    "id": "hand-release-push-ups",
    "name": "Hand-Release Merkins",
    "plainName": "Hand-release push-ups",
    "category": "Upper body",
    "amount": 10,
    "unit": "reps",
    "description": "Reset your hands on the floor between push-ups.",
    "steps": [
      "Lower from a high plank until your chest rests on the floor.",
      "Lift both hands briefly, then replace them beside your chest.",
      "Press your body up as one unit; use your knees if needed."
    ],
    "counting": "One lower, release, and press-up is 1 rep.",
    "equipment": "bodyweight",
    "aliases": [
      "Hand Release Push-ups"
    ]
  },
  {
    "id": "pike-push-ups",
    "name": "Carolina Dry Docks",
    "plainName": "Hips-high push-ups",
    "category": "Upper body",
    "amount": 5,
    "unit": "reps",
    "description": "Press through your shoulders with hips held high.",
    "steps": [
      "From hands and feet, lift hips into an upside-down V.",
      "Bend elbows and lower your head toward the floor between your hands.",
      "Stop short of the floor and push back up without collapsing your shoulders."
    ],
    "counting": "One lower and press is 1 rep.",
    "equipment": "bodyweight",
    "aliases": [
      "Pike Push-ups"
    ]
  },
  {
    "id": "mountain-climbers",
    "name": "Mountain Climbers",
    "plainName": "Plank knee drives",
    "category": "Cardio",
    "amount": 30,
    "unit": "cadence",
    "description": "Alternate knee drives from a high plank.",
    "steps": [
      "Place hands under shoulders and extend both legs.",
      "Bring one knee toward your chest, then send it back.",
      "Alternate knees at a steady pace, keeping hips from bouncing."
    ],
    "counting": "Use four-count cadence: “1, 2, 3, ONE,” then “1, 2, 3, TWO.” Drive the right, left, right, then left knee, returning each leg as the other comes forward. One full cycle is 1 rep; complete {amount} reps in cadence.",
    "equipment": "bodyweight"
  },
  {
    "id": "plank-jacks",
    "name": "Plank Jacks",
    "plainName": "Jumping feet in a plank",
    "category": "Full body",
    "amount": 15,
    "unit": "cadence",
    "description": "Move your feet out and in while holding a high plank.",
    "steps": [
      "Set hands under shoulders with your body straight.",
      "Hop both feet apart without dropping your hips.",
      "Hop them back together; step each foot out and in for less impact."
    ],
    "counting": "Use four-count cadence: “1, 2, 3, ONE,” then “1, 2, 3, TWO.” Feet out, in, out, in across the four beats. One full cycle (two jacks) is 1 rep; complete {amount} reps in cadence.",
    "equipment": "bodyweight"
  },
  {
    "id": "bear-crawl",
    "name": "Bear Crawl",
    "plainName": "Knees-off-the-ground crawl",
    "category": "Full body",
    "amount": null,
    "unit": "distance",
    "description": "Crawl with knees hovering just above the ground.",
    "steps": [
      "Start on all fours and lift your knees a few inches.",
      "Take a small step with one hand and the opposite foot.",
      "Choose a clear path and alternate limbs until you reach your chosen finish point."
    ],
    "counting": "Pick your distance. Choose a finish point, then crawl to it with controlled steps.",
    "equipment": "bodyweight"
  },
  {
    "id": "wide-push-ups",
    "name": "Werkins",
    "plainName": "Wide-hand push-ups",
    "category": "Upper body",
    "amount": 10,
    "unit": "reps",
    "description": "Use a slightly wider hand position for your push-ups.",
    "steps": [
      "Take a plank with hands just wider than shoulders, not as wide as possible.",
      "Lower your chest with elbows pointing diagonally back.",
      "Press up while keeping your trunk straight; knees down is an option."
    ],
    "counting": "One lower and press is 1 rep.",
    "equipment": "bodyweight",
    "aliases": [
      "Wide Merkins",
      "Wide Push-ups"
    ]
  },
  {
    "id": "crab-walk",
    "name": "Crab Walk",
    "plainName": "Face-up crawling",
    "category": "Full body",
    "amount": null,
    "unit": "distance",
    "description": "Take small steps on your hands and feet with hips lifted.",
    "steps": [
      "Sit with knees bent and hands on the floor behind you, fingers in a comfortable direction.",
      "Lift your hips just off the ground, keeping your shoulders supported.",
      "Choose a clear finish point and take small steps toward it with your hands and feet."
    ],
    "counting": "Pick your distance. Choose a finish point and take controlled steps toward it. Stop if your wrists or shoulders hurt.",
    "equipment": "bodyweight"
  },
  {
    "id": "big-boy-sit-ups",
    "equipment": "bodyweight",
    "name": "Big Boy Sit-ups",
    "plainName": "Full sit-ups",
    "category": "Core",
    "amount": 15,
    "unit": "reps",
    "description": "Sit all the way up with bent knees, then lower under control.",
    "steps": [
      "Lie on your back with knees bent, feet flat, and arms reaching overhead.",
      "Lift your torso toward your thighs and reach your hands toward your knees.",
      "Lower your back to the ground with control; keep your neck relaxed."
    ],
    "counting": "One complete sit-up and return is 1 rep.",
    "aliases": [
      "BBSU",
      "World War II Sit-up",
      "WWII"
    ]
  },
  {
    "id": "peter-parkers",
    "equipment": "bodyweight",
    "name": "Peter Parkers",
    "plainName": "Plank knee-to-elbow drives",
    "category": "Core",
    "amount": 20,
    "unit": "cadence",
    "description": "Bring one knee outside toward the same-side elbow, then alternate.",
    "steps": [
      "Start in a high plank with hands below shoulders and your body in a straight line.",
      "Bring your right knee out toward your right elbow without dropping your hips.",
      "Return to plank and repeat on the left; move slowly and alternate sides."
    ],
    "counting": "Use four-count cadence: “1, 2, 3, ONE,” then “1, 2, 3, TWO.” Right knee to right elbow, return to plank, left knee to left elbow, return to plank. One full cycle is 1 rep; complete {amount} reps in cadence.",
    "aliases": [
      "Spiderman Plank"
    ]
  },
  {
    "id": "block-curls",
    "name": "Curls for the Girls",
    "plainName": "Block biceps curls",
    "category": "Upper body",
    "amount": 10,
    "unit": "reps",
    "description": "Curl the block toward your chest without swinging your body.",
    "steps": [
      "Hold the block securely with both hands in front of your thighs, feet hip-width apart.",
      "Keep elbows near your ribs and bend them to lift the block toward your chest.",
      "Lower slowly, keeping your torso still and wrists straight."
    ],
    "counting": "One curl and controlled lower is 1 rep.",
    "equipment": "block",
    "aliases": [
      "Block Curls"
    ]
  },
  {
    "id": "block-rows",
    "name": "Bent Over Rows",
    "plainName": "Block rows",
    "category": "Upper body",
    "amount": 10,
    "unit": "reps",
    "description": "Hinge forward and pull the block toward your lower ribs.",
    "steps": [
      "Grip the block with both hands, soften your knees, and push your hips back.",
      "Keep your back long and torso still as you draw your elbows back beside your ribs.",
      "Lower the block until your arms are long again, without rounding your back."
    ],
    "counting": "One pull and lower is 1 rep.",
    "equipment": "block",
    "aliases": [
      "Block Rows"
    ]
  },
  {
    "id": "block-press",
    "name": "Overhead Press",
    "plainName": "Block shoulder press",
    "category": "Upper body",
    "amount": 5,
    "unit": "reps",
    "description": "Press a manageable block overhead, then lower it with control.",
    "steps": [
      "Hold the block at upper-chest height with a secure two-hand grip and feet planted.",
      "Brace your middle and press upward, clearing your face without leaning backward.",
      "Lower slowly to your chest. Use a lighter block if you cannot control the full movement."
    ],
    "counting": "One press and return to chest height is 1 rep.",
    "equipment": "block",
    "aliases": [
      "Block Press"
    ]
  },
  {
    "id": "block-thrusters",
    "name": "Thrusters",
    "plainName": "Block squat to overhead press",
    "category": "Full body",
    "amount": 5,
    "unit": "reps",
    "description": "Stand from a squat into a controlled overhead block press.",
    "steps": [
      "Hold the block close to your upper chest with both hands and feet shoulder-width apart.",
      "Squat to a comfortable depth, then drive through your feet to stand and press overhead.",
      "Bring the block back to your chest before the next squat; keep your back from arching."
    ],
    "counting": "One squat, overhead press, and return to chest height is 1 rep.",
    "equipment": "block",
    "aliases": [
      "Block Thrusters"
    ]
  },
  {
    "id": "block-goblet-squats",
    "name": "Goblet Squats",
    "plainName": "Chest-held block squats",
    "category": "Legs",
    "amount": 10,
    "unit": "reps",
    "description": "Keep the block close to your chest as you squat and stand.",
    "steps": [
      "Hold the block with both hands against your chest, feet about shoulder-width apart.",
      "Sit down between your hips with heels grounded and knees following your toes.",
      "Push through your feet to stand tall, keeping the block close throughout."
    ],
    "counting": "One squat and stand is 1 rep.",
    "equipment": "block",
    "aliases": [
      "Block Goblet Squats"
    ]
  },
  {
    "id": "block-deadlifts",
    "name": "Deadlifts",
    "plainName": "Block lift from the ground",
    "category": "Full body",
    "amount": 10,
    "unit": "reps",
    "description": "Lift the block from the ground by driving through your hips and legs.",
    "steps": [
      "Set the block between your feet. Hinge back and bend your knees to grip it with both hands.",
      "Brace your middle, keep your back long, and push through your feet to stand with the block close.",
      "Push your hips back and bend your knees to place the block down gently, clear of your feet."
    ],
    "counting": "One lift from the ground and controlled set-down is 1 rep.",
    "equipment": "block",
    "aliases": [
      "Block Deadlifts"
    ]
  },
  {
    "id": "block-swings",
    "name": "Block Swings",
    "plainName": "Hip-driven block swings",
    "category": "Full body",
    "amount": 10,
    "unit": "reps",
    "description": "Use your hips to swing the block forward to chest height.",
    "steps": [
      "Stand with feet wide enough for the block, holding its sides securely with both hands.",
      "With soft knees and a long back, hinge your hips so the block travels between your legs.",
      "Drive your hips forward so the block floats no higher than your chest; keep arms long, then hinge again."
    ],
    "counting": "Each forward swing and return is 1 rep.",
    "equipment": "block",
    "aliases": [
      "Coupon Swings",
      "Coupon Kettle Bell Swing",
      "Kettlebell Swings"
    ]
  },
  {
    "id": "man-makers",
    "name": "Man Makers",
    "plainName": "Block burpee + overhead press",
    "category": "Full body",
    "amount": 5,
    "unit": "reps",
    "description": "The block-burpee version: one push-up, stand, and overhead press.",
    "steps": [
      "Set the block flat on firm ground, grip its sides, and step or hop back into a plank.",
      "Do one push-up on the stable block, then bring your feet back beside it.",
      "Stand with the block, press it overhead under control, then lower it back to the ground."
    ],
    "counting": "One push-up, stand, overhead press, and set-down is 1 rep.",
    "equipment": "block",
    "aliases": [
      "Manmaker",
      "Manmaker Burpee",
      "Man-Maker",
      "Blockee",
      "Blockees",
      "Blockies"
    ]
  },
  {
    "id": "block-chest-press",
    "name": "Chest Press",
    "plainName": "Floor press with a block",
    "category": "Upper body",
    "amount": 10,
    "unit": "reps",
    "description": "Press the block up over your chest while lying on the ground.",
    "steps": [
      "Lie on your back with knees bent and feet planted, holding the block securely at your chest.",
      "Press the block straight up over your chest, keeping both hands firmly on it.",
      "Lower slowly until your upper arms meet the ground; keep the block away from your face."
    ],
    "counting": "One press and controlled lower is 1 rep.",
    "equipment": "block",
    "aliases": [
      "Coupon Chest Press",
      "Block Bench Press",
      "Floor Press"
    ]
  },
  {
    "id": "skull-crushers",
    "name": "Skull Crushers",
    "plainName": "Overhead triceps extensions",
    "category": "Upper body",
    "amount": 5,
    "unit": "reps",
    "description": "Bend and straighten your elbows with a manageable block held overhead.",
    "steps": [
      "Stand braced with a controllable block held overhead in a secure two-hand grip.",
      "Keep elbows pointing forward as you slowly bend them to lower the block behind your head.",
      "Straighten your elbows to lift the block again; keep upper arms still and avoid arching your back."
    ],
    "counting": "One lower and elbow extension is 1 rep.",
    "equipment": "block",
    "aliases": [
      "Tricep Extensions",
      "Triceps Extensions",
      "Coupon Skull Crushers",
      "Skullcrushers"
    ]
  },
  {
    "id": "block-reverse-lunges",
    "name": "Coupon Lunges",
    "plainName": "Block reverse lunges",
    "category": "Legs",
    "amount": 10,
    "unit": "reps",
    "description": "Step back into alternating lunges with the block close to your chest.",
    "steps": [
      "Stand tall holding the block at your chest with both hands and elbows tucked.",
      "Step one foot backward and bend both knees, keeping your front heel grounded.",
      "Push through your front foot to stand; regain balance, then switch legs."
    ],
    "counting": "Each backward lunge and return is 1 rep; {amount} total ({split}).",
    "equipment": "block",
    "aliases": [
      "Block Reverse Lunges",
      "Weighted Lunges"
    ]
  },
  {
    "id": "rifle-carry",
    "name": "Rifle Carry",
    "plainName": "Overhead block carry",
    "category": "Full body",
    "amount": null,
    "unit": "distance",
    "description": "Walk with the block held steadily overhead.",
    "steps": [
      "Press the block overhead using a secure two-hand grip and brace your middle.",
      "Keep arms extended and ribs down as you walk slowly along a clear, level path.",
      "Use short, controlled steps; lower the block to your chest before turning or resting."
    ],
    "counting": "Pick your distance. Choose a clear, level path and walk to your finish point with short, controlled steps.",
    "equipment": "block",
    "aliases": [
      "Overhead Carry",
      "Coupon Carry"
    ]
  },
  {
    "id": "murder-bunnies",
    "name": "Murder Bunnies",
    "plainName": "Move block, then hop forward",
    "category": "Full body",
    "amount": null,
    "unit": "distance",
    "description": "Move the block forward, then hop your feet up beside it.",
    "steps": [
      "On clear, level ground, stand with your feet straddling a block laid flat lengthwise.",
      "Bend your knees and hips, grip the sides, and move the block a short reach forward.",
      "Set it down firmly, brace on it, and hop your feet forward to straddle it again; land softly."
    ],
    "counting": "Pick your distance. Choose a clear finish point, then repeat the block move and hop until you reach it.",
    "equipment": "block",
    "aliases": [
      "Murder Bunny",
      "Coupon Bunny Hops"
    ]
  },
  {
    "id": "block-merkins",
    "name": "Block Merkins",
    "plainName": "Push-ups with hands on a block",
    "category": "Upper body",
    "amount": 10,
    "unit": "reps",
    "description": "Perform a push-up with both hands supported on a stable block.",
    "steps": [
      "Lay the block flat on firm ground, place both hands on it, and step back into a plank.",
      "Keep your body straight as you bend your elbows and lower your chest toward the block.",
      "Press back up without letting the block tip or slide; lower your knees for a modification."
    ],
    "counting": "One push-up and return to plank is 1 rep.",
    "equipment": "block",
    "aliases": [
      "Coupon Merkins",
      "Block Push-ups",
      "Incline Merkins",
      "Block Irkins"
    ]
  }
];

// Retain saved preferences for retired cards without exposing them to Browse or draws.
// Stable IDs also preserve stars/exclusions when a movement gets its F3 display name.
export const knownExerciseIds: ReadonlySet<string> = new Set([
  ...exercises.map(({ id }) => id),
  'side-straddle-hops',
  'side-lunges',
  'sumo-squats',
  'calf-raises',
  'glute-bridges',
  'dead-bugs',
  'bird-dogs',
  'reverse-crunches',
  'arm-circles',
  'high-knees',
  'skater-hops',
  'inchworms',
  'knee-push-ups',
  'close-grip-push-ups',
  'scapular-push-ups',
  'plank-up-downs',
  'prone-y-raises',
  'prone-t-raises',
  'split-squats',
  'single-leg-bridges',
  'side-lying-leg-lifts',
  'donkey-kicks',
  'heel-taps',
  'hollow-hold',
  'seated-knee-tucks',
  'butt-kicks',
  'fast-feet',
  'step-jacks',
  'front-clap-jacks',
  'lateral-shuffle',
  'boxer-shuffle',
  'standing-cross-knees',
  'pogo-hops',
  'squat-thrusts',
  'reverse-tabletop',
  'walkout-push-ups',
  'bear-shoulder-taps',
  'lateral-bear-crawl',
  'down-dog-to-plank',
  'squat-knee-drives',
  'block-sumo-squats',
  'block-romanian-deadlifts',
  'block-split-squats',
  'block-lateral-lunges',
  'block-calf-raises',
  'block-bear-hug-carry',
  'block-march',
  'block-squat-hold',
  'block-curl-hold',
]);

/** Exclusions override every draw deck without deleting saved favorites. */
export function filterExercises(
  equipment: EquipmentFilter,
  favoriteIds?: readonly string[],
  excludedIds: readonly string[] = [],
): readonly Exercise[] {
  return exercises.filter((exercise) =>
    (equipment === 'all' || exercise.equipment === equipment)
    && (favoriteIds === undefined || favoriteIds.includes(exercise.id))
    && !excludedIds.includes(exercise.id));
}

/** Keep an eligible card; replace an excluded card, or clear an empty selection. */
export function reconcileExercise(
  current: Exercise | null,
  deck: readonly Exercise[],
  previousId?: string,
  random: () => number = Math.random,
): Exercise | undefined {
  return current && deck.some(({ id }) => id === current.id)
    ? current : drawExercise(previousId, random, deck);
}

/** Uniform choice from the selected deck. One-card decks can only return that card. */
export function drawExercise(
  previousId?: string,
  random: () => number = Math.random,
  deck: readonly Exercise[] = exercises,
): Exercise | undefined {
  if (deck.length === 0) return undefined;
  const alternatives = deck.filter((exercise) => exercise.id !== previousId);
  const eligible = alternatives.length ? alternatives : deck;
  const value = random();
  if (!Number.isFinite(value) || value < 0 || value >= 1) {
    throw new RangeError('Random value must be in [0, 1).');
  }
  return eligible[Math.floor(value * eligible.length)];
}
