import { AxiosParamsType, IObject } from 'src/types';

const getStorageValues = <Params extends IObject = IObject>(
    tabulatorID: string,
    persistenceType?: 'sessionStorage' | 'localStorage',
) => {
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

export default getStorageValues;
