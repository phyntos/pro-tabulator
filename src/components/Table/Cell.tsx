import clsx from 'clsx';
import React from 'react';
import { TableColumnType } from '../../types/table';

type CellProps = { column: TableColumnType<any> };

const Cell: React.FC<CellProps> = ({ children, column }) => {
    return (
        <td className={clsx('border p-3 relative')} style={{ maxWidth: column.width, minWidth: 84 }}>
            <div className='overflow-hidden text-ellipsis whitespace-nowrap'>{children}</div>
        </td>
    );
};

export default Cell;
