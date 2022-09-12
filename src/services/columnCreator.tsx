import { IObject, ProTabulatorColumns } from '../types';

const columnCreator = <DataType extends IObject, Params extends IObject = IObject>() => {
    return (
        dataIndex: ProTabulatorColumns<DataType, Params>['dataIndex'],
        title: ProTabulatorColumns<DataType, Params>['title'],
        search: ProTabulatorColumns<DataType, Params>['search'],
        options?: Omit<ProTabulatorColumns<DataType, Params>, 'dataIndex' | 'title' | 'search'>,
    ) => {
        return {
            dataIndex,
            title,
            search,
            ...options,
        };
    };
};

export default columnCreator;
