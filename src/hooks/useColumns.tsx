import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { DateEditablePicker, DateRangeFilter } from '../components/DateFilter';
import { ProTabulatorProps } from '../types';
import { FilterHidden } from './useFilterButton';
import useLocale from './useLocale';

const useColumns = <DataSource extends Record<string, any>, Params extends Record<string, any> = Record<string, any>>({
    columns,
    hiddenFilter,
    filterList,
    editable,
    isCreateMode,
    ordered,
    rowKey,
    onDelete,
    hideColumns = [],
    hiddenActions,
    sorter,
}: Pick<
    ProTabulatorProps<DataSource, Params>,
    'columns' | 'hiddenFilter' | 'ordered' | 'rowKey' | 'sorter' | 'hideColumns'
> & {
    filterList: FilterHidden[];
    editable?: boolean;
    isCreateMode?: boolean;
    onDelete?: (id: string) => Promise<void>;
    hiddenActions?:
        | true
        | {
              edit?: boolean;
              delete?: boolean;
          };
}) => {
    const getLocale = useLocale();
    const optionColumns = columns.filter((x) => x.valueType === 'option');

    const newColumns = columns
        .filter((x) => x.valueType !== 'option')
        .map((column) => {
            const filterItem = filterList.find((x) => x.dataIndex === column.dataIndex);

            const isHidden = hideColumns.includes(column.dataIndex);

            const hideInSearch = typeof column.hideInSearch === 'undefined' ? isHidden : column.hideInSearch;

            const proColumn: ProColumns<DataSource> = {
                ...column,
                valueType: column.valueType === 'dateApartRange' ? undefined : column.valueType,
                sorter: typeof column.sorter === 'undefined' ? sorter : column.sorter,
                hideInTable: typeof column.hideInTable === 'undefined' ? isHidden : column.hideInTable,
                hideInSearch,
            };

            const disabled =
                hideInSearch || !column.valueType || !filterItem || filterItem.filterMode === 'hidden' || hiddenFilter;

            if (disabled) proColumn.search = false;

            proColumn.formItemProps = (...args) => {
                const values =
                    typeof column.formItemProps === 'function'
                        ? column.formItemProps(...args)
                        : column.formItemProps ?? {};
                return { lightProps: { placement: 'bottomLeft', ...values.lightProps }, ...values };
            };

            if (proColumn.valueType === 'select') {
                proColumn.fieldProps = (...args) => {
                    const values =
                        typeof column.fieldProps === 'function' ? column.fieldProps(...args) : column.fieldProps;
                    return { dropdownMatchSelectWidth: false, ...values };
                };
            }
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
                                          if (before)
                                              label +=
                                                  getLocale('fromBefore') +
                                                  before.format('DD.MM.YYYY') +
                                                  getLocale('fromAfter');
                                          if (before && after) label += getLocale('between');
                                          if (after)
                                              label +=
                                                  getLocale('toBefore') +
                                                  after.format('DD.MM.YYYY') +
                                                  getLocale('toAfter');
                                          return label;
                                      },
                                  },
                              }
                            : {};
                }

                proColumn.renderFormItem = (schema) =>
                    schema.isEditable ? <DateEditablePicker /> : <DateRangeFilter label={column.title} />;

                proColumn.render = (...args) => {
                    if (column.render) return column.render(...args);
                    const text = args[0];
                    return text && text !== '-' ? dayjs(text as string).format('DD.MM.YYYY HH:mm') : '';
                };
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

    const editableShow = editable && typeof hiddenActions !== 'boolean';

    if (editableShow || optionColumns.length > 0)
        newColumns.push({
            title: getLocale('actions'),
            valueType: 'option',
            width: '100px',
            fixed: 'right',
            render(dom, entity, index, action, schema) {
                return (
                    <div className='pro-tabulator-edit-actions'>
                        {editableShow && !isCreateMode && !hiddenActions?.edit && (
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
                        {editableShow && !isCreateMode && !hiddenActions?.delete && (
                            <Popconfirm
                                title={getLocale('areYouSure')}
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
                        {!isCreateMode && optionColumns.map((col) => col.render(dom, entity, index, action, schema))}
                    </div>
                );
            },
        });
    return newColumns;
};

export default useColumns;
