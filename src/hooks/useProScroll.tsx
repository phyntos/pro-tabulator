import { ProTableProps } from '@ant-design/pro-table';
import { useEffect, useState } from 'react';
import { getElementSize } from '../services';
import useWindowSize from './useWindowSize';

const TABLE_PAGINATION = 40;

const useProScroll = (tabulatorID: string, loading: boolean): ProTableProps<unknown, unknown>['scroll'] => {
    const { width, height } = useWindowSize();
    const [scroll, setScroll] = useState<ProTableProps<unknown, unknown>['scroll']>();

    const getTableScroll = (tabulatorID: string): ProTableProps<unknown, unknown>['scroll'] => {
        const proTableClassName = `.tabulator-pro-table.${tabulatorID}`;

        const { height: tableHeight, width: tableWidth } = getElementSize(proTableClassName);
        const tableToolbarHeight = getElementSize(`${proTableClassName} .tabulator-pro-table-list-toolbar`).height;
        const tableHeadHeight = getElementSize(`${proTableClassName} .tabulator-table-thead`).height;
        const height = tableHeight - tableToolbarHeight - tableHeadHeight - TABLE_PAGINATION;

        return {
            x: tableWidth - 9,
            y: height,
        };
    };

    useEffect(() => {
        if (loading === false) {
            setScroll(getTableScroll(tabulatorID));
        }
    }, [width, height, loading]);

    return scroll;
};

export default useProScroll;
