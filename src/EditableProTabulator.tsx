import { legacyLogicalPropertiesTransformer, StyleProvider } from '@ant-design/cssinjs';
import { PlusOutlined, RollbackOutlined, SaveOutlined } from '@ant-design/icons';
import { ActionType, EditableProTable, ProForm } from '@ant-design/pro-components';
import { Button, ConfigProvider, FormInstance, SpinProps } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import React, { useImperativeHandle, useMemo, useRef, useState } from 'react';
import useColumns from './hooks/useColumns';
import useDownload from './hooks/useDownload';
import useFilterButton from './hooks/useFilterButton';
import useTablePagination from './hooks/useTablePagination';
import useUpload from './hooks/useUpload';
import './pro-tabulator.css';
import useHeightScroll from './services/getHeightScroll';
import getInitialValues from './services/getInitialValues';
import getOrderedData from './services/getOrderedData';
import getRequestParams from './services/getRequestParams';
import TableStorage from './services/TableStorage';
import { EditableProTabulatorProps } from './types';

const EditableProTabulator = <
    DataSource extends Record<string, any>,
    Params extends Record<string, any> = Record<string, any>,
>({
    columns,
    hiddenFilter,
    dataSource,
    request,
    rowClick,
    ordered,
    id,
    actionRef: propActionRef,
    formRef: propFormRef,
    downloadProps,
    disableStorage,
    toolBarRender,
    pagination,
    className,
    options,
    colorPrimary,
    disableHeightScroll,
    editableProps,
    onLoadingChange,
    rowKey = 'id',
    editable,
    uploadProps,
    ...props
}: EditableProTabulatorProps<DataSource, Params>) => {
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
    const actionRef = useRef<ActionType>();
    const formRef = useRef<FormInstance<any>>();
    const [loading, setLoading] = useState<boolean | SpinProps>();
    const heightScroll = useHeightScroll(id, loading);

    const tableStorage = useMemo(() => new TableStorage<Params>(id), [id]);
    const storageParams = tableStorage.getFormValues();

    const initialValues = useMemo(
        () => (disableStorage || !id || hiddenFilter ? {} : getInitialValues<DataSource>(columns, storageParams)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const [form] = ProForm.useForm();

    const editableFields = ProForm.useWatch([], form);

    useImperativeHandle(propActionRef, () => actionRef.current);
    useImperativeHandle(propFormRef, () => formRef.current);

    const [filterButton, filterList] = useFilterButton({
        columns,
        hiddenFilter,
        tableStorage,
    });

    const proColumns = useColumns({
        columns,
        filterList,
        hiddenFilter,
        ordered,
        editable: true,
        rowKey,
        onDelete: async (id) => {
            await editableProps?.onDelete?.(id);
            actionRef.current.reload();
        },
    });

    const { downloadRender, onDataSourceChange } = useDownload({
        columns,
        actionRef,
        downloadProps,
        id,
        ordered,
        request,
        tableStorage,
    });

    const { uploadRender } = useUpload<DataSource>({ uploadProps, columns, actionRef });

    const defaultPagination = useTablePagination<DataSource>({
        id,
        pagination,
        actionRef,
        tableStorage,
        disableStorage,
        onChange: () => {
            if (editableKeys.length > 0 && Object.keys(editableFields).length > 0) {
                saveAll(editableFields);
            }
        },
    });
    // actionRef.current.
    const classNames = ['pro-tabulator'];
    if (className) classNames.push(className);
    if (id) classNames.push(id);

    const saveAll = async (editableFields: any) => {
        const fieldList = Object.entries<DataSource>(editableFields).map(([key, value]) => {
            return {
                [rowKey]: key,
                ...value,
            };
        });
        await editableProps?.onSaveMultiple?.(fieldList);
        setEditableRowKeys((old) =>
            old.filter((val) => !fieldList.some((field) => String(field[rowKey]) === String(val))),
        );
    };

    return (
        <StyleProvider hashPriority='high' transformers={[legacyLogicalPropertiesTransformer]}>
            <ConfigProvider
                locale={ruRU}
                theme={
                    colorPrimary
                        ? {
                              token: {
                                  colorPrimary,
                              },
                          }
                        : undefined
                }
                prefixCls='pro-tabulator'
                iconPrefixCls='pro-tabulator-icon'
            >
                <EditableProTable<DataSource, Params>
                    dataSource={dataSource}
                    actionRef={actionRef}
                    request={async (params, sorter) => {
                        const requestParams = getRequestParams<Params>(params, sorter);
                        if (tableStorage && !disableStorage) {
                            tableStorage.setParams(requestParams);
                        }
                        const response = await request(requestParams);
                        const { total } = response;
                        let { data } = response;
                        if (total && tableStorage && !disableStorage) tableStorage.setTotal(total);
                        if (ordered) {
                            data = getOrderedData(data, params.current, params.pageSize);
                        }
                        return {
                            data,
                            total,
                        };
                    }}
                    rowKey={rowKey}
                    toolBarRender={(action, rows) => {
                        const toolBarRenders =
                            toolBarRender !== false && toolBarRender ? toolBarRender(action, rows) : [];

                        if (editableKeys.length > 0 && Object.keys(editableFields).length > 0)
                            toolBarRenders.push(
                                <Button
                                    type='primary'
                                    key='saveAll'
                                    onClick={async () => {
                                        const fields = await form.validateFields();
                                        await saveAll(fields);
                                        actionRef.current.reload();
                                    }}
                                    icon={<SaveOutlined />}
                                >
                                    {editableProps?.saveAllText || 'Сохранить все'}
                                </Button>,
                            );
                        toolBarRenders.push(
                            <Button
                                key='create'
                                type='primary'
                                onClick={async () => {
                                    await editableProps?.onCreate?.();
                                    actionRef.current.reloadAndRest();
                                }}
                                icon={<PlusOutlined />}
                            >
                                {editableProps?.createText || 'Добавить'}
                            </Button>,
                        );

                        toolBarRenders.push(uploadRender);
                        toolBarRenders.push(downloadRender);
                        return toolBarRenders;
                    }}
                    form={{ initialValues }}
                    onDataSourceChange={onDataSourceChange}
                    pagination={defaultPagination}
                    bordered
                    size='middle'
                    toolbar={{
                        title: hiddenFilter || !filterList.length ? undefined : filterButton,
                    }}
                    editable={{
                        type: 'multiple',
                        editableKeys,
                        onSave: async (rowKey, data) => {
                            await editableProps?.onSave?.(data);
                            actionRef.current.reload();
                        },
                        actionRender: (row, config, dom) => [dom.save, dom.cancel],
                        form,
                        onChange: setEditableRowKeys,
                        saveText: <SaveOutlined />,
                        cancelText: <RollbackOutlined />,
                        ...editable,
                    }}
                    recordCreatorProps={false}
                    className={classNames.join(' ')}
                    onLoadingChange={(loading) => {
                        setLoading(loading);
                        onLoadingChange?.(loading);
                    }}
                    scroll={{
                        x: true,
                        y: disableHeightScroll ? undefined : heightScroll,
                    }}
                    columns={proColumns}
                    search={{
                        filterType: 'light',
                    }}
                    options={
                        options !== false
                            ? {
                                  density: false,
                                  reload: true,
                                  setting: false,
                                  ...options,
                              }
                            : false
                    }
                    dateFormatter='string'
                    onRow={(row) => {
                        return {
                            onClick: () => rowClick?.(row),
                            style: {
                                cursor: rowClick ? 'pointer' : undefined,
                            },
                        };
                    }}
                    {...props}
                />
            </ConfigProvider>
        </StyleProvider>
    );
};

export default EditableProTabulator;
