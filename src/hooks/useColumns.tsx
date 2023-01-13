import { ProColumns, ProFieldRequestData } from '@ant-design/pro-components';
import { DefaultOptionType } from 'antd/es/select';
import dayjs from 'dayjs';
import React from 'react';
import DateFilter from '../components/DateFilter';
import { ProTabulatorProps } from '../ProTabulator';
import { FilterHidden } from './useFilterButton';

const useColumns = <DataSource extends Record<string, any>, Params extends Record<string, any> = Record<string, any>>({
    columns,
    hiddenFilter,
    filterHiddens,
}: Pick<ProTabulatorProps<DataSource, Params>, 'columns' | 'hiddenFilter'> & {
    filterHiddens: FilterHidden[];
}) => {
    return columns.map((column) => {
        const filterHidden = filterHiddens.find((x) => x.dataIndex === column.dataIndex);
        const proColumn: ProColumns<DataSource> = {
            title: column.title,
            dataIndex: column.dataIndex,
            hideInTable: column.hidden,
            width: column.width,
        };
        const disabled = column.filter === undefined || filterHidden?.hidden === true || hiddenFilter === true;

        if (disabled) proColumn.search = false;
        if (column.filter.type === 'text') {
            proColumn.valueType = 'text';
        }
        if (column.filter.type === 'select') {
            proColumn.valueType = 'select';
            proColumn.fieldProps = {
                mode: column.filter.multiple ? 'multiple' : undefined,
                options: column.filter.options as DefaultOptionType[],
            };
            proColumn.valueEnum = column.filter.enum;
            proColumn.request = column.filter.request as ProFieldRequestData<any>;
        }
        if (column.filter.type === 'date') {
            if (!disabled) {
                proColumn.renderFormItem = () => <DateFilter label={column.title} />;
                proColumn.search = {
                    transform: (value, name) => {
                        return {
                            [name + 'Before']: value[0] ? dayjs(value[0]).startOf('day') : undefined,
                            [name + 'After']: value[1] ? dayjs(value[1]).endOf('day') : undefined,
                        };
                    },
                };
                proColumn.formItemProps = {
                    lightProps: {
                        labelFormatter: (value) => {
                            const before = value[0] || undefined;
                            const after = value[1] || undefined;
                            let label = '';
                            if (before) label += 'c ' + before.format('DD.MM.YYYY');
                            if (before && after) label += ' ';
                            if (after) label += 'по ' + after.format('DD.MM.YYYY');
                            return label;
                        },
                    },
                };
            }
            proColumn.renderText = (text) => dayjs(text).format('DD.MM.YYYY HH:mm');
        }

        return proColumn;
    });
};

export default useColumns;
