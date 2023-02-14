import { SpinProps } from 'antd';
import { useEffect, useState } from 'react';
import useWindowSize from '../hooks/useWindowSize';

const useHeightScroll = (id?: string, loading?: boolean | SpinProps) => {
    const [heightScroll, setHeightScroll] = useState<number | undefined>(undefined);
    const { height } = useWindowSize();

    console.log(heightScroll);

    useEffect(() => {
        const selector = id ? '.' + id : '';
        const proTabulatorSelector = `${selector}.pro-tabulator`;
        const proTabulator = document.querySelector<HTMLElement>(`${selector}.pro-tabulator`);
        const toolBar = document.querySelector<HTMLElement>(
            `${proTabulatorSelector} .tabulator-pro-table-list-toolbar`,
        );
        const tableHead = document.querySelector<HTMLElement>(`${proTabulatorSelector} .tabulator-table-thead`);
        const pagination = document.querySelector<HTMLElement>(`${proTabulatorSelector} .tabulator-pagination`);

        if (proTabulator && tableHead) {
            console.log([
                proTabulator?.offsetHeight,
                toolBar?.offsetHeight,
                tableHead?.offsetHeight,
                pagination?.offsetHeight,
            ]);
            let heightScroll = proTabulator.offsetHeight;

            if (toolBar) heightScroll -= toolBar.offsetHeight + 10;
            if (tableHead) heightScroll -= tableHead.offsetHeight;
            if (pagination) heightScroll -= pagination.offsetHeight + 16;
            setHeightScroll(heightScroll);
        } else {
            setHeightScroll(undefined);
        }
    }, [height, id, loading]);

    return heightScroll;
};

export default useHeightScroll;
