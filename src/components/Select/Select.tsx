import { ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import React, { useContext, useRef, useState } from 'react';
import ColorContext from '../../contexts/ColorContext';

type SelectProps = {
    options: { label: string; value: string | number }[];
    value: string | number;
    setValue(value: string | number): void;
};

const Select = ({ value, options, setValue }: SelectProps) => {
    const [open, setOpen] = useState(false);
    const color = useContext(ColorContext);
    const ref = useRef<HTMLDivElement>();

    const isExist = options.some((option) => option.value === value);
    if (!isExist) {
        options.unshift({
            label: String(value),
            value,
        });
    }

    return (
        <div
            ref={ref}
            tabIndex={0}
            onFocus={() => {
                setOpen(true);
            }}
            onBlur={() => {
                setOpen(false);
            }}
            className={clsx(
                'relative flex justify-between pl-2 pr-0.5',
                'text-sm text-gray-800 border border-gray-300 rounded-sm',
                color === 'indigo' && 'hover:border-indigo-400 focus:border-indigo-400 focus:shadow-indigo-500/50',
                color === 'blue' && 'hover:border-blue-400 focus:border-blue-400 focus:shadow-blue-500/50',
                'group cursor-pointer focus:shadow hover:transition-all',
            )}
        >
            {value}
            <ChevronDownIcon
                className={clsx(
                    'w-4 text-gray-300',
                    color === 'indigo' && 'group-hover:text-indigo-500 group-focus:text-indigo-500',
                    color === 'blue' && 'group-hover:text-blue-500 group-focus:text-blue-500',
                )}
            />
            <div
                className={clsx(
                    open ? 'visible' : 'invisible',
                    'absolute',
                    'top-6',
                    'z-10',
                    'bg-white',
                    'w-full',
                    'left-0',
                    'shadow-md',
                    'transition-visibility',
                )}
            >
                {options.map((option) => {
                    const selected = option.value === value;
                    return (
                        <div
                            className={clsx(
                                selected && [
                                    color === 'indigo' && 'bg-indigo-100',
                                    color === 'blue' && 'bg-blue-100',
                                    'font-medium',
                                ],
                                !selected && [
                                    color === 'indigo' && 'hover:bg-indigo-50',
                                    color === 'blue' && 'hover:bg-blue-50',
                                ],
                                'px-1',
                                'py-0.5',
                            )}
                            key={option.value}
                            onClick={() => {
                                setValue(option.value);
                                ref.current.blur();
                            }}
                        >
                            {option.label}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Select;
