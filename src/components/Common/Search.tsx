import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';

type SearchProps = {
    value: string;
    onChange: (value: string) => void;
};

const Search = ({ onChange, value: initial }: SearchProps) => {
    const [value, setValue] = useState(initial);
    const ref = useRef<HTMLInputElement>();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) ref.current.focus();
    }, [open]);

    return (
        <div className='flex items-center'>
            <input
                ref={ref}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                type='text'
                className={clsx('w-full outline-none bg-transparent font-normal', open ? 'block' : 'hidden')}
            />
            <MagnifyingGlassIcon
                onClick={() => {
                    if (!open) setOpen(true);
                    else onChange(value);
                }}
                className='w-4 text-gray-300 hover:text-gray-400 cursor-pointer'
            />
        </div>
    );
};

export default Search;
