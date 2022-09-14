import { ProColumns } from '@ant-design/pro-table';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TitleFilter, { TitleFilterProps } from '../filters/TitleFilter';
import TitleNoFilter from '../filters/TitleNoFilter';
import { columnCreator, getOptions } from '../services';
import { IObject, ProTabulatorProps } from '../types';

type ProColumnsHookArgs<DataType extends IObject, Params extends IObject> = Pick<
    ProTabulatorProps<DataType, Params>,
    'columns' | 'params' | 'numbered'
> & {
    updateParams: (params: Params) => void;
};

const useProColumns = <DataType extends IObject, Params extends IObject>({
    columns: tabulatorColumns,
    params,
    updateParams,
    numbered,
}: ProColumnsHookArgs<DataType, Params>) => {
    const [columnsLoading, setLoading] = useState<boolean>(false);
    const [columns, setColumns] = useState<ProColumns<DataType>[]>([]);
    const { columnList, isSearch } = useMemo(() => {
        const getCol = columnCreator<DataType, Params>();
        const columnList = typeof tabulatorColumns === 'function' ? tabulatorColumns(getCol) : tabulatorColumns;
        return {
            columnList,
            isSearch: columnList.some((column) => column.search !== false),
        };
    }, [tabulatorColumns]);

    const translateColumns = useCallback(async () => {
        setLoading(true);
        const proTableColumns = await Promise.all(
            columnList.map<Promise<ProColumns<DataType>>>(async ({ search, dataIndex, title, width, ...extra }) => {
                const name = String(dataIndex);

                const proColumn: ProColumns<DataType> = {
                    title,
                    width,
                    dataIndex: name,
                    search: false,
                    ellipsis: { showTitle: true },
                    ...extra,
                };

                if (search) {
                    const filterProps: TitleFilterProps<Params> = {
                        title,
                        updateParams,
                        name,
                        params,
                        ...search,
                    };
                    if (filterProps.type === 'select' && search.type === 'select') {
                        try {
                            const options = await getOptions(search);
                            filterProps.options = options;
                            if (search.renderOption) {
                                proColumn.renderText = (value: string) =>
                                    options.find((option) => option.value === value)?.label;
                            }
                        } catch (error) {
                            console.log('error');
                            filterProps.error = true;
                        }
                    }
                    if (search.type === 'dateRange') {
                        if (search.updateOnChange) {
                            proColumn.width = '296px';
                        } else {
                            proColumn.width = '320px';
                        }
                        proColumn.renderText = (value: string) => moment(value).format('DD.MM.YYYY HH:mm');
                    }
                    proColumn.title = <TitleFilter<Params> {...filterProps} />;
                } else {
                    proColumn.title = <TitleNoFilter title={title} isSearch={isSearch} />;
                }
                return proColumn;
            }),
        );
        setLoading(false);
        setColumns(proTableColumns);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columnList, isSearch]);

    useEffect(() => {
        translateColumns();
    }, [translateColumns]);

    useEffect(() => {
        if (numbered) {
            const isIncludes = columns.some((column) => column.dataIndex === 'numberedIndex');
            if (!isIncludes) {
                setColumns((columns) => [
                    {
                        title: <TitleNoFilter title='#' isSearch={isSearch} />,
                        dataIndex: 'numberedIndex',
                        fixed: 'left',
                        width: '50px',
                    },
                    ...columns,
                ]);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numbered, columns, isSearch]);

    return { columns, columnsLoading };
};

export default useProColumns;
