import { Select } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SelectSearch } from '../types';
import FilterSearch from './FilterSearch';
import { FilterProps } from './TitleFilter';
import { BaseSelectRef } from 'rc-select/lib/BaseSelect';

type SelectFieldProps = FilterProps & Omit<SelectSearch, 'type'>;

const SelectField = ({
    getValue,
    name,
    onChange,
    options = [],
    error,
    title,
    multiple,
    getPrefixCls,
    updateOnChange,
}: SelectFieldProps) => {
    const [value, setValue] = useState<string | string[] | undefined>(getValue(name));
    const [timer, setTimer] = useState<NodeJS.Timeout>();
    const [updated, setUpdated] = useState(false);
    const ref = useRef<BaseSelectRef>();
    const isFirstRun = useRef(true);

    const updateParams = useCallback(
        (value?: string | string[]) => {
            onChange({ [name]: !value || value.length === 0 ? undefined : value });
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
        if (!value || value.length === 0) {
            updateParams(value);
        } else if (updateOnChange) {
            setTimer(
                setTimeout(() => {
                    updateParams(value);
                }, 1000),
            );
        } else {
            setUpdated(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const status = error ? 'error' : updated ? 'warning' : undefined;

    return (
        <FilterSearch
            hidden={updateOnChange}
            onClick={() => {
                updateParams(value);
            }}
            status={status}
        >
            <Select
                style={{ width: !updateOnChange ? 'calc(100% - 24px)' : '100%' }}
                value={value}
                ref={ref}
                size='small'
                status={status}
                mode={multiple ? 'multiple' : undefined}
                showSearch={false}
                placeholder={
                    error ? (
                        <span
                            className={getPrefixCls('select-error-placeholder')}
                        >{`Ошибка при загрузке поля "${title}"`}</span>
                    ) : (
                        `Выберите ${title}`
                    )
                }
                allowClear
                options={options}
                onChange={(val) => {
                    setValue(val);
                }}
            />
        </FilterSearch>
    );
};

export default SelectField;
