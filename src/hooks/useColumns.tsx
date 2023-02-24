import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { DateEditablePicker, DateRangeFilter } from '../components/DateFilter';
import { ProTabulatorProps } from '../types';
import { FilterHidden } from './useFilterButton';

const useColumns = <DataSource extends Record<string, any>, Params extends Record<string, any> = Record<string, any>>({
    columns,
    hiddenFilter,
    filterList,
    editable,
    ordered,
    rowKey,
    onDelete,
    hiddenActions,
}: Pick<ProTabulatorProps<DataSource, Params>, 'columns' | 'hiddenFilter' | 'ordered' | 'rowKey'> & {
    filterList: FilterHidden[];
    editable?: boolean;
    onDelete?: (id: string) => Promise<void>;
    hiddenActions?:
        | true
        | {
              edit?: boolean;
              delete?: boolean;
          };
}) => {
    const newColumns = columns.map((column) => {
        const filterItem = filterList.find((x) => x.dataIndex === column.dataIndex);
        const proColumn: ProColumns<DataSource> = {
            ...column,
            valueType: column.valueType === 'dateApartRange' ? undefined : column.valueType,
        };
        const disabled =
            column.hideInSearch ||
            !column.valueType ||
            !filterItem ||
            filterItem.filterMode === 'hidden' ||
            hiddenFilter;

        if (disabled) proColumn.search = false;
        if (column.valueType === 'dateApartRange') {
            if (!disabled) {
                proColumn.search = {
                    transform: (value, name) => {
                        return {
                            [name + 'Before']: value[0] ? dayjs(value[0]).startOf('day') : undefined,
                            [name + 'After']: value[1] ? dayjs(value[1]).endOf('day') : undefined,
                        };
                    },
                };
                proColumn.formItemProps = (form, schema) =>
                    !schema.isEditable
                        ? {
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
                          }
                        : {};
            }
            proColumn.renderFormItem = (schema) =>
                schema.isEditable ? <DateEditablePicker /> : <DateRangeFilter label={column.title} />;
            proColumn.render = (text) => dayjs(text as string).format('DD.MM.YYYY HH:mm');
        }

        return proColumn;
    });

    if (ordered)
        newColumns.unshift({
            title: '#',
            dataIndex: 'orderNumber',
            fixed: 'left',
            width: 45,
            hideInSearch: true,
            editable: false,
        });
    if (editable && typeof hiddenActions !== 'boolean')
        newColumns.push({
            title: 'Действия',
            valueType: 'option',
            width: 80,
            fixed: 'right',
            render(dom, entity, index, action) {
                if (typeof hiddenActions === 'boolean') return null;
                return (
                    <div className='pro-tabulator-edit-actions'>
                        {!hiddenActions?.edit && (
                            <Button
                                type='link'
                                size='small'
                                onClick={() => {
                                    action.startEditable(entity[rowKey]);
                                }}
                            >
                                <EditOutlined />
                            </Button>
                        )}
                        {!hiddenActions?.delete && (
                            <Popconfirm
                                title='Вы уверены?'
                                placement='left'
                                onConfirm={() => {
                                    onDelete(entity[rowKey]);
                                }}
                            >
                                <Button danger size='small' type='link'>
                                    <DeleteOutlined />
                                </Button>
                            </Popconfirm>
                        )}
                    </div>
                );
            },
        });
    return newColumns;
};

export default useColumns;
