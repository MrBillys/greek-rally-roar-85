import { client } from "@/lib/sanity";
import type { 
  Rally, Driver, RallyResult, OverallStanding, Stage, 
  StageResult, Team, Car, Entry, Penalty, Championship,
  Retirement, OnboardLink // Make sure these are imported from your schema types
} from "@/types/schema";
import { useState, useEffect, useMemo } from "react";
import { toast } from "@/components/ui/use-toast";

// ==================== Helper Functions ====================

const mapRallyToCardProps = (rally: Rally | null): Rally | null => {
  if (!rally) return null;
  
  return {
    _id: rally._id || "",
    title: rally.title || "Untitled Rally",
    shortCode: rally.shortCode || "",
    date: rally.date || "",
    location: rally.location || "",
    status: rally.status || "upcoming",
    organizer: rally.organizer || "",
    website: rally.website || "",
    image: rally.image || null,
    description: rally.description || "",
    championship: rally.championship || null,
    slug: rally.slug || { current: "" },
    specialStages: rally.specialStages || []
  };
};

const mapDriverToCardProps = (driver: Driver | null): Driver | null => {
  if (!driver) return null;

  return {
    _id: driver._id || "",
    name: driver.name || "Unknown Driver",
    birthDate: driver.birthDate || "",
    nationality: driver.nationality || "",
    photo: driver.photo || null,
    team: driver.team || null,
    bio: driver.bio || "",
    championships: driver.championships || 0,
    podiums: driver.podiums || 0,
    slug: driver.slug || { current: "" }
  };
};

const mapStageToCardProps = (stage: Stage | null): Stage | null => {
  if (!stage) return null;

  return {
    _id: stage._id || "",
    name: stage.name || "Unnamed Stage",
    distance: stage.distance || 0,
    status: stage.status || "upcoming",
    startTime: stage.startTime || "",
    date: stage.date || "",
    time: stage.time || "",
    rally: stage.rally || null
  };
};

// ==================== Generic Fetch Hooks ====================

function useSanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {}, // Changed to Record<string, unknown>
  initialValue: T[] = []
) {
  const [data, setData] = useState<T[]>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const paramsString = useMemo(() => JSON.stringify(params), [params]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await client.fetch<T[]>(query, params as any); // Temporary any cast
        
        const filteredData = Array.isArray(result)
          ? result.filter((item): item is T => item !== null && item !== undefined)
          : [];
          
        setData(filteredData);
        setError(null);
      } catch (err) {
        console.error("Sanity fetch error:", err);
        setError(err instanceof Error ? err : new Error("Fetch failed"));
        setData(initialValue);
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, paramsString]);

  return { data, loading, error };
}

function useSanityFetchSingle<T>(
  query: string,
  params: Record<string, unknown> = {},
  initialValue: T | null = null
) {
  const [data, setData] = useState<T | null>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const paramsString = useMemo(() => JSON.stringify(params), [params]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await client.fetch<T | null>(query, params);
        
        setData(result || initialValue);
        setError(null);
      } catch (err) {
        console.error("Sanity fetch error:", err);
        setError(err instanceof Error ? err : new Error("Fetch failed"));
        setData(initialValue);
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (Object.values(params).every(p => p !== undefined)) {
      fetchData();
    } else {
      setLoading(false);
      setData(initialValue);
    }
  }, [query, paramsString]);

  return { data, loading, error };
}

// ==================== Specific Hooks ====================

export function useRallies() {
  const query = `*[_type == "rally"] {
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
  } | order(date asc)`;

  const { data, loading, error } = useSanityFetch<Rally>(query);
  
  return {
    rallies: data.map(mapRallyToCardProps).filter(Boolean) as Rally[],
    loading,
    error
  };
}

export function useRallyBySlug(slug: string | undefined) {
  const query = `*[_type == "rally" && slug.current == $slug][0] {
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
    specialStages[]->{
      name,
      distance,
      status,
      startTime
    }
  }`;
  // Debug 3 - Log the actual query being sent
  useEffect(() => {
    if (slug) {
      console.log("[DEBUG3] Sanity Query:", {
        query: `*[_type == "rally" && slug.current == "${slug}"][0]`,
        timestamp: new Date().toISOString()
      });
    }
  }, [slug]);
  const { data, loading, error } = useSanityFetchSingle<Rally>(query, { slug });
  
  return {
    rally: mapRallyToCardProps(data),
    loading,
    error
  };
}

