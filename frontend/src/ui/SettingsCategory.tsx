import React, { useCallback, useEffect, useState } from 'react';
import { CategoryConfig } from '../services/Types';
import { Input } from './base/Input';
import { TrackService } from '../services/TrackService';

export type SettingsCategoryProps = { config: CategoryConfig; ID: string };

export const SettingsCategory: React.VFC<SettingsCategoryProps> = ({ ID, config: { name, regex, color }, config }) => {
    const [_regex, setRegex] = useState(regex);
    useEffect(() => {
        setRegex(regex);
    }, [regex]);
    const onChangeColor = useCallback(
        (color: string) => {
            TrackService.setCategoryConfig(ID as any, { ...config, color });
        },
        [ID, config]
    );
    const onBlurRegex = useCallback(
        (regex: string) => {
            TrackService.setCategoryConfig(ID as any, { ...config, regex });
        },
        [ID, config]
    );
    return (
        <tr>
            <td>{name}</td>
            <td>
                <Input type={'color'} value={color} onChange={onChangeColor} />
            </td>
            <td className={'settings__category-regex'}>
                <Input value={_regex} onChange={setRegex} onBlur={onBlurRegex} />
            </td>
        </tr>
    );
};