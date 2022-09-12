import { SelectSearch } from '../types';
import { FilterProps } from './TitleFilter';
declare type SelectFieldProps = FilterProps & Omit<SelectSearch, 'type'>;
declare const SelectField: ({ getValue, name, onChange, options, error, title, multiple, getPrefixCls, }: SelectFieldProps) => JSX.Element;
export default SelectField;
