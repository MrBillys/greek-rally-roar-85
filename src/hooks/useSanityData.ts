
import { useState, useEffect } from "react";
import { client } from "@/lib/sanity";
import type { 
  Rally, Driver, RallyResult, OverallStanding, Stage, 
  StageResult, Team, Car, Entry, Penalty, Championship
} from "@/types/schema";

/**
 * Hook to fetch all rallies from Sanity
 */
export function useRallies() {
  const [rallies, setRallies] = useState<Rally[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch all rallies with related data
    client.fetch(`
      *[_type == "rally"] {
        _id,
        title,
        shortCode,
        date,
        location,
        status,
        organizer,
        website,
        image,
        description,
        championship->{_id, name},
        slug,
        specialStages[] {
          name,
          distance,
          status,
          startTime
        }
      } | order(date asc)
    `)
    .then(data => {
      setRallies(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err);
      setLoading(false);
    });
  }, []);

  return { rallies, loading, error };
}

/**
 * Hook to fetch a specific rally by slug
 */
export function useRallyBySlug(slug: string | undefined) {
  const [rally, setRally] = useState<Rally | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Fetch rally by slug with all related data
    client.fetch(`
      *[_type == "rally" && slug.current == $slug][0] {
        _id,
        title,
        shortCode,
        date,
        location,
        status,
        organizer,
        website,
        image,
        description,
        championship->{_id, name},
        slug,
        specialStages[] {
          name,
          distance,
          status,
          startTime
        }
      }
    `, { slug })
    .then(data => {
      setRally(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err);
      setLoading(false);
    });
  }, [slug]);

  return { rally, loading, error };
}

/**
 * Hook to fetch a specific rally by shortCode
 */
export function useRallyByShortCode(shortCode: string | undefined) {
  const [rally, setRally] = useState<Rally | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!shortCode) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Fetch rally by shortCode with all related data
    client.fetch(`
      *[_type == "rally" && shortCode == $shortCode][0] {
        _id,
        title,
        shortCode,
        date,
        location,
        status,
        organizer,
        website,
        image,
        description,
        championship->{_id, name},
        slug,
        specialStages[] {
          name,
          distance,
          status,
          startTime
        }
      }
    `, { shortCode })
    .then(data => {
      setRally(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err);
      setLoading(false);
    });
  }, [shortCode]);

  return { rally, loading, error };
}

/**
 * Hook to fetch all drivers
 */
export function useDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch all drivers with related team data
    client.fetch(`
      *[_type == "driver"] {
        _id,
        name,
        birthDate,
        nationality,
        photo,
        team->{
          _id, 
          name,
          country,
          logo
        },
        bio,
        championships,
        podiums,
        slug
      } | order(name asc)
    `)
    .then(data => {
      setDrivers(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err);
      setLoading(false);
    });
  }, []);

  return { drivers, loading, error };
}

/**
 * Hook to fetch a specific driver by slug
 */
export function useDriverBySlug(slug: string | undefined) {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Fetch driver by slug with related team data
    client.fetch(`
      *[_type == "driver" && slug.current == $slug][0] {
        _id,
        name,
        birthDate,
        nationality,
        photo,
        team->{
          _id, 
          name,
          country,
          logo
        },
        bio,
        championships,
        podiums,
        slug
      }
    `, { slug })
    .then(data => {
      setDriver(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err);
      setLoading(false);
    });
  }, [slug]);

  return { driver, loading, error };
}

/**
 * Hook to fetch rally results for a specific rally
 */
export function useRallyResults(rallyId: string | undefined) {
  const [results, setResults] = useState<RallyResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!rallyId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Fetch rally results with entry details
    client.fetch(`
      *[_type == "rallyResult" && rallyId == $rallyId] | order(position asc) {
        _id,
        rallyId,
        rallyName,
        position,
        totalTime,
        gap,
        retired,
        entry->{
          _id,
          number,
          driver->{name, nationality},
          coDriver->{name, nationality},
          car->{make, model, category},
          team->{name, logo}
        },
        date
      }
    `, { rallyId })
    .then(data => {
      setResults(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err);
      setLoading(false);
    });
  }, [rallyId]);

  return { results, loading, error };
}

/**
 * Hook to fetch stage results for a specific stage
 */
