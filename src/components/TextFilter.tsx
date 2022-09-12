import { SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { TextSearch } from '../types';
import { FilterProps } from './TitleFilter';

type TextFilterProps = Omit<TextSearch, 'type'> & FilterProps;

const TextFilter = ({ name, onChange, getValue, title, updateOnChange, getPrefixCls }: TextFilterProps) => {
    const [value, setValue] = useState<string | undefined>(undefined);

    useEffect(() => {
        setValue(getValue(name));
    }, []);

    const updateParams = (value?: string) => {
        onChange({ [name]: value || undefined });
    };

    return (
        <Input.Group compact>
            <Input
                size='small'
                placeholder={`Введите ${title}`}
                value={value}
                style={!updateOnChange ? { width: 'calc(100% - 24px)' } : undefined}
                onChange={(e) => {
                    const value = e.target.value;
                    setValue(value);
                    if (updateOnChange) updateParams(value);
                }}
                onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === 'Enter') {
                        updateParams(value);
                    }
                }}
                allowClear
            />
            {!updateOnChange && (
                <Button
                    className={getPrefixCls('filter-search-btn')}
                    icon={<SearchOutlined />}
                    size='small'
                    onClick={() => {
                        updateParams(value);
                    }}
                />
            )}
        </Input.Group>
    );
};

export default TextFilter;
