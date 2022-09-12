import { DateRangeSearch } from '../types';
import { FilterProps } from './TitleFilter';
declare type DateRangeFilterProps = Omit<DateRangeSearch, 'type'> & FilterProps;
declare const DateRangeFilter: ({ title, onChange, getValue, beforeName, afterName, name, updateOnChange, getPrefixCls, }: DateRangeFilterProps) => JSX.Element;
export default DateRangeFilter;