export function useStageResults(stageId: string | undefined) {
  const [results, setResults] = useState<StageResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!stageId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Fetch stage results with entry details
    client.fetch(`
      *[_type == "stageResult" && stageId == $stageId] | order(position asc) {
        _id,
        stageId,
        stageName,
        rallyId,
        rallyName,
        position,
        stageTime,
        gap,
        cumulativeTime,
        retired,
        onboardLink,
        entry->{
          _id,
          number,
          driver->{name, nationality},
          coDriver->{name, nationality},
          car->{make, model, category},
          team->{name, logo}
        }
      }
    `, { stageId })
    .then(data => {
      setResults(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err);
      setLoading(false);
    });
  }, [stageId]);

  return { results, loading, error };
}

/**
 * Hook to fetch all live results across all rallies
 */
export function useLiveResults() {
  const [results, setResults] = useState<StageResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch all stage results ordered by date (most recent first)
    client.fetch(`
      *[_type == "stageResult"] | order(date desc) {
        _id,
        stageId,
        stageName,
        rallyId,
        rallyName,
        position,
        stageTime,
        gap,
        cumulativeTime,
        retired,
        results[] {
          position,
          driver,
          time,
          gap,
          carNumber,
          status
        }
      }
    `)
    .then(data => {
      setResults(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err);
      setLoading(false);
    });
  }, []);

  return { results, loading, error };
}

/**
 * Hook to fetch overall championship standings
 */
export function useOverallStandings() {
  const [standings, setStandings] = useState<OverallStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch all overall standings ordered by most recent
    client.fetch(`
      *[_type == "overallStanding"] | order(date desc) {
        _id,
        rallyId,
        rallyName,
        position,
        points,
        entry->{
          _id,
          number,
          driver->{name, nationality},
          car->{make, model, category},
          team->{name, logo}
        },
        date,
        standings[] {
          position,
          driver,
          totalTime,
          gap,
          carNumber,
          points
        }
      }
    `)
    .then(data => {
      setStandings(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err);
      setLoading(false);
    });
  }, []);

  return { standings, loading, error };
}

/**
 * Hook to fetch teams
 */
export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch all teams with related driver and car data
    client.fetch(`
      *[_type == "team"] {
        _id,
        name,
        country,
        logo,
        drivers[]->{
          _id,
          name,
          nationality,
          photo
        },
        cars[]->{
          _id,
          make,
          model,
          category
        },
        slug
      } | order(name asc)
    `)
    .then(data => {
      setTeams(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err);
      setLoading(false);
    });
  }, []);

  return { teams, loading, error };
}

/**
 * Hook to fetch rally entries for a specific rally
 */
export function useRallyEntries(rallyId: string | undefined) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!rallyId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Fetch entries for a specific rally with related details
    client.fetch(`
      *[_type == "entry" && rally._ref == $rallyId] | order(number asc) {
        _id,
        number,
        driver->{
          _id,
          name,
          nationality,
          photo
        },
        coDriver->{
          _id,
          name,
          nationality,
          photo
        },
        car->{
          _id,
          make,
          model,
          category
        },
        team->{
          _id,
          name,
          country,
          logo
        },
        category
      }
    `, { rallyId })
    .then(data => {
      setEntries(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err);
      setLoading(false);
    });
  }, [rallyId]);

  return { entries, loading, error };
}

/**
 * Hook to fetch penalties for a specific entry
 */
export function usePenalties(entryId: string | undefined) {
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!entryId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // Fetch penalties for a specific entry
    client.fetch(`
      *[_type == "penalty" && entry._ref == $entryId] | order(dateApplied desc) {
        _id,
        type,
        timeAdded,
        reason,
        entry->{
          _id,
          number,
          driver->{name},
          team->{name}
        },
        stage->{
          _id,
          name
        },
        dateApplied
      }
    `, { entryId })
    .then(data => {
      setPenalties(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err);
      setLoading(false);
    });
  }, [entryId]);

  return { penalties, loading, error };
}

/**
 * Hook to fetch championships
 */
export function useChampionships() {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch all championships with related rally data
    client.fetch(`
      *[_type == "championship"] {
        _id,
        name,
        seasonStart,
        seasonEnd,
        rallies[]->{
          _id,
          title,
          shortCode,
          date,
          location,
          status
        },
        slug
      } | order(seasonStart desc)
    `)
    .then(data => {
      setChampionships(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err);
      setLoading(false);
    });
  }, []);

  return { championships, loading, error };
}
