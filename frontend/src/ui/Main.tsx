import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Track } from '../services/Types';
import { Utils } from '../services/utils';
import { TrackService } from '../services/TrackService';
import { SpeechRecognitionService } from '../services/SpeechRecognitionService';
import { Tracks, useTracks } from './Tracks';
import { CategoryService, KnownCategory } from '../services/CategoryService';
import { IconMicrophone, IconMicrophoneSlash } from '../icons/icon';

export const Main: React.VFC = () => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [started, setStarted] = useState(false);
    const now = useMemo(() => new Date().toLocaleDateString(), []);

    const onStart = useCallback(() => {
        setStarted(true);
        SpeechRecognitionService.startFocusListener();
    }, []);

    const onStop = useCallback(() => {
        setStarted(false);
        SpeechRecognitionService.removeFocusListener();
    }, []);

    const addNewContent = useCallback(
        (description: string) => {
            const ID = Utils.uuid();
            const time = new Date();
            const next = { ID, description, time };
            TrackService.current()
                .create(next)
                .then(() => {
                    setTracks((c) => c.concat(next));
                    if (CategoryService.getWithColor(description).code === KnownCategory.END) onStop();
                });
        },
        [onStop]
    );
    useEffect(() => {
        SpeechRecognitionService.onResult(addNewContent);
    }, [addNewContent]);

    useEffect(() => {
        TrackService.current()
            .current()
            .then((tracks) => {
                setTracks(tracks);
                if (tracks.length) onStart();
            });
    }, [onStart]);

    const onDelete = useCallback((ID: string) => {
        TrackService.current()
            .remove(ID)
            .then(() => setTracks((tracks) => tracks.filter((track) => track.ID !== ID)));
    }, []);

    const extendedTracks = useTracks(tracks);
    const { totalTimeMs } = extendedTracks;

    return (
        <main>
            <h2>
                <span>{now}</span>
                {totalTimeMs && (
                    <span className={'subtitle'}>Total: {TrackService.toReadableTimeDiff(totalTimeMs)}</span>
                )}
            </h2>
            <Tracks extendedTracks={extendedTracks} onDelete={onDelete} />
            {started ? (
                <div className="microphone">
                    <p>Stop automatically starting recordings.</p>
                    <button className={'icon-button'} onClick={onStop}>
                        <IconMicrophoneSlash />
                    </button>
                </div>
            ) : (
                <div className="microphone">
                    <p>{tracks.length ? 'Continue' : 'Start a new'} session by clicking on the Microphone.</p>
                    <button className={'icon-button'} onClick={onStart}>
                        <IconMicrophone />
                    </button>
                </div>
            )}
        </main>
    );
};
