import { SortOrder } from 'antd/lib/table/interface';
import { ProTabulatorRequestParams } from '../types';

const getRequestParams = <U>(
    params: ProTabulatorRequestParams<U>,
    sorter: Record<string, SortOrder>,
): ProTabulatorRequestParams<U> => {
    const sort = Object.entries(sorter)[0];
    const orderBy = params.orderBy || (sort ? sort[0] + (sort[1] === 'ascend' ? 'Asc' : 'Desc') : undefined);
    return JSON.parse(JSON.stringify({ ...params, orderBy }));
};

export default getRequestParams;
