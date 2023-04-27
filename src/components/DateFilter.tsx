import { Space, DatePicker } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import useLocale from '../hooks/useLocale';

export const DateRangeFilter = ({
    value,
    onChange,
    label,
}: {
    value?: dayjs.Dayjs[];
    onChange?: (value: dayjs.Dayjs[]) => void;
    label?: string;
}) => {
    const getLocale = useLocale();
    return (
        <Space>
            <DatePicker
                value={value?.[0] || null}
                placeholder={`${label} (${getLocale('from')})`}
                onChange={(date) => {
                    onChange([date, value?.[1]]);
                }}
                format={(date) => date.format('DD.MM.YYYY')}
                disabledDate={(date) => {
                    if (value?.[1]) {
                        return date.isAfter(value?.[1]);
                    }
                    return false;
                }}
            />
            <DatePicker
                value={value?.[1] || null}
                placeholder={`${label} (${getLocale('to')})`}
                onChange={(date) => {
                    onChange([value?.[0], date]);
                }}
                format={(date) => date.format('DD.MM.YYYY')}
                disabledDate={(date) => {
                    if (value?.[0]) {
                        return date.isBefore(value?.[0]);
                    }
                    return false;
                }}
            />
        </Space>
    );
};

export const DateEditablePicker = ({
    value,
    onChange,
}: {
    value?: string | dayjs.Dayjs;
    onChange?: (value: dayjs.Dayjs) => void;
}) => {
    return (
        <DatePicker
            showTime={{
                showSecond: false,
            }}
            value={
                typeof value === 'string'
                    ? dayjs(value, value.includes('T') ? 'YYYY-MM-DDTHH:mm' : 'DD.MM.YYYY HH:mm')
                    : value || null
            }
            onChange={(date) => {
                onChange(date);
            }}
            format={(date) => date.format('DD.MM.YYYY HH:mm')}
        />
    );
};
