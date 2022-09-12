import { SelectSearch } from 'src/types';
declare const getOptions: ({ valueEnum, options, request }: SelectSearch) => Promise<{
    value: string;
    label: string;
}[]>;
export default getOptions;
