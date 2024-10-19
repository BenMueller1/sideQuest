export type Interest = {
    id: number;
    name: string;
  };
  
export type EventType = {
    id: number;
    createdAt: Date;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    capacity: number;
    interests: Interest[];
};