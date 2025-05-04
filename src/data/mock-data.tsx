
// Mock data for rallies
export const rallies = [
  {
    id: "acropolis-2025",
    name: "Acropolis Rally 2025",
    location: "Athens, Greece",
    date: "June 5-7, 2025",
    image: "https://images.unsplash.com/photo-1617886322168-72b886573c35?q=80&w=1600&auto=format&fit=crop",
    status: "upcoming" as const,
    description: "The legendary Acropolis Rally, known as the 'Rally of Gods', is one of the most challenging and historic events in rallying. Taking place around Athens, drivers will face rough gravel roads, high temperatures, and rocky mountain passes.",
    specialStages: [
      { 
        name: "SS1 - Aghii Theodori", 
        distance: "17.95 km",
        date: "June 5, 2025",
        time: "10:00"
      },
      { 
        name: "SS2 - Loutraki", 
        distance: "23.37 km",
        date: "June 5, 2025",
        time: "13:20"
      },
      { 
        name: "SS3 - Thiva", 
        distance: "30.53 km",
        date: "June 6, 2025",
        time: "09:30"
      },
      { 
        name: "SS4 - Rengini", 
        distance: "21.14 km",
        date: "June 6, 2025",
        time: "14:00"
      },
      { 
        name: "SS5 - Tarzan", 
        distance: "25.67 km",
        date: "June 7, 2025",
        time: "10:00"
      }
    ]
  },
  {
    id: "olympus-rally-2025",
    name: "Olympus Rally 2025",
    location: "Mount Olympus, Greece",
    date: "July 12-14, 2025",
    image: "https://images.unsplash.com/photo-1646978092387-29cca3285f05?q=80&w=1600&auto=format&fit=crop",
    status: "upcoming" as const,
    description: "Located at the mythical home of the Greek gods, the Olympus Rally features challenging mountain stages with stunning views. The high-altitude stages test both driver and machine to their limits.",
    specialStages: [
      { 
        name: "SS1 - Litochoro", 
        distance: "22.45 km",
        date: "July 12, 2025",
        time: "10:00"
      },
      { 
        name: "SS2 - Prionia", 
        distance: "18.92 km",
        date: "July 12, 2025",
        time: "13:45"
      },
      { 
        name: "SS3 - Dion", 
        distance: "25.18 km",
        date: "July 13, 2025",
        time: "09:30"
      },
      { 
        name: "SS4 - Enipeas", 
        distance: "19.67 km",
        date: "July 13, 2025",
        time: "14:00"
      },
      { 
        name: "SS5 - Pantheon", 
        distance: "30.21 km",
        date: "July 14, 2025",
        time: "10:00"
      }
    ]
  },
  {
    id: "crete-rally-2024",
    name: "Crete Rally 2024",
    location: "Heraklion, Crete",
    date: "October 15-17, 2024",
    image: "https://images.unsplash.com/photo-1602187484493-58436b3e6a30?q=80&w=1600&auto=format&fit=crop",
    status: "ongoing" as const,
    description: "The Crete Rally takes competitors around the beautiful Mediterranean island, with technical stages along coastal roads and mountain passes. Known for its changeable conditions and stunning scenery.",
    specialStages: [
      { 
        name: "SS1 - Chania", 
        distance: "20.35 km",
        date: "Oct 15, 2024",
        time: "10:00"
      },
      { 
        name: "SS2 - Rethymno", 
        distance: "25.87 km",
        date: "Oct 15, 2024",
        time: "14:15"
      },
      { 
        name: "SS3 - Heraklion", 
        distance: "18.93 km",
        date: "Oct 16, 2024",
        time: "09:30"
      },
      { 
        name: "SS4 - Agios Nikolaos", 
        distance: "22.61 km",
        date: "Oct 16, 2024",
        time: "14:00"
      },
      { 
        name: "SS5 - Lassithi", 
        distance: "27.45 km",
        date: "Oct 17, 2024",
        time: "10:00"
      }
    ]
  },
  {
    id: "peloponnese-rally-2024",
    name: "Peloponnese Rally 2024",
    location: "Sparta, Greece",
    date: "April 20-22, 2024",
    image: "https://images.unsplash.com/photo-1551905523-8b6641c5a21c?q=80&w=1600&auto=format&fit=crop",
    status: "completed" as const,
    description: "This historic rally takes place in the southern peninsula of Greece, featuring diverse terrains from coastal roads to mountain passes. The event passes through ancient cities and offers spectacular Mediterranean views.",
    specialStages: [
      { 
        name: "SS1 - Sparta", 
        distance: "19.75 km",
        date: "Apr 20, 2024",
        time: "10:00"
      },
      { 
        name: "SS2 - Mystras", 
        distance: "22.38 km",
        date: "Apr 20, 2024",
        time: "13:30"
      },
      { 
        name: "SS3 - Nafplio", 
        distance: "24.92 km",
        date: "Apr 21, 2024",
        time: "09:45"
      },
      { 
        name: "SS4 - Epidaurus", 
        distance: "18.36 km",
        date: "Apr 21, 2024",
        time: "14:00"
      },
      { 
        name: "SS5 - Corinth", 
        distance: "25.83 km",
        date: "Apr 22, 2024",
        time: "10:00"
      }
    ]
  }
];

