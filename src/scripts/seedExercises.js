import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI

// Schema
const exerciseSchema = new mongoose.Schema(
  {
    wgerId: { type: Number, unique: true, required: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, default: null },
    muscle: { type: String, default: 'Unknown' },
    equipment: { type: [String], default: [] },
    image: { type: String, default: null },
  },
  { timestamps: true },
)

// Indexes (bra för sök/filter senare)
exerciseSchema.index({ name: 'text' })
exerciseSchema.index({ category: 1 })
exerciseSchema.index({ muscle: 1 })

const Exercise = mongoose.model('Exercise', exerciseSchema)

// Fetch med basic error check
async function fetchAllExercises() {
  let url = 'https://wger.de/api/v2/exerciseinfo/?limit=100'
  let all = []

  while (url) {
    const res = await fetch(url)

    if (!res.ok) {
      throw new Error(`Fetch failed: ${res.status}`)
    }

    const data = await res.json()

    all = [...all, ...data.results]
    url = data.next
  }

  return all
}

// Mapping
function mapExercise(ex) {
  const translation = ex.translations?.find((t) => t.language === 2)

  if (!translation || !translation.name) return null

  return {
    wgerId: ex.id,
    name: translation.name,
    category: ex.category?.name || null,
    muscle: ex.muscles?.[0]?.name || null,
    equipment: ex.equipment?.length
      ? ex.equipment.map((e) => e.name)
      : ['Bodyweight'],
    image: ex.images?.[0]?.image
      ? `https://wger.de${ex.images[0].image}`
      : null,
  }
}

// Main
async function run() {
  try {
    console.log('Connecting to DB...')
    await mongoose.connect(MONGO_URI)

    console.log('Dropping collection...')
    await mongoose.connection.dropCollection('exercises').catch(() => {})

    const raw = await fetchAllExercises()
    console.log(`Fetched: ${raw.length} exercises`)

    const mappedExercises = raw.map(mapExercise).filter(Boolean)

    console.log(`Saving ${mappedExercises.length} exercises...`)

    // ordered: false = skip duplicates istället för att krascha
    await Exercise.insertMany(mappedExercises, { ordered: false })

    console.log('Done seeding ✅')
  } catch (err) {
    console.error('Error seeding:', err.message)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from DB')
  }
}

run()
