
import { useState, useEffect } from "react";
import { client } from "@/lib/sanity";

export function useRallies() {
  const [rallies, setRallies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    client.fetch(`
      *[_type == "rally"] {
        _id,
        name,
        location,
        date,
        image,
        status,
        description,
        specialStages[] {
          name,
          distance,
          date,
          time
        },
        slug
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

export function useRallyById(id: string | undefined) {
  const [rally, setRally] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    client.fetch(`
      *[_type == "rally" && _id == $id][0] {
        _id,
        name,
        location,
        date,
        image,
        status,
        description,
        specialStages[] {
          name,
          distance,
          date,
          time
        },
        slug
      }
    `, { id })
    .then(data => {
      setRally(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err);
      setLoading(false);
    });
  }, [id]);

  return { rally, loading, error };
}

export function useDrivers() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    client.fetch(`
      *[_type == "driver"] {
        _id,
        name,
        nationality,
        car,
        team,
        image,
        championships,
        podiums,
        bio,
        slug
      }
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

export function useLiveResults() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    client.fetch(`
      *[_type == "rallyResult"] | order(date desc) {
        _id,
        stageId,
        stageName,
        rallyId,
        rallyName,
        date,
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

export function useOverallStandings() {
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    client.fetch(`
      *[_type == "overallStanding"] {
        _id,
        rallyId,
        rallyName,
        standings[] {
          position,
          driver,
          totalTime,
          gap,
          carNumber
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
