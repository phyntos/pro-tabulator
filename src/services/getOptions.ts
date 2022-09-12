import { SelectSearch } from 'src/types';

const getOptions = async ({ valueEnum, options, request }: SelectSearch) => {
    if (options) return options;
    if (valueEnum) {
        return Object.keys(valueEnum).map((key) => ({
            value: key,
            label: valueEnum[key],
        }));
    }
    if (request) return await request();
    return [];
};

export default getOptions;
