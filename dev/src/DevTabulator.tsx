import moment from 'moment';
import React from 'react';
import ProTabulator from '../../src/ProTabulator';
// import ProTabulator from '../ProTabulator';
import { AxiosParamsType, OptionType } from '../../src/types';

type DevDataType = 'first' | 'second';

type DevData = {
    name: string;
    date: string;
    description?: string;
    type: DevDataType;
};

type DevDataFilter = {
    name?: string;
    dateBefore?: string;
    dateAfter?: string;
    type: DevDataType[];
};

const mockData: DevData[] = [
    {
        name: 'asd',
        date: '2014-08-01T15:30',
        description: 'Lorem ipsum dolor sit amet, consectetur adip',
        type: 'second',
    },
    { name: 'fgh', date: '2014-08-01T15:30', type: 'second' },
    { name: 'fgh', date: '2015-08-01T15:30', type: 'first' },
    { name: 'fgh', date: '2016-08-01T15:30', type: 'second' },
    { name: 'fgh', date: '2014-08-01T15:30', type: 'second' },
    { name: 'asd', date: '2017-08-01T15:30', type: 'first' },
    { name: 'afg', date: '2017-08-01T15:30', type: 'second' },
    { name: 'fgh', date: '2018-08-01T15:30', type: 'first' },
    { name: 'fgh', date: '2018-08-01T15:30', type: 'second' },
    { name: 'fgh', date: '2014-08-01T15:30', type: 'second' },
    { name: 'fgh', date: '2019-08-01T15:30', type: 'first' },
    { name: 'fgh', date: '2014-08-01T15:30', type: 'second' },
    { name: 'fgh', date: '2045-08-01T15:30', type: 'second' },
];

const getType = (): Promise<OptionType<DevDataType>[]> =>
    new Promise((resolve, reject) => {
        const error = true;
        setTimeout(
            () =>
                resolve([
                    { label: 'Первый', value: 'first' },
                    { label: 'Второй', value: 'second' },
                ]),
            1000,
        );
        if (error) reject();
    });

const getData = async (
    params: AxiosParamsType<DevDataFilter>,
): Promise<{ data: DevData[]; total: number; success: boolean }> => {
    let data = mockData;
    if (params.name !== undefined) {
        data = data.filter((item) => (params.name !== undefined ? item.name.includes(params.name) : true));
    }
    if (params.dateAfter !== undefined) {
        data = data.filter((item) => moment(item.date).isBefore(moment(params.dateAfter)));
    }
    if (params.dateBefore !== undefined) {
        data = data.filter((item) => moment(item.date).isAfter(moment(params.dateBefore)));
    }
    if (params.type && params.type.length > 0) {
        data = data.filter((item) => params.type.includes(item.type));
    }

    console.log('request', JSON.parse(JSON.stringify(params)));

    return new Promise((resolve, reject) => {
        const error = false;
        setTimeout(() => resolve({ data, success: true, total: data.length }), 1000);
        if (error) reject();
    });
};

const DevTabulator = () => {
    return (
        <div style={{ padding: '20px 50px', height: '100vh' }}>
            <ProTabulator<DevData, DevDataFilter>
                tabulatorID='DEV'
                numbered
                persistenceType='sessionStorage'
                request={getData}
                // params={{
                //     type: ['first'],
                // }}
                columns={(getCol) => [
                    getCol(
                        'name',
                        'Наименование',
                        // { type: 'text', updateOnChange: false },
                        false,
                        { width: '200px', sorter: true },
                    ),
                    getCol(
                        'date',
                        'Дата',
                        // { type: 'dateRange', updateOnChange: true },
                        false,
                        { width: '500px' },
                    ),
                    getCol(
                        'description',
                        'Описание',
                        // { type: 'text' },
                        false,
                        { width: '100px' },
                    ),
                    getCol(
                        'type',
                        'Тип',
                        // {
                        //     type: 'select',
                        //     request: getType,
                        //     persistenceKey: 'type',
                        //     renderOption: true,
                        //     multiple: true,
                        // },
                        false,
                        { width: '200px', sorter: true },
                    ),
                ]}
                rowKey='numberedIndex'
            />
        </div>
    );
};

export default DevTabulator;
