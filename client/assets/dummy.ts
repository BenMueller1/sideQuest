import {EventType} from '../assets/types/Event'

export const events : EventType[] = [
    {
      id: 1,
      createdAt: new Date('2024-10-01T10:30:00Z'),
      title: "Tech Conference 2024",
      description: "A conference showcasing the latest in technology and innovation.",
      latitude: 37.7749,
      longitude: -122.4194,
      capacity: 500,
      interests: [{ id: 1, name: "Technology" }, { id: 2, name: "Innovation" }]
    },
    {
      id: 2,
      createdAt: new Date('2024-11-15T14:00:00Z'),
      title: "Art Exhibition",
      description: "An exhibition of modern art from local artists.",
      latitude: 34.0522,
      longitude: -118.2437,
      capacity: 200,
      interests: [{ id: 3, name: "Art" }, { id: 4, name: "Culture" }]
    },
    {
      id: 3,
      createdAt: new Date('2024-12-10T18:00:00Z'),
      title: "Music Festival",
      description: "A two-day festival featuring bands from various genres.",
      latitude: 40.7128,
      longitude: -74.0060,
      capacity: 1000,
      interests: [{ id: 5, name: "Music" }, { id: 6, name: "Live Shows" }]
    },
    {
      id: 4,
      createdAt: new Date('2024-09-05T09:00:00Z'),
      title: "Business Networking Event",
      description: "An event for entrepreneurs and business professionals to network.",
      latitude: 51.5074,
      longitude: -0.1278,
      capacity: 150,
      interests: [{ id: 7, name: "Business" }, { id: 8, name: "Networking" }]
    },
    {
      id: 5,
      createdAt: new Date('2024-08-20T06:00:00Z'),
      title: "Charity Marathon",
      description: "A charity marathon to raise funds for a local cause.",
      latitude: 48.8566,
      longitude: 2.3522,
      capacity: 300,
      interests: [{ id: 9, name: "Charity" }, { id: 10, name: "Sports" }]
    }
  ];