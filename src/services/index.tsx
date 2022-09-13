import { ProTableProps } from '@ant-design/pro-table';
import { AxiosParamsType, OptionType, ProColumnCreatorFunc, SelectSearch } from '../types';

const getStorageValues = <Params,>(tabulatorID: string, persistenceType?: 'sessionStorage' | 'localStorage') => {
    if (persistenceType) {
        const storageAxiosParams = window[persistenceType].getItem(tabulatorID + '_AxiosParams');
        if (storageAxiosParams) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { pageSize, current, orderBy, ...values } = JSON.parse(storageAxiosParams) as AxiosParamsType<Params>;

            return values;
        }
    }
    return null;
};

const getOptions = async ({ valueEnum, request, persistenceKey, options }: SelectSearch) => {
    if (options) return options;
    if (valueEnum) {
        return Object.keys(valueEnum).map((key) => ({
            value: key,
            label: valueEnum[key],
        }));
    }
    if (request) {
        if (persistenceKey) {
            const storageOptions = sessionStorage.getItem(persistenceKey);
            if (storageOptions) {
                return JSON.parse(storageOptions) as OptionType[];
            }
        }
        options = await request();
        if (persistenceKey) {
            sessionStorage.setItem(persistenceKey, JSON.stringify(options));
        }
    }
    return options;
};

const columnCreator = <DataType, Params>(): ProColumnCreatorFunc<DataType, Params> => {
    return (dataIndex, title, search = false, options = {}) => {
        return { dataIndex, title, search, ...options };
    };
};

const getElementSize = (selector: string) => {
    const height = document.querySelector<HTMLElement>(selector)?.offsetHeight || 0;
    const width = document.querySelector<HTMLElement>(selector)?.offsetWidth || 0;
    return { height, width };
};

const translateParams = <DataType, Params>(
    ...requestArgs: Parameters<ProTableProps<DataType, Params>['request']>
): AxiosParamsType<Params> => {
    const [{ current, pageSize, ...params }, sorter] = requestArgs;
    const sort = Object.entries(sorter)[0];
    const orderBy = sort ? sort[0] + (sort[1] === 'ascend' ? 'Asc' : 'Desc') : undefined;
    return { ...params, current, pageSize, orderBy } as AxiosParamsType<Params>;
};

export { getElementSize, getOptions, translateParams, columnCreator, getStorageValues };
