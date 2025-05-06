
import { useState, useEffect } from "react";
import { client } from "@/lib/sanity";
import type { 
  Rally, Driver, RallyResult, OverallStanding, Stage, 
  StageResult, Team, Car, Entry, Penalty, Championship
} from "@/types/schema";
import { toast } from "@/components/ui/use-toast";

/**
 * Helper function to map API data to match component props
 */
const mapRallyToCardProps = (rally: any) => {
  return {
    _id: rally._id,
    name: rally.title || rally.name, // Handle both field names
    location: rally.location,
    date: rally.date,
    image: rally.image,
    status: rally.status,
    slug: rally.slug
  };
};

const mapDriverToCardProps = (driver: any) => {
  return {
    _id: driver._id,
    name: driver.name,
    nationality: driver.nationality,
    image: driver.photo, // Map photo to image for consistency
    car: driver.car ? `${driver.car.make} ${driver.car.model}` : 'Unknown',
    team: driver.team ? driver.team.name : 'Independent',
    championships: driver.championships || 0,
    podiums: driver.podiums || 0,
    bio: driver.bio || ''
  };
};

/**
 * Hook to fetch all rallies from Sanity
 */
export function useRallies() {
  const [rallies, setRallies] = useState<any[]>([]);
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
      setRallies(data.map(mapRallyToCardProps));
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
  const [rally, setRally] = useState<any | null>(null);
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
      setRally(data ? mapRallyToCardProps(data) : null);
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
 * Hook to fetch a specific rally by ID
 */
export function useRallyById(slug: string | undefined) {
  const [rally, setRally] = useState<any | null>(null);
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
        "specialStages": *[_type == "stage" && references(^._id)] | order(_createdAt asc) {
          _id,
          name,
          distance,
          status,
          "startTime": startTime
        }
      }
    `, { slug })
    .then(data => {
      if (data) {
        // Debug info for special stages
        console.log('Special stages from query:', data.specialStages);
        
        setRally({
          _id: data._id,
          name: data.title,
          shortCode: data.shortCode,
          date: data.date,
          location: data.location,
          status: data.status,
          organizer: data.organizer,
          website: data.website,
          image: data.image,
          description: data.description,
          championship: data.championship,
          slug: data.slug,
          specialStages: data.specialStages || []
        });
      } else {
        setRally(null);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching rally:", err);
      setError(err);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to load rally details",
        variant: "destructive",
      });
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
  const [drivers, setDrivers] = useState<any[]>([]);
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
        slug,
        "car": *[_type == "car" && references(^._id)][0]{
          make, 
          model
        }
      } | order(name asc)
    `)
    .then(data => {
      setDrivers(data.map(mapDriverToCardProps));
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
      // Fix: Explicitly set driver data with correct type handling
      if (data) {
        setDriver({
          _id: data._id,
          name: data.name,
          birthDate: data.birthDate,
          nationality: data.nationality,
          photo: data.photo,
          team: data.team,
          bio: data.bio || '',
          championships: data.championships || 0,
          podiums: data.podiums || 0,
          slug: data.slug
        });
      } else {
        setDriver(null);
      }
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
        },
        stage->{
          _id,
          name,
          distance,
          status
        },
        results[] {
          position,
          driver,
          time,
          gap,
          carNumber,
          status
        }
      }
    `, { stageId })
    .then(data => {
      console.log(`Stage results for stage ${stageId}:`, data);
      setResults(data);
      setLoading(false);
    })
    .catch(err => {
      console.error(`Error fetching results for stage ${stageId}:`, err);
      setError(err);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to load stage results",
        variant: "destructive",
      });
    });
  }, [stageId]);

  return { results, loading, error };
}

/**
 * Hook to fetch all live results across all rallies
 */
export function useLiveResults() {
  const [results, setResults] = useState<any[]>([]);
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
      console.log("Stage results data:", data);
      setResults(data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching stage results:", err);
      setError(err);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to load results",
        variant: "destructive",
      });
    });
  }, []);

  return { results, loading, error };
}

/**
 * Hook to fetch overall championship standings
 */
export function useOverallStandings() {
  const [standings, setStandings] = useState<any[]>([]);
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
      console.log("Overall standings data:", data);
      setStandings(data);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching standings:", err);
      setError(err);
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to load standings",
        variant: "destructive",
      });
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
