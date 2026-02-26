export const workoutOptions = [
  {
    id: 1,
    name: "Option 1",
    tag: "Legs",
    focus: "Lower body strength and stability.",
    targets: "Quads, hamstrings, glutes, calves",
    exercises: "Squats, lunges, Romanian deadlifts",
  },
  {
    id: 2,
    name: "Option 2",
    tag: "Pull",
    focus: "Back and biceps for pulling strength.",
    targets: "Lats, traps, biceps",
    exercises: "Pull-ups, rows, face pulls",
  },
  {
    id: 3,
    name: "Option 3",
    tag: "Push",
    focus: "Pushing muscles for chest and shoulders.",
    targets: "Chest, shoulders, triceps",
    exercises: "Bench press, overhead press, dips",
  },
  {
    id: 4,
    name: "Option 4",
    tag: "Core",
    focus: "Core stability and control work.",
    targets: "Abs, obliques, lower back",
    exercises: "Planks, dead bugs, pallof press",
  },
  {
    id: 5,
    name: "Option 5",
    tag: "Upper",
    focus: "Upper body mix with arms focus.",
    targets: "Chest, back, arms",
    exercises: "Incline press, rows, curls",
  },
  {
    id: 6,
    name: "Option 6",
    tag: "Full Body",
    focus: "Balanced strength for the whole body.",
    targets: "Full body",
    exercises: "Goblet squats, push-ups, rows",
  },
  {
    id: 7,
    name: "Option 7",
    tag: "Cardio",
    focus: "Heart rate and endurance focus.",
    targets: "Cardio system",
    exercises: "Intervals, cycling, jump rope",
  },
  {
    id: 8,
    name: "Option 8",
    tag: "Rest / Mobility",
    focus: "Recovery, stretching, and mobility.",
    targets: "Hips, shoulders, ankles",
    exercises: "Mobility flows, stretching",
  },
]

export const getOptionLabel = (option) =>
  `${option.name} — ${option.tag}`
