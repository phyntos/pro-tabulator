import { TablePaginationConfig } from 'antd';
import { useEffect } from 'react';
import TableStorage from '../services/TableStorage';
import { ProTabulatorProps } from '../types';

type TablePaginationHookArgs<DataSource extends Record<string, any>> = Pick<
    ProTabulatorProps<DataSource>,
    'id' | 'pagination' | 'actionRef' | 'disableStorage'
> & {
    tableStorage: TableStorage;
    onChange?: () => void;
};

const useTablePagination = <DataSource extends Record<string, any>>({
    tableStorage,
    actionRef,
    pagination,
    id,
    disableStorage,
    onChange,
}: TablePaginationHookArgs<DataSource>) => {
    useEffect(() => {
        if (id && pagination !== false && !disableStorage) {
            const pageInfo = tableStorage.getPageInfo();
            actionRef?.current?.setPageInfo?.(pageInfo);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, pagination]);

    if (pagination == false) return false;

    const defaultPagination: TablePaginationConfig = {
        showSizeChanger: true,
        defaultPageSize: 10,
        size: 'small',
        defaultCurrent: 1,
        locale: {
            items_per_page: '/ записей',
        },
        showTotal: (total: number) => `Всего: ${total} записей`,
        ...pagination,
        onChange: (page, pageSize) => {
            pagination?.onChange?.(page, pageSize);
            onChange?.();
        },
    };
    return defaultPagination;
};

export default useTablePagination;
