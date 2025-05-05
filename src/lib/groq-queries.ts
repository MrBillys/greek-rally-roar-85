
/**
 * Examples of GROQ queries for the Rally Results platform
 * 
 * This file contains example queries for extracting specific data from the Sanity dataset.
 * These can be used as reference when building components that need to access specific data.
 */

/**
 * Rally Results Query
 * 
 * Purpose: Filter results by rallyCode (shortCode) and order results by position.
 * 
 * Gets results for a specific rally, including:
 * - Position in the rally
 * - Total time
 * - Gap to leader
 * - Whether the team retired
 * - Entry details (driver, co-driver, car, team)
 * 
 * @param rallyCode - The shortCode of the rally
 */
export const rallyResultsQuery = `
*[_type == "rallyResult" && rally->shortCode == $rallyCode] | order(position asc) {
  position,
  totalTime,
  gap,
  retired,
  entry->{
    number,
    driver->{name, nationality},
    coDriver->{name, nationality},
    car->{make, model, category},
    team->{name, logo}
  }
}
`;

/**
 * Stage Results Query
 * 
 * Purpose: Get results of a specific stage by stageName and rallyCode, ordered by position.
 * 
 * Gets detailed results for a specific stage, including:
 * - Position in the stage
 * - Stage time
 * - Gap to stage leader
 * - Cumulative time
 * - Retirement status
 * - Onboard video link
 * - Entry details
 * 
 * @param stageName - The name of the stage
 * @param rallyCode - The shortCode of the rally
 */
export const stageResultsQuery = `
*[_type == "stageResult" && stage->name == $stageName && stage->rally->shortCode == $rallyCode] | order(position asc) {
  position,
  stageTime,
  gap,
  cumulativeTime,
  retired,
  onboardLink,
  entry->{
    number,
    driver->{name, nationality},
    coDriver->{name, nationality},
    car->{make, model, category}
  }
}
`;

/**
 * Rally Stages Query
 * 
 * Purpose: Retrieve all stages of a specific rally, ordered by stage name.
 * 
 * Gets all stages for a rally, including:
 * - Stage name
 * - Distance
 * - Status
 * - Start time
 * 
 * @param rallyCode - The shortCode of the rally
 */
export const rallyStagesQuery = `
*[_type == "stage" && rally->shortCode == $rallyCode] | order(name asc) {
  _id,
  name,
  distance,
  status,
  startTime
}
`;

/**
 * Penalties Query
 * 
 * Purpose: Retrieve penalties applied to a specific team.
 * 
 * Gets all penalties for an entry, including:
 * - Type of penalty
 * - Time added
 * - Reason
 * - Stage where penalty was applied
 * - Date applied
 * 
 * @param entryNumber - The entry number of the team
 */
export const penaltiesQuery = `
*[_type == "penalty" && entry->number == $entryNumber] {
  type,
  timeAdded,
  reason,
  stage->name,
  dateApplied
}
`;

/**
 * Driver Results Query
 * 
 * Purpose: Filter results by a specific driver's name.
 * 
 * Gets all rally results for a specific driver, including:
 * - Position
 * - Total time
 * - Gap
 * - Retirement status
 * - Entry details
 * 
 * @param driverName - The name of the driver
 */
export const driverResultsQuery = `
*[_type == "rallyResult" && entry->driver->name == $driverName] {
  position,
  totalTime,
  gap,
  retired,
  entry->{
    driver->{name, nationality},
    coDriver->{name, nationality},
    car->{make, model, category},
    team->{name, logo}
  },
  rally->{title, date, location}
}
`;

/**
 * Team/Car Class Results Query
 * 
 * Purpose: Filter results by a specific team or car class.
 * 
 * Gets rally results for a specific team and car class, including:
 * - Position
 * - Total time
 * - Gap
 * - Retirement status
 * - Entry details
 * 
 * @param teamName - The name of the team
 * @param carClass - The category/class of the car
 */
export const teamCarClassResultsQuery = `
*[_type == "rallyResult" && entry->team->name == $teamName && entry->car->category == $carClass] {
  position,
  totalTime,
  gap,
  retired,
  entry->{
    driver->{name, nationality},
    coDriver->{name, nationality},
    car->{make, model, category},
    team->{name, logo}
  },
  rally->{title, date, location}
}
`;

/**
 * Championship Standings Query
 * 
 * Purpose: Get overall championship standings for a specific championship.
 * 
 * Gets point standings for all drivers in a championship.
 * 
 * @param championshipId - The ID of the championship
 */
export const championshipStandingsQuery = `
*[_type == "overallStanding" && championship._ref == $championshipId] | order(position asc) {
  position,
  points,
  entry->{
    driver->{name, nationality},
    team->{name},
    car->{category}
  }
}
`;

/**
 * Upcoming Rallies Query
 * 
 * Purpose: Get all upcoming rallies.
 * 
 * Gets details of all rallies with 'upcoming' status.
 */
export const upcomingRalliesQuery = `
*[_type == "rally" && status == "upcoming"] | order(date asc) {
  _id,
  title,
  shortCode,
  date,
  location,
  status,
  organizer,
  image,
  slug
}
`;

/**
 * Ongoing Rally Query
 * 
 * Purpose: Get the currently ongoing rally.
 * 
 * Gets details of any rally with 'in-progress' status.
 */
export const ongoingRallyQuery = `
*[_type == "rally" && status == "in-progress"][0] {
  _id,
  title,
  shortCode,
  date,
  location,
  status,
  organizer,
  image,
  slug,
  specialStages[] {
    name,
    distance,
    status,
    startTime
  }
}
`;

/**
 * Competitor Statistics Query
 * 
 * Purpose: Get comprehensive statistics for a specific driver.
 * 
 * Gets participation history, wins, podiums for a specific driver.
 * 
 * @param driverId - The ID of the driver
 */
export const competitorStatsQuery = `
{
  "driver": *[_type == "driver" && _id == $driverId][0] {
    name,
    nationality,
    photo,
    championships,
    podiums,
    team->{name}
  },
  "rallyResults": *[_type == "rallyResult" && entry->driver->_id == $driverId] {
    position,
    rally->{title, date},
    totalTime
  },
  "wins": count(*[_type == "rallyResult" && entry->driver->_id == $driverId && position == 1]),
  "podiums": count(*[_type == "rallyResult" && entry->driver->_id == $driverId && position <= 3])
}
`;

/**
 * Latest Results Query
 * 
 * Purpose: Get the most recent rally results.
 * 
 * Gets results from the most recently completed rally.
 */
export const latestResultsQuery = `
*[_type == "rally" && status == "completed"] | order(date desc)[0] {
  title,
  date,
  location,
  "results": *[_type == "rallyResult" && rally._ref == ^._id] | order(position asc) {
    position,
    totalTime,
    gap,
    entry->{
      driver->{name},
      team->{name},
      car->{make, model}
    }
  }
}
`;
