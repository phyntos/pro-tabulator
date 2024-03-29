import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import { Dropdown, Spin, Tooltip } from 'antd';
import { Excel } from 'antd-table-saveas-excel';
import { IExcelColumn } from 'antd-table-saveas-excel/app';
import dayjs from 'dayjs';
import FileSaver from 'file-saver';
import React, { useCallback, useState } from 'react';
import getOrderedData from '../services/getOrderedData';
import TableStorage from '../services/TableStorage';
import {
    DownloadColumn,
    ProTabulatorColumn,
    ProTabulatorDataSource,
    ProTabulatorProps,
    ProTabulatorRequestParams,
} from '../types';
import useLocale from './useLocale';

const xlsxExtentsion = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

type TableDownloadHookArgs<
    DataSource extends Record<string, any>,
    Params extends Record<string, any> = Record<string, any>,
> = Pick<
    ProTabulatorProps<DataSource, Params>,
    'columns' | 'downloadProps' | 'id' | 'actionRef' | 'request' | 'ordered' | 'dataSource'
> & {
    tableStorage: TableStorage<Params>;
};

const excelTextRender =
    <DataSource,>(excelRender?: (text: string, record: DataSource, index: number) => string | object) =>
    (text: string, record: DataSource, index: number) => {
        let renderedText: string | object = text;
        if (excelRender) {
            const excelText = excelRender(text, record, index);
            if (excelText) return excelText;
            renderedText = excelText;
        }
        if (typeof renderedText !== 'undefined' && renderedText !== '' && renderedText !== null) {
            return renderedText;
        }
        return '-';
    };

const getExcelMapColumns = <DataSource extends Record<string, any>>(
    columns: ProTabulatorColumn<ProTabulatorDataSource<DataSource>>[],
) => {
    return columns
        .filter(
            (column) =>
                typeof column.title !== 'undefined' &&
                typeof column.dataIndex !== 'undefined' &&
                (typeof column.showInExcel !== 'undefined' ? column.showInExcel : !column.hideInTable),
        )
        .map((column) => ({
            title: column.excelTitle || column.title,
            dataIndex: String(column.dataIndex),
            key: String(column.dataIndex),
            width: Number(column.width) * 1.5,
            excelRender: (text: string, record: DataSource, index: number) => {
                if ((column.valueType === 'date' || column.valueType === 'dateApartRange') && text) {
                    return dayjs(text).format('DD.MM.YYYY HH:mm');
                }
                return excelTextRender(column.excelRender)(text, record, index);
            },
        }));
};

export const downloadExcelDataSource = <DataSource extends Record<string, any>>({
    dataSource,
    excelColumns,
    sheetName,
    fileName,
}: {
    dataSource: DataSource[];
    excelColumns: DownloadColumn[];
    sheetName?: string;
    fileName?: string;
}) => {
    const excel = new Excel();

    const columns = excelColumns.map((column) => ({
        ...column,
        excelRender: excelTextRender(column.excelRender),
    }));

    excel
        .addSheet(sheetName)
        .setTBodyStyle({
            fontName: 'Times New Roman',
            fontSize: 11,
            background: 'FFDBE5F1',
            color: 'FF000000',
            border: true,
        })
        .setTHeadStyle({
            fontName: 'Times New Roman',
            fontSize: 11,
            background: 'FF4F81BD',
            color: 'FF000000',
            border: true,
        })
        .addColumns(columns)
        .addDataSource(dataSource, {
            str2Percent: true,
        })
        .file.saveAs('base64', true)
        .then((base64: string) => {
            FileSaver.saveAs(`data:${xlsxExtentsion};base64,${base64}`, fileName + '.xlsx');
        });
};

const useDownload = <DataSource extends Record<string, any>, Params extends Record<string, any> = Record<string, any>>({
    downloadProps,
    columns,
    actionRef,
    request,
    id,
    ordered,
    tableStorage,
}: TableDownloadHookArgs<DataSource, Params>) => {
    const [loading, setLoading] = useState(false);

    const pageInfo = actionRef?.current?.pageInfo;
    const getLocale = useLocale();

    const getExcelColumns = useCallback(() => getExcelMapColumns(columns), [columns]);

    const downloadDataSource = (
        dataSource: DataSource[],
        fileNameAddon: string,
        excelColumns?: IExcelColumn[],
        excelFileName?: string,
    ) => {
        const columns =
            !excelColumns || excelColumns.length === 0
                ? getExcelColumns()
                : excelColumns.map((column) => ({
                      ...column,
                      excelRender: excelTextRender(column.excelRender),
                  }));

        const fileName = excelFileName || downloadProps?.fileName || 'Excel';

        downloadExcelDataSource({
            dataSource,
            excelColumns: columns,
            fileName,
            sheetName: getLocale('sheet'),
        });
    };

    const downloadAll = async (fileNameAddon: string, excelColumns?: IExcelColumn[], fileName?: string) => {
        setLoading(true);
        const axiosParams = tableStorage.params;

        axiosParams.pageSize = tableStorage.total;
        axiosParams.current = 1;

        await downloadByParams(fileNameAddon, axiosParams, excelColumns, fileName);
    };

    const downloadCurrent = async (fileNameAddon: string, excelColumns?: IExcelColumn[], fileName?: string) => {
        setLoading(true);
        const axiosParams = tableStorage.params;
        await downloadByParams(fileNameAddon, axiosParams, excelColumns, fileName);
    };

    const downloadByParams = async (
        fileNameAddon: string,
        params: ProTabulatorRequestParams<Params>,
        excelColumns?: IExcelColumn[],
        fileName?: string,
    ) => {
        setLoading(true);
        if (!params.pageSize) params.pageSize = tableStorage.total;
        try {
            if (!request) {
                return;
            }
            const { data } = await request(params);
            const orderedData = (ordered ? getOrderedData(data, params.current, params.pageSize) : data) || [];
            downloadDataSource(orderedData, fileNameAddon, excelColumns, fileName);
        } catch (err) {
            // showNotificationError(err);
        } finally {
            setLoading(false);
        }
    };

    const extraMenu = (downloadProps?.extra || []).map((el) => ({
        label: getLocale('download') + ' ' + el.name,
        key: el.name,
        onClick: () =>
            el.params
                ? downloadByParams(el.name, el.params, el.excelColumns, el.fileName)
                : downloadAll(el.name, el.excelColumns, el.fileName),
    }));

    const downloadDropdown = (
        <Dropdown
            key='download'
            menu={{
                items: [
                    {
                        label: <span>{getLocale('downloadPage')}</span>,
                        key: 'downloadPage',
                        onClick: () =>
                            downloadCurrent(pageInfo?.current + ' ' + getLocale('page'), downloadProps?.excelColumns),
                    },
                    {
                        label: <span>{getLocale('downloadAll')}</span>,
                        key: 'downloadAll',
                        onClick: () => downloadAll(getLocale('all'), downloadProps?.excelColumns),
                    },
                    ...extraMenu,
                ],
            }}
            trigger={['click']}
        >
            <Tooltip title={getLocale('download')}>
                <div className='pro-tabulator-pro-table-list-toolbar-setting-item'>
                    <span>
                        {loading ? (
                            <Spin spinning indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />} />
                        ) : (
                            <DownloadOutlined className='icon-button' />
                        )}
                    </span>
                </div>
            </Tooltip>
        </Dropdown>
    );

    if (typeof downloadProps === 'undefined' || !id)
        return {
            downloadRender: [],
        };

    return {
        downloadRender: [downloadDropdown],
    };
};

export default useDownload;
