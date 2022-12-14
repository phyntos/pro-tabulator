import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import React, { useState } from 'react';
import { DateRangeSearch } from '../types';
import FilterSearch from './FilterSearch';
import { FilterProps } from './TitleFilter';

type DateRangeFilterProps = Omit<DateRangeSearch, 'type'> & FilterProps;

const DateRangeFilter = ({
    title = 'Дата',
    onChange,
    getValue,
    beforeName = (name) => name + 'Before',
    afterName = (name) => name + 'After',
    name,
    updateOnChange,
}: DateRangeFilterProps) => {
    const before = typeof beforeName === 'string' ? beforeName : beforeName(name);
    const after = typeof afterName === 'string' ? afterName : afterName(name);

    const [dateRange, setDateRange] = useState<{
        [key: string]: Moment | null;
    }>({
        [after]: getValue(after) ? moment(getValue(after)) : null,
        [before]: getValue(before) ? moment(getValue(before)) : null,
    });

    const updateParams = (dateRange: { [key: string]: Moment | null }) => {
        const beforeDate = dateRange[before]?.format('YYYY-MM-DD');
        const afterDate = dateRange[after]?.format('YYYY-MM-DD');
        onChange({
            [before]: beforeDate,
            [after]: afterDate,
        });
    };

    return (
        <FilterSearch
            onClick={() => {
                updateParams(dateRange);
            }}
            hidden={updateOnChange}
        >
            <DatePicker
                value={dateRange[before]}
                size='small'
                placeholder={`${title} (с)`}
                onChange={(date) => {
                    setDateRange((value) => {
                        const updatedRange = { ...value, [before]: date };
                        if (updateOnChange) updateParams(updatedRange);
                        return updatedRange;
                    });
                }}
                format={(date) => date.format('DD.MM.YYYY')}
            />
            <DatePicker
                value={dateRange[after]}
                size='small'
                placeholder={`${title} (по)`}
                onChange={(date) => {
                    setDateRange((value) => {
                        const updatedRange = { ...value, [after]: date };
                        if (updateOnChange) updateParams(updatedRange);
                        return updatedRange;
                    });
                }}
                format={(date) => date.format('DD.MM.YYYY')}
            />
        </FilterSearch>
    );
};

export default DateRangeFilter;