// Mock data for drivers
export const drivers = [
  {
    id: "nikos-papadopoulos",
    name: "Nikos Papadopoulos",
    nationality: "Greek",
    car: "Hyundai i20 N Rally1",
    team: "Athens Racing Team",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300&auto=format&fit=crop",
    championships: 3,
    podiums: 27,
    bio: "Three-time Greek Rally Champion Nikos Papadopoulos began his career in 2010. Known for his aggressive driving style and exceptional skill on gravel, he has dominated the Greek rally scene for the past five years."
  },
  {
    id: "elena-andreou",
    name: "Elena Andreou",
    nationality: "Greek",
    car: "Toyota GR Yaris Rally1",
    team: "Olympus Motorsport",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&auto=format&fit=crop",
    championships: 1,
    podiums: 18,
    bio: "Rising star Elena Andreou made history as the first female driver to win the Greek Rally Championship in 2023. Her precise driving and fantastic pace notes have earned her a factory drive with Toyota this season."
  },
  {
    id: "andreas-dimitriou",
    name: "Andreas Dimitriou",
    nationality: "Greek",
    car: "Ford Puma Rally1",
    team: "Hellas Racing",
    image: "https://images.unsplash.com/photo-1489980557514-251d61e3eeb6?q=80&w=300&auto=format&fit=crop",
    championships: 2,
    podiums: 24,
    bio: "Veteran driver Andreas Dimitriou has competed in rally events across Europe for over 15 years. His experience and consistency make him a formidable competitor, particularly on tarmac stages."
  },
  {
    id: "georgios-alexiou",
    name: "Georgios Alexiou",
    nationality: "Greek",
    car: "Škoda Fabia RS Rally2",
    team: "Acropolis Racing Team",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    championships: 0,
    podiums: 12,
    bio: "Young talent Georgios Alexiou has quickly made a name for himself in the Rally2 category. Known for his fearless approach and raw speed, he's tipped as a future champion at the highest level."
  },
  {
    id: "sofia-karagianni",
    name: "Sofia Karagianni",
    nationality: "Greek",
    car: "Citroën C3 Rally2",
    team: "Mediterranean Rally",
    image: "https://images.unsplash.com/photo-1619379180294-3e714910e6a9?q=80&w=300&auto=format&fit=crop",
    championships: 0,
    podiums: 9,
    bio: "Former circuit racer Sofia Karagianni made the switch to rallying in 2020. Her technical precision and adaptability have helped her secure multiple podium finishes in her short rally career."
  },
  {
    id: "dimitris-petrou",
    name: "Dimitris Petrou",
    nationality: "Greek",
    car: "Hyundai i20 N Rally2",
    team: "Sparta Motorsports",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop",
    championships: 0,
    podiums: 15,
    bio: "Consistent performer Dimitris Petrou specializes in mastering rough terrain and has scored numerous wins on the challenging Acropolis stages. His mechanical sympathy ensures he often brings his car home when others fail."
  }
];

