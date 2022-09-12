import { IObject, ProTabulatorProps } from '../types';
import './ProTabulator.less';
declare const ProTabulator: <DataType extends IObject, Params extends IObject = IObject>({ persistenceType, request, numbered, tabulatorID, columns, actionRef, defaultPageSize, primaryColor, rowKey, onRowClick, rowClassName, }: ProTabulatorProps<DataType, Params>) => JSX.Element;
export default ProTabulator;
