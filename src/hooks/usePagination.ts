import { TablePaginationConfig, ConfigProvider } from 'antd';
import { useContext, useEffect } from 'react';
import TableStorage from '../services/TableStorage';
import { ProTabulatorProps } from '../types';

type TablePaginationHookArgs<DataSource extends Record<string, any>> = Pick<
    ProTabulatorProps<DataSource>,
    'id' | 'pagination' | 'actionRef'
> & {
    tableStorage: TableStorage;
    saveEditableFields?: () => void;
};

const usePagination = <DataSource extends Record<string, any>>({
    tableStorage,
    actionRef,
    pagination,
    id,
    saveEditableFields,
}: TablePaginationHookArgs<DataSource>) => {
    const { locale } = useContext(ConfigProvider.ConfigContext);

    useEffect(() => {
        if (id && pagination !== false) {
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
            items_per_page: locale.locale === 'ru' ? '/ записей' : locale.locale === 'kk' ? '/ жазба' : undefined,
        },
        showTotal:
            locale.locale === 'ru'
                ? (total: number) => `Всего: ${total} записей`
                : locale.locale === 'kk'
                ? (total: number) => `Барлығы: ${total} жазба`
                : undefined,
        ...pagination,
        onChange: (page, pageSize) => {
            saveEditableFields?.();
            pagination?.onChange?.(page, pageSize);
        },
    };
    return defaultPagination;
};

export default usePagination;
