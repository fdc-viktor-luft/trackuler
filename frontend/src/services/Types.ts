export type APITrack = { ID: string; description: string; time: string };
export type Track = { ID: string; description: string; time: Date };

export type TrackInterface = {
    get: () => Promise<Track[]>;
    create: (track: Track) => Promise<void>;
    remove: (ID: string) => Promise<void>;
};