export function useRallyById(id: string | undefined) {
  const query = `*[_type == "rally" && _id == $id][0] {
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
    specialStages[]->{
      _id,
      name,
      distance,
      status,
      startTime
    }
  }`;

  const { data, loading, error } = useSanityFetchSingle<Rally>(query, { id });
  
  return {
    rally: mapRallyToCardProps(data),
    loading,
    error
  };
}

export function useDrivers() {
  const query = `*[_type == "driver"] {
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
  } | order(name asc)`;

  const { data, loading, error } = useSanityFetch<Driver>(query);
  
  return {
    drivers: data.map(mapDriverToCardProps).filter(Boolean) as Driver[],
    loading,
    error
  };
}

export function useDriverBySlug(slug: string | undefined) {
  const query = `*[_type == "driver" && slug.current == $slug][0] {
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
  }`;

  const { data, loading, error } = useSanityFetchSingle<Driver>(query, { slug });
  
  return {
    driver: mapDriverToCardProps(data),
    loading,
    error
  };
}

export function useStages(rallyId: string | undefined) {
  const query = `*[_type == "stage" && rally._ref == $rallyId] {
    _id,
    name,
    distance,
    status,
    startTime,
    date,
    time,
    rally->{
      _type,
      _ref
    }
  } | order(startTime asc)`;

  const { data, loading, error } = useSanityFetch<Stage>(query, { rallyId });
  
  return {
    stages: data.map(mapStageToCardProps).filter(Boolean) as Stage[],
    loading,
    error
  };
}

// In useSanityData.ts
export function useStageResults(stageId: string | undefined) {
  const query = `*[_type == "stageResult" && stage._ref == $stageId][0] {
    _id,
    rally->{ _id, title },
    stage->{ _id, name },
    date,
    results[] {
      position,
      time,
      gap,
      penalties,
      cumulativeTime,
      carNumber,
      status,
      driver->{ _id, name, nationality },
      coDriver->{ _id, name, nationality },
      car->{ _id, make, model }
    }
  }`;

  const { data, loading, error } = useSanityFetchSingle<StageResult>(query, { stageId });
  
  return { 
    stageResult: data, // Renamed from 'results' to be explicit
    loading, 
    error 
  };
}

export function useRallyResults(rallyId: string | undefined) {
  const query = `*[_type == "rallyResult" && rally._ref == $rallyId] {
    _id,
    rally->{
      _id,
      title
    },
    position,
    totalTime,
    gap,
    retired,
    entry->{
      _id,
      number,
      driver->{name},
      team->{name}
    },
    date
  } | order(position asc)`;

  const { data, loading, error } = useSanityFetch<RallyResult>(query, { rallyId });
  
  return {
    results: data,
    loading,
    error
  };
}

export function useTeams() {
  const query = `*[_type == "team"] {
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
  } | order(name asc)`;

  const { data, loading, error } = useSanityFetch<Team>(query);
  
  return {
    teams: data,
    loading,
    error
  };
}

export function useTeamBySlug(slug: string | undefined) {
  const query = `*[_type == "team" && slug.current == $slug][0] {
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
  }`;

  const { data, loading, error } = useSanityFetchSingle<Team>(query, { slug });
  
  return {
    team: data,
    loading,
    error
  };
}

export function useRallyEntries(rallyId: string | undefined) {
  const query = `*[_type == "entry" && rally._ref == $rallyId] | order(number asc) {
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
  }`;

  const { data, loading, error } = useSanityFetch<Entry>(query, { rallyId });
  
  return {
    entries: data,
    loading,
    error
  };
}

export function useChampionships() {
  const query = `*[_type == "championship"] {
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
  } | order(seasonStart desc)`;

  const { data, loading, error } = useSanityFetch<Championship>(query);
  
  return {
    championships: data,
    loading,
    error
  };
}

