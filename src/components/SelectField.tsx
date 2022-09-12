import { Select } from 'antd';
import React, { useState } from 'react';
import { SelectSearch } from '../types';
import { FilterProps } from './TitleFilter';

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
}: SelectFieldProps) => {
    const [value, setValue] = useState<string | undefined>(getValue(name));

    return (
        <Select
            style={{ width: '100%' }}
            value={value}
            size='small'
            status={error ? 'error' : undefined}
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
                onChange({ [name]: val });
            }}
        />
    );
};

export default SelectField;
