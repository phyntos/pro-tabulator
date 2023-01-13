import { Space, DatePicker } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

const DateFilter = ({
    value,
    onChange,
    label,
}: {
    value?: dayjs.Dayjs[];
    onChange?: (value: dayjs.Dayjs[]) => void;
    label?: string;
}) => {
    return (
        <Space>
            <DatePicker
                value={value?.[0] || null}
                placeholder={`${label} (с)`}
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
                placeholder={`${label} (по)`}
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

export default DateFilter;