export function useChampionshipBySlug(slug: string | undefined) {
  const query = `*[_type == "championship" && slug.current == $slug][0] {
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
  }`;

  const { data, loading, error } = useSanityFetchSingle<Championship>(query, { slug });
  
  return {
    championship: data,
    loading,
    error
  };
}

export function useOverallStandings(championshipId?: string) {
  const query = `*[_type == "overallStanding" ${championshipId ? '&& championship._ref == $championshipId' : ''}] {
    _id,
    championship->{_id, name},
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
  } | order(date desc)`;

  const { data, loading, error } = useSanityFetch<OverallStanding>(
    query,
    championshipId ? { championshipId } : {}
  );
  
  return {
    standings: data,
    loading,
    error
  };
}

export function usePenalties(entryId: string | undefined) {
  const query = `*[_type == "penalty" && entry._ref == $entryId] | order(dateApplied desc) {
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
  }`;

  const { data, loading, error } = useSanityFetch<Penalty>(query, { entryId });
  
  return {
    penalties: data,
    loading,
    error
  };
}
// ==================== Additional Hooks ====================

export function useLiveResults(rallyId?: string) {
  const query = `*[_type == "stageResult" ${rallyId ? '&& rally._ref == $rallyId' : ''}] {
    _id,
    rally->{
      _id,
      title,
      slug,
      date,
      status
    },
    stage->{
      _id,
      name,
      distance,
      status,
      startTime
    },
    date,
    results[]{
      position,
      time,
      gap,
      penalties,
      cumulativeTime,
      carNumber,
      status,
      driver->{
        _id,
        name,
        nationality,
        photo,
        slug
      },
      coDriver->{
        _id,
        name,
        nationality
      },
      car->{
        _id,
        make,
        model,
        category,
        image
      },
      team->{
        _id,
        name,
        logo
      }
    }
  } | order(date desc)`;

  const { data, loading, error } = useSanityFetch<StageResult>(query, rallyId ? { rallyId } : {});

  return {
    results: data || [],
    loading,
    error
  };
}

export function useRetirements(rallyId?: string) {
  const query = `*[_type == "retirement" ${rallyId ? '&& rally._ref == $rallyId' : ''}] {
    _id,
    reason,
    rally->{ _id, title },
    stage->{ _id, name },
    entry->{
      _id,
      number,
      driver->{ name },
      team->{ name }
    },
    date
  } | order(date desc)`;

  const { data, loading, error } = useSanityFetch<Retirement>(query, rallyId ? { rallyId } : {});
  
  return {
    retirements: data,
    loading,
    error
  };
}

export function useOnboardVideos(rallyId?: string, driverId?: string) {
  const query = `*[_type == "onboardLink" 
    ${rallyId ? '&& rally._ref == $rallyId' : ''}
    ${driverId ? '&& driver._ref == $driverId' : ''}
  ] {
    _id,
    url,
    title,
    driver->{ _id, name },
    rally->{ _id, title },
    stage->{ _id, name }
  } | order(_createdAt desc)`;

  const params = {} as any;
  if (rallyId) params.rallyId = rallyId;
  if (driverId) params.driverId = driverId;

  const { data, loading, error } = useSanityFetch<OnboardLink>(query, params);
  
  return {
    videos: data,
    loading,
    error
  };
}

export function useCars() {
  const query = `*[_type == "car"] {
    _id,
    make,
    model,
    engineCapacity,
    year,
    category,
    image,
    "entries": *[_type == "entry" && car._ref == ^._id] {
      _id,
      number,
      driver->{name},
      team->{name}
    }
  } | order(make asc, model asc)`;

  const { data, loading, error } = useSanityFetch<Car>(query);

  return {
    cars: data || [],
    loading,
    error
  };
}

export function useCarById(id: string | undefined) {
  const query = `*[_type == "car" && _id == $id][0] {
    _id,
    make,
    model,
    engineCapacity,
    year,
    category,
    image,
    "entries": *[_type == "entry" && car._ref == $id] {
      _id,
      number,
      driver->{
        _id,
        name,
        photo
      },
      team->{
        _id,
        name,
        logo
      },
      rally->{
        _id,
        title,
        date
      }
    }
  }`;

  const { data, loading, error } = useSanityFetchSingle<Car>(query, { id });

  return {
    car: data,
    loading,
    error
  };
}

