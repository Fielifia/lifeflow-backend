const classifyExercise = (exercise) => {
  const name = exercise.name.toLowerCase()

  let target = exercise.bodyPart
  let region = null
  let type = 'compound'

  // =========================
  // TYPE (rörelsetyp)
  // =========================
  if (
    name.includes('plyo') ||
    name.includes('ball') ||
    name.includes('throw') ||
    name.includes('explosive')
  ) {
    type = 'explosive'
  } else if (name.includes('isometric') || name.includes('squeeze')) {
    type = 'isometric'
  } else if (
    name.includes('fly') ||
    name.includes('crossover') ||
    name.includes('raise') ||
    name.includes('pullover')
  ) {
    type = 'isolation'
  }

  // =========================
  // CHEST
  // =========================
  if (target === 'chest') {
    // ===== REGION =====

    // UPPER CHEST
    if (
      name.includes('incline') ||
      name.includes('low cable') ||
      name.includes('feet elevated')
    ) {
      region = 'upper'
    }

    // LOWER CHEST
    else if (
      name.includes('decline') ||
      name.includes('dip') ||
      name.includes('iron cross') ||
      name.includes('high cable')
    ) {
      region = 'lower'
    }

    // CABLE SPECIAL CASE (viktig!)
    else if (name.includes('cable crossover')) {
      if (name.includes('low')) {
        region = 'upper'
      } else if (name.includes('high')) {
        region = 'lower'
      } else {
        region = 'middle'
      }
    }

    // PUSHUPS SPECIAL
    else if (name.includes('push')) {
      if (name.includes('decline')) {
        region = 'lower'
      } else if (name.includes('incline') || name.includes('elevated')) {
        region = 'upper'
      } else {
        region = 'middle'
      }
    }

    // PULLOVER (hybrid men vi placerar smart)
    else if (name.includes('pullover')) {
      region = 'lower'
      type = 'isolation'
    }

    // DEFAULT
    else {
      region = 'middle'
    }

    // ===== TYPE FIXES =====
    if (
      name.includes('bench') ||
      name.includes('press') ||
      name.includes('push-up') ||
      name.includes('pushup')
    ) {
      if (type !== 'explosive') {
        type = 'compound'
      }
    }

    // ===== REMOVE NON-CHEST =====
    if (name.includes('front raise') || name.includes('heavy bag')) {
      return null
    }
  }

  // =========================
  // SHOULDERS
  // =========================
  if (target === 'shoulders') {
    // ===== REGION =====

    // FRONT DELT
    if (
      name.includes('press') ||
      name.includes('arnold') ||
      name.includes('front raise')
    ) {
      region = 'front'
    }

    // SIDE DELT
    else if (name.includes('lateral') || name.includes('side raise')) {
      region = 'side'
      type = 'isolation'
    }

    // REAR DELT
    else if (
      name.includes('rear') ||
      name.includes('reverse') ||
      name.includes('face pull') ||
      name.includes('rear delt')
    ) {
      region = 'rear'
      type = 'isolation'
    }

    // DEFAULT
    else {
      region = 'front'
    }

    // ===== TYPE FIXES =====
    if (name.includes('raise')) {
      type = 'isolation'
    }

    if (name.includes('press') || name.includes('push press')) {
      type = 'compound'
    }
  }

  return {
    ...exercise,
    target,
    region,
    type,
  }
}
