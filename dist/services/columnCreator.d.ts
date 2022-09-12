import { IObject, ProTabulatorColumns } from '../types';
declare const columnCreator: <DataType extends IObject, Params extends IObject = IObject>() => (dataIndex: keyof DataType | keyof Params, title: string, search: false | import("../types").DateRangeSearch | import("../types").SelectSearch | import("../types").TextSearch, options?: Omit<ProTabulatorColumns<DataType, Params, keyof DataType | keyof Params>, "dataIndex" | "title" | "search">) => {
    width?: string | number;
    fixed?: "left" | "right";
    renderText?: (value: (keyof DataType extends infer T ? T extends keyof DataType ? T extends keyof DataType ? DataType[T] : unknown : never : never) | (keyof Params extends infer T_1 ? T_1 extends keyof Params ? T_1 extends keyof DataType ? DataType[T_1] : unknown : never : never), record: DataType) => import("react").ReactNode;
    sorter?: boolean;
    dataIndex: keyof DataType | keyof Params;
    title: string;
    search: false | import("../types").DateRangeSearch | import("../types").SelectSearch | import("../types").TextSearch;
};
export default columnCreator;
