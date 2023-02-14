import dayjs from 'dayjs';
import { ProTabulatorColumn } from '../types';

const getInitialValues = <DataSource extends Record<string, any>>(
    columns: ProTabulatorColumn<DataSource>[],
    formValues: {
        [key: string]: any;
    },
) => {
    Object.keys(formValues).forEach((key) => {
        if (key.includes('Before') || key.includes('After')) {
            const column = columns.find((col) => key.includes(col.dataIndex as string));
            if (column) {
                formValues[column.dataIndex as string] = [
                    formValues[column.dataIndex + 'Before'] ? dayjs(formValues[column.dataIndex + 'Before']) : null,
                    formValues[column.dataIndex + 'After'] ? dayjs(formValues[column.dataIndex + 'After']) : null,
                ];
            }
        }
    });
    return formValues;
};

export default getInitialValues;
