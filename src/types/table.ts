import { Property } from 'csstype';

export type ColumnFilterType = 'number' | 'text';

export type TableColumnType<DataType> = {
    title: string;
    key: Extract<keyof DataType, string>;
    width?: Property.Width<string | number>;
    filter?: ColumnFilterType;
};

export type SortDirection = 'asc' | 'desc' | 'none';
export type SorterType<DataType> = {
    key?: Extract<keyof DataType, string>;
    direction: SortDirection;
};
