import { AxiosParamsType, IObject } from 'src/types';
declare const getStorageValues: <Params extends IObject = IObject>(tabulatorID: string, persistenceType?: 'sessionStorage' | 'localStorage') => Omit<AxiosParamsType<Params>, "current" | "pageSize" | "orderBy">;
export default getStorageValues;
