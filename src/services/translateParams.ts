import { SortOrder } from 'antd/lib/table/interface';
import React from 'react';
import { AxiosParamsType, IObject } from '../types';

type RequestArgs<Params> = [
    params: Params & {
        pageSize?: number;
        current?: number;
        keyword?: string;
    },
    sort: Record<string, SortOrder>,
    filter: Record<string, React.ReactText[] | null>,
];

const translateParams = <Params extends IObject = IObject>(
    ...requestArgs: RequestArgs<Params>
): AxiosParamsType<Params> => {
    const [{ current, pageSize, ...params }, sorter] = requestArgs;
    const sort = Object.entries(sorter)[0];
    const orderBy = sort ? sort[0] + (sort[1] === 'ascend' ? 'Asc' : 'Desc') : undefined;
    return { ...params, current, pageSize, orderBy } as AxiosParamsType<Params>;
};

export default translateParams;
