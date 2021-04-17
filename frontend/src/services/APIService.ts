import { Track } from './Types';
import { Utils } from './utils';

const get = (): Promise<Track[]> =>
    fetch('/api/tracks').then((r) => (r.ok ? r.json().then(Utils.convertAPITracks) : []));

const create = ({ ID, description, time }: Track): Promise<void> =>
    fetch('/api/track', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ID, description, time: time.toISOString() }),
    }).then((r) => {
        if (!r.ok) throw new Error('Creation failed');
    });

const remove = (ID: string): Promise<void> =>
    fetch('/api/track', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ID }),
    }).then((r) => {
        if (!r.ok) throw new Error('Deletion failed');
    });

export const APIService = { get, create, remove };