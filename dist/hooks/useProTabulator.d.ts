import { IObject, ProTabulatorProps } from '../types';
declare const useProTabulator: <DataType extends IObject, Params extends IObject = IObject>(props: ProTabulatorProps<DataType, Params>) => {
    tabulator: JSX.Element;
    reload: (resetPageIndex?: boolean) => Promise<void>;
};
export default useProTabulator;
