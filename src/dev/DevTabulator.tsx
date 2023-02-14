import dayjs from 'dayjs';
import React from 'react';
import ProTabulator, {
    ProTabulatorRequestParams,
    // ProTabulatorSelectOptionType
} from '../ProTabulator';

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

const typeOptions = [
    { label: 'Первый', value: 'first' },
    { label: 'Второй', value: 'second' },
];

// const getType = (): Promise<ProTabulatorSelectOptionType[]> =>
//     new Promise((resolve, reject) => {
//         const error = false;
//         setTimeout(() => resolve(typeOptions), 1000);
//         if (error) reject();
//     });

const getData = async (
    params: ProTabulatorRequestParams<DevDataFilter>,
): Promise<{ data: DevData[]; total: number; success: boolean }> => {
    let data = mockData;
    if (params.name !== undefined) {
        data = data.filter((item) => (params.name !== undefined ? item.name.includes(params.name) : true));
    }
    if (params.dateAfter !== undefined) {
        data = data.filter((item) => dayjs(item.date).isBefore(dayjs(params.dateAfter)));
    }
    if (params.dateBefore !== undefined) {
        data = data.filter((item) => dayjs(item.date).isAfter(dayjs(params.dateBefore)));
    }
    if (params.type && params.type.length > 0) {
        data = data.filter((item) => params.type?.includes(item.type));
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
        <div style={{ height: 500 }}>
            <ProTabulator
                // dataSource={mockData}
                request={getData}
                // hiddenFilter
                ordered
                columns={[
                    {
                        dataIndex: 'name',
                        title: 'Наименование',
                        valueType: 'text',
                        filterMode: 'fixed',
                        width: 200,
                    },
                    {
                        dataIndex: 'type',
                        title: 'Тип номер',
                        valueType: 'select',
                        // filterMode: 'hidden',
                        // request: getType,
                        options: typeOptions,
                        filterProps: {
                            multiple: true,
                        },
                    },
                    {
                        dataIndex: 'date',
                        title: 'Дата номер',
                        valueType: 'date',
                    },
                ]}
            />
        </div>
    );
};

export default DevTabulator;
