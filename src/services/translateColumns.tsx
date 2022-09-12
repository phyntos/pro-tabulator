import { ProColumns } from '@ant-design/pro-table';
import moment from 'moment';
import React from 'react';
import { getOptions, getStorageValues } from '.';
import TitleFilter, { TitleFilterProps } from '../components/TitleFilter';
import TitleNoFilter from '../components/TitleNoFilter';
import { IObject, ProTabulatorColumns } from '../types';

type TranslateColumnsArgs<DataType extends IObject, Params extends IObject = IObject> = {
    columns: ProTabulatorColumns<DataType, Params>[];
    setParams: React.Dispatch<React.SetStateAction<Params>>;
    params: Params;
    persistenceType?: 'localStorage' | 'sessionStorage' | undefined;
    tabulatorID: string;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const translateColumns = async <DataType extends IObject, Params extends IObject = IObject>({
    columns,
    setParams,
    params,
    persistenceType,
    tabulatorID,
    setLoading,
}: TranslateColumnsArgs<DataType, Params>): Promise<ProColumns<DataType>[]> => {
    const axiosParams = getStorageValues<Params>(tabulatorID, persistenceType);
    if (axiosParams) {
        setParams((params) => ({ ...params, ...axiosParams }));
    }
    setLoading(true);
    const proTableColumns = await Promise.all(
        columns.map<Promise<ProColumns<DataType>>>(async ({ search, dataIndex, title, width, ...extra }) => {
            const stringDataIndex = String(dataIndex);

            const proColumn: ProColumns<DataType> = {
                title,
                width,
                dataIndex: stringDataIndex,
                search: false,
                ellipsis: {
                    showTitle: true,
                },
                ...extra,
            };

            if (search) {
                const filterProps: TitleFilterProps<Params> = {
                    title,
                    setParams,
                    name: stringDataIndex,
                    params: { ...params, ...axiosParams },
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
                        proColumn.width = '283px';
                    } else {
                        proColumn.width = '307px';
                    }
                    proColumn.renderText = (value: string) => moment(value).format('DD.MM.YYYY HH:mm');
                }
                proColumn.title = <TitleFilter<Params> {...filterProps} />;
            } else {
                proColumn.title = <TitleNoFilter title={title} />;
            }
            return proColumn;
        }),
    );
    setLoading(false);
    return proTableColumns;
};

export default translateColumns;
