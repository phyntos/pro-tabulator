import { ProTableProps } from '@ant-design/pro-table';
import React from 'react';
import { translateParams } from '../services';
import { AxiosParamsType, IObject, ProTabulatorProps } from '../types';

type TablePaginationHookArgs<DataType extends IObject, Params extends IObject = IObject> = Pick<
    ProTabulatorProps<DataType, Params>,
    'request' | 'numbered'
> & {
    setAxiosParams: React.Dispatch<React.SetStateAction<AxiosParamsType<Params>>>;
    setTotal: React.Dispatch<React.SetStateAction<number>>;
};

type RequestFunction<DataType, Params> = ProTableProps<DataType, Params>['request'];

function useRequest<DataType extends IObject, Params extends IObject = IObject>({
    request,
    setAxiosParams,
    setTotal,
    numbered,
}: TablePaginationHookArgs<DataType, Params>) {
    const tableRequest: RequestFunction<DataType, Params> = async (params, sorter, filter) => {
        const axiosParams = translateParams<Params>(params, sorter, filter);

        if (request) {
            setAxiosParams(axiosParams);
            const response = await request(axiosParams);
            let { data } = response;
            const { current, pageSize } = params;
            if (numbered) {
                data = data.map((item, index) => {
                    if (current && pageSize) {
                        const numberedIndex = (current - 1) * pageSize + index + 1;
                        return { ...item, numberedIndex };
                    }
                    return item;
                });
            }

            setTotal(response.total);

            return { data, success: true, total: response.total };
        } else {
            return { data: [], success: false };
        }
    };
    return tableRequest;
}

export default useRequest;
