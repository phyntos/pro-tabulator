import { Input, InputRef } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TextSearch } from '../types';
import FilterSearch from './FilterSearch';
import { FilterProps } from './TitleFilter';

type TextFilterProps = Omit<TextSearch, 'type'> & FilterProps;

const TextFilter = ({ name, onChange, getValue, title, updateOnChange }: TextFilterProps) => {
    const initialValue = getValue(name);

    const [value, setValue] = useState<string | undefined>(initialValue);
    const [timer, setTimer] = useState<NodeJS.Timeout>();
    const [updated, setUpdated] = useState(false);

    const ref = useRef<InputRef>();
    const isFirstRun = useRef(true);

    const updateParams = useCallback(
        (value?: string) => {
            onChange({ [name]: value || undefined });
            ref.current?.blur();
            setUpdated(false);
        },
        [name, onChange],
    );

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        clearTimeout(timer);
        if (!value) {
            updateParams(value);
        } else if (updateOnChange) {
            setTimer(
                setTimeout(() => {
                    updateParams(value);
                }, 500),
            );
        } else {
            setUpdated(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const style: React.CSSProperties = {};

    if (!updateOnChange) {
        style.width = 'calc(100% - 24px)';
    }
    const status = updated ? 'warning' : undefined;
    return (
        <FilterSearch
            hidden={updateOnChange}
            onClick={() => {
                updateParams(value);
            }}
            status={status}
        >
            <Input
                size='small'
                ref={ref}
                placeholder={`Введите ${title}`}
                value={value}
                status={status}
                style={style}
                onChange={(e) => {
                    const value = e.target.value;
                    setValue(value);
                }}
                onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === 'Enter') {
                        updateParams(value);
                    }
                }}
                allowClear
            />
        </FilterSearch>
    );
};

export default TextFilter;