// Mock data for results
export const liveResults = [
  {
    stageId: "crete-ss3",
    stageName: "SS3 - Heraklion",
    rallyId: "crete-rally-2024",
    rallyName: "Crete Rally 2024",
    date: "October 16, 2024",
    results: [
      {
        position: 1,
        driver: "Elena Andreou",
        time: "10:23.5",
        gap: "-",
        carNumber: 4,
        status: "completed"
      },
      {
        position: 2,
        driver: "Nikos Papadopoulos",
        time: "10:25.8",
        gap: "+2.3s",
        carNumber: 1,
        status: "completed"
      },
      {
        position: 3,
        driver: "Andreas Dimitriou",
        time: "10:28.1",
        gap: "+4.6s",
        carNumber: 2,
        status: "completed"
      },
      {
        position: 4,
        driver: "Georgios Alexiou",
        time: "10:30.5",
        gap: "+7.0s",
        carNumber: 7,
        status: "completed"
      },
      {
        position: 5,
        driver: "Sofia Karagianni",
        time: "10:31.2",
        gap: "+7.7s",
        carNumber: 8,
        status: "completed"
      },
      {
        position: 6,
        driver: "Dimitris Petrou",
        time: "10:32.7",
        gap: "+9.2s",
        carNumber: 5,
        status: "completed"
      }
    ]
  },
  {
    stageId: "crete-ss2",
    stageName: "SS2 - Rethymno",
    rallyId: "crete-rally-2024",
    rallyName: "Crete Rally 2024",
    date: "October 15, 2024",
    results: [
      {
        position: 1,
        driver: "Nikos Papadopoulos",
        time: "15:12.7",
        gap: "-",
        carNumber: 1,
        status: "completed"
      },
      {
        position: 2,
        driver: "Andreas Dimitriou",
        time: "15:14.2",
        gap: "+1.5s",
        carNumber: 2,
        status: "completed"
      },
      {
        position: 3,
        driver: "Elena Andreou",
        time: "15:15.5",
        gap: "+2.8s",
        carNumber: 4,
        status: "completed"
      },
      {
        position: 4,
        driver: "Dimitris Petrou",
        time: "15:20.3",
        gap: "+7.6s",
        carNumber: 5,
        status: "completed"
      },
      {
        position: 5,
        driver: "Sofia Karagianni",
        time: "15:21.1",
        gap: "+8.4s",
        carNumber: 8,
        status: "completed"
      },
      {
        position: 6,
        driver: "Georgios Alexiou",
        time: "15:23.8",
        gap: "+11.1s",
        carNumber: 7,
        status: "completed"
      }
    ]
  },
  {
    stageId: "crete-ss1",
    stageName: "SS1 - Chania",
    rallyId: "crete-rally-2024",
    rallyName: "Crete Rally 2024",
    date: "October 15, 2024",
    results: [
      {
        position: 1,
        driver: "Nikos Papadopoulos",
        time: "12:05.3",
        gap: "-",
        carNumber: 1,
        status: "completed"
      },
      {
        position: 2,
        driver: "Elena Andreou",
        time: "12:06.8",
        gap: "+1.5s",
        carNumber: 4,
        status: "completed"
      },
      {
        position: 3,
        driver: "Andreas Dimitriou",
        time: "12:07.2",
        gap: "+1.9s",
        carNumber: 2,
        status: "completed"
      },
      {
        position: 4,
        driver: "Georgios Alexiou",
        time: "12:10.5",
        gap: "+5.2s",
        carNumber: 7,
        status: "completed"
      },
      {
        position: 5,
        driver: "Sofia Karagianni",
        time: "12:12.3",
        gap: "+7.0s",
        carNumber: 8,
        status: "completed"
      },
      {
        position: 6,
        driver: "Dimitris Petrou",
        time: "12:14.9",
        gap: "+9.6s",
        carNumber: 5,
        status: "completed"
      }
    ]
  }
];

// Overall standings
export const overallStandings = [
  {
    rallyId: "crete-rally-2024",
    rallyName: "Crete Rally 2024",
    standings: [
      {
        position: 1,
        driver: "Elena Andreou",
        totalTime: "35:44.8",
        gap: "-",
        carNumber: 4
      },
      {
        position: 2,
        driver: "Nikos Papadopoulos",
        totalTime: "35:43.8",
        gap: "+1.0s",
        carNumber: 1
      },
      {
        position: 3,
        driver: "Andreas Dimitriou",
        totalTime: "35:49.5",
        gap: "+6.7s",
        carNumber: 2
      },
      {
        position: 4,
        driver: "Georgios Alexiou",
        totalTime: "36:04.8",
        gap: "+22.0s",
        carNumber: 7
      },
      {
        position: 5,
        driver: "Sofia Karagianni",
        totalTime: "36:04.6",
        gap: "+21.8s",
        carNumber: 8
      },
      {
        position: 6,
        driver: "Dimitris Petrou",
        totalTime: "36:07.9",
        gap: "+25.1s",
        carNumber: 5
      }
    ]
  }
];
