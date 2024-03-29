import { DeleteOutlined, EditOutlined, PlusOutlined, RollbackOutlined, SaveOutlined } from '@ant-design/icons';
import { ActionType, EditableProTable, ProForm, ProTable } from '@ant-design/pro-components';
import { Button, FormInstance, Popconfirm, Space, SpinProps } from 'antd';
import React, { useImperativeHandle, useMemo, useRef, useState } from 'react';
import ProTabulatorProvider from './components/ProTabulatorProvider';
import useColumns from './hooks/useColumns';
import useDownload from './hooks/useDownload';
import useFilterButton from './hooks/useFilterButton';
import usePagination from './hooks/usePagination';
import useUpload from './hooks/useUpload';
import './pro-tabulator.css';
import useAlertMessage from './hooks/useAlertMessage';
import useHeightScroll from './services/getHeightScroll';
import getInitialValues from './services/getInitialValues';
import getOrderedData from './services/getOrderedData';
import getRequestParams from './services/getRequestParams';
import TableStorage from './services/TableStorage';
import { ProTabulatorProps } from './types';
import useLocale from './hooks/useLocale';

const ProTabulator = <
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
    disableHeightScroll,
    editableProps,
    onLoadingChange,
    rowKey = 'id',
    editable,
    uploadProps,
    rowSelection,
    tableAlertRender,
    tableAlertOptionRender,
    showSorterTooltip = false,
    toolbar,
    sorter,
    hideColumns,
    ...props
}: ProTabulatorProps<DataSource, Params>) => {
    const [editableKeys, setEditableKeys] = useState<React.Key[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const actionRef = useRef<ActionType>();
    const formRef = useRef<FormInstance<any>>();
    const [loading, setLoading] = useState<boolean | SpinProps>();
    const heightScroll = useHeightScroll(id, loading);

    const tableStorage = useMemo(() => new TableStorage<Params>(id, disableStorage), [id, disableStorage]);
    const storageParams = tableStorage.getFormValues();

    const getAlertMessage = useAlertMessage();
    const getLocale = useLocale();

    const initialValues = useMemo(
        () => (hiddenFilter ? {} : getInitialValues<DataSource>(columns, storageParams)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const isCreateMode = editableKeys.includes('CREATE');

    const [form] = ProForm.useForm();

    const editableFields = ProForm.useWatch([], form);

    useImperativeHandle(propActionRef, () => actionRef.current);
    useImperativeHandle(propFormRef, () => formRef.current);

    const [filterButton, filterList] = useFilterButton({
        columns,
        hiddenFilter,
        tableStorage,
        hideColumns,
    });

    const proColumns = useColumns({
        columns,
        filterList,
        hiddenFilter,
        ordered,
        editable,
        rowKey,
        hiddenActions: editableProps?.hidden?.actions,
        isCreateMode,
        onDelete: async (id) => {
            await editableProps?.onDelete?.(id);
            setSelectedKeys((old) => old.filter((val) => String(id) !== String(val)));
            actionRef.current.reload();
        },
        sorter,
        hideColumns,
    });

    const { downloadRender } = useDownload({
        columns,
        actionRef,
        downloadProps,
        id,
        ordered,
        request,
        tableStorage,
    });

    const saveEditableFields = () => {
        if (editable && !isCreateMode && editableKeys.length > 0 && Object.keys(editableFields).length > 0) {
            saveMultiple(editableFields);
        }
    };

    const { uploadRender } = useUpload<DataSource>({
        uploadProps,
        columns,
        actionRef,
        saveEditableFields,
    });

    const defaultPagination = usePagination<DataSource>({
        id,
        pagination,
        actionRef,
        tableStorage,
        saveEditableFields,
    });

    const classNames = [className, id].filter(Boolean);
    if (className) classNames.push(className);
    if (id) classNames.push(id);

    const saveMultiple = async (editableFields: any) => {
        const fieldList = Object.entries<DataSource>(editableFields).map(([key, value]) => {
            return {
                [rowKey]: key,
                ...value,
            };
        });
        await editableProps?.onSaveMultiple?.(fieldList);
        setEditableKeys((old) =>
            old.filter((val) => !fieldList.some((field) => String(field[rowKey]) === String(val))),
        );
    };

    const ProTableComponent = editable ? EditableProTable : ProTable;

    const filterButtonComponent = hiddenFilter || !filterList.length ? null : filterButton;

    return (
        <ProTabulatorProvider>
            <ProTableComponent<DataSource, Params>
                dataSource={dataSource}
                actionRef={actionRef}
                showSorterTooltip={showSorterTooltip}
                request={async (params, sorter) => {
                    const requestParams = getRequestParams<Params>(params, sorter);
                    tableStorage.setParams(requestParams);
                    const response = await request(requestParams);
                    const { total } = response;
                    let { data } = response;
                    if (total) tableStorage.setTotal(total);
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
                    const toolBarRenders = toolBarRender !== false && toolBarRender ? toolBarRender(action, rows) : [];

                    if (
                        editable &&
                        !editableProps?.hidden?.saveMultiple &&
                        !isCreateMode &&
                        editableKeys.length > 0 &&
                        Object.keys(editableFields).length > 0
                    )
                        toolBarRenders.push(
                            <Button
                                type='primary'
                                key='saveAll'
                                onClick={async () => {
                                    const fields = await form.validateFields();
                                    await saveMultiple(fields);
                                    actionRef.current.reload();
                                }}
                                icon={<SaveOutlined />}
                            >
                                {editableProps?.saveAllText || getLocale('save')}
                            </Button>,
                        );

                    if (editable && !editableProps?.hidden?.create && !isCreateMode)
                        toolBarRenders.push(
                            <Button
                                key='create'
                                type='primary'
                                onClick={async () => {
                                    const id = await editableProps?.onCreate?.();
                                    saveEditableFields();
                                    await actionRef.current.reloadAndRest();
                                    actionRef.current.startEditable(id);
                                }}
                                icon={<PlusOutlined />}
                            >
                                {editableProps?.createText || getLocale('create')}
                            </Button>,
                        );

                    if (editable && !editableProps?.hidden?.manualCreate && !isCreateMode)
                        toolBarRenders.push(
                            <Button
                                key='manualCreate'
                                type='primary'
                                onClick={async () => {
                                    saveEditableFields();
                                    actionRef.current.addEditRecord({ id: 'CREATE' }, { position: 'top' });
                                }}
                                icon={<PlusOutlined />}
                            >
                                {editableProps?.createText || getLocale('add')}
                            </Button>,
                        );

                    toolBarRenders.push(...uploadRender);
                    toolBarRenders.push(...downloadRender);
                    return toolBarRenders;
                }}
                form={{ initialValues }}
                pagination={defaultPagination}
                bordered
                size='middle'
                toolbar={{
                    ...toolbar,
                    title: (
                        <Space>
                            {toolbar?.title}
                            {filterButtonComponent}
                        </Space>
                    ),
                }}
                editable={
                    editable
                        ? {
                              type: 'multiple',
                              editableKeys,
                              onSave: async (rowRecord, data) => {
                                  if (rowRecord === 'CREATE') {
                                      delete data[rowKey];
                                      await editableProps?.onManualCreate?.(data);
                                  } else {
                                      await editableProps?.onSave?.(data);
                                  }
                                  actionRef.current.reload();
                              },
                              actionRender: (row, config, dom) => [
                                  <div className='pro-tabulator-edit-actions' key='actions'>
                                      {dom.save}
                                      {dom.cancel}
                                  </div>,
                              ],
                              form,
                              onChange: setEditableKeys,
                              saveText: <SaveOutlined />,
                              cancelText: <RollbackOutlined />,
                          }
                        : undefined
                }
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
                rowSelection={
                    (editable && !editableProps?.hidden?.deleteMultiple) ||
                    (rowSelection != false && rowSelection != undefined)
                        ? {
                              //   alwaysShowAlert: false,
                              selectedRowKeys: selectedKeys,
                              onChange: setSelectedKeys,
                              ...rowSelection,
                          }
                        : rowSelection
                }
                tableAlertRender={(props) => {
                    const renders: React.ReactNode[] = [
                        <div className='pro-table-alert-info-text' key='alert'>
                            {getAlertMessage(props.selectedRowKeys.length)}
                        </div>,
                    ];

                    if (tableAlertRender) renders.push(tableAlertRender(props));

                    return <Space align='start'>{renders}</Space>;
                }}
                tableAlertOptionRender={(props) => {
                    const renders: React.ReactNode[] = [];
                    if (editable && !isCreateMode && !editableProps?.hidden?.deleteMultiple)
                        renders.push(
                            <Popconfirm
                                key='delete'
                                title={getLocale('areYouSure')}
                                onConfirm={async () => {
                                    await editableProps?.onDeleteMultiple?.(props.selectedRowKeys);
                                    actionRef.current.reloadAndRest();
                                    actionRef.current.clearSelected();
                                }}
                            >
                                <Button size='small' type='link' danger icon={<DeleteOutlined />}>
                                    {getLocale('delete')}
                                </Button>
                            </Popconfirm>,
                        );

                    if (
                        editable &&
                        !isCreateMode &&
                        !editableProps?.hidden?.saveMultiple &&
                        props.selectedRowKeys.some((x) => !editableKeys.includes(x))
                    )
                        renders.push(
                            <Button
                                size='small'
                                key='edit'
                                type='link'
                                icon={<EditOutlined />}
                                onClick={() => {
                                    setEditableKeys((old) => {
                                        return old.concat(props.selectedRowKeys);
                                    });
                                }}
                            >
                                {getLocale('edit')}
                            </Button>,
                        );

                    if (
                        editable &&
                        !isCreateMode &&
                        !editableProps?.hidden?.saveMultiple &&
                        props.selectedRowKeys.some((x) => editableKeys.includes(x))
                    )
                        renders.push(
                            <Button
                                size='small'
                                key='cancel'
                                type='link'
                                icon={<RollbackOutlined />}
                                onClick={() => {
                                    setEditableKeys((old) => {
                                        return old.filter((val) => !props.selectedRowKeys.includes(val));
                                    });
                                    props.onCleanSelected();
                                }}
                            >
                                {getLocale('cancelEdit')}
                            </Button>,
                        );

                    if (
                        editable &&
                        !isCreateMode &&
                        !editableProps?.hidden?.saveMultiple &&
                        props.selectedRowKeys.some((x) => editableKeys.includes(x))
                    )
                        renders.push(
                            <Button
                                size='small'
                                key='save'
                                type='link'
                                icon={<SaveOutlined />}
                                onClick={async () => {
                                    const fields = await form.validateFields(props.selectedRowKeys);
                                    await saveMultiple(fields);
                                    actionRef.current.reload();
                                    props.onCleanSelected();
                                }}
                            >
                                {getLocale('saveChoised')}
                            </Button>,
                        );

                    if (tableAlertOptionRender) renders.push(tableAlertOptionRender(props));

                    renders.push(
                        <Button
                            size='small'
                            key='clear'
                            type='link'
                            onClick={() => {
                                props.onCleanSelected();
                            }}
                        >
                            {getLocale('clear')}
                        </Button>,
                    );

                    return (
                        <Space className='pro-table-alert-option-space' align='start'>
                            {renders}
                        </Space>
                    );
                }}
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
        </ProTabulatorProvider>
    );
};

export default ProTabulator;
