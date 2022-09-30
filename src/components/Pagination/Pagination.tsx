import {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EllipsisHorizontalIcon,
} from '@heroicons/react/20/solid';
import React from 'react';
import Select from '../Select/Select';
import Page from './Page';
import PageButton from './PageButton';

export type PaginationType = {
    pageSize: number;
    current: number;
};

type PaginationProps = {
    total: number;
    pagination: PaginationType;
    setPagination: React.Dispatch<
        React.SetStateAction<{
            pageSize: number;
            current: number;
        }>
    >;
};

const PAGE_RADIUS = 2;

const Pagination = ({ pagination: { current, pageSize }, total, setPagination }: PaginationProps) => {
    const pageCount = Math.ceil(total / pageSize);

    const pagesList: number[] = [];
    const isLeftRadius = current <= PAGE_RADIUS;
    const isRightRadius = current > pageCount - PAGE_RADIUS;
    const isMedium = PAGE_RADIUS * 2 + 5 === pageCount;
    let first = current - PAGE_RADIUS;
    let last = current + PAGE_RADIUS;
    if (isMedium) {
        first = 1;
        last = PAGE_RADIUS * 2 + 5;
    } else if (isLeftRadius) {
        first = 1;
        last = 1 + PAGE_RADIUS * 2;
    } else if (isRightRadius) {
        first = pageCount - PAGE_RADIUS * 2;
        last = pageCount;
    }
    if (first < 1) first = 1;
    if (last > pageCount) last = pageCount;
    for (let i = first; i <= last; i++) {
        pagesList.push(i);
    }

    const lastItem = current * pageSize;

    const setCurrent = (current: number) => {
        setPagination((pagination) => ({ ...pagination, current }));
    };

    return (
        <div className='w-full flex items-center justify-end gap-1 py-2'>
            <div>
                <p className='text-sm text-gray-700'>
                    Showing <span className='font-medium'>{lastItem - pageSize + 1}</span> to{' '}
                    <span className='font-medium'>{lastItem < total ? lastItem : total}</span> of{' '}
                    <span className='font-medium'>{total}</span> results
                </p>
            </div>
            <div className='flex'>
                <PageButton disabled={current === 1} icon onClick={() => setCurrent(current - 1)}>
                    <span className='sr-only'>Previous</span>
                    <ChevronLeftIcon className='w-5' aria-hidden='true' />
                </PageButton>
                {!pagesList.includes(1) && (
                    <>
                        <Page key={'page' + 1} page={1} setCurrent={setCurrent} current={current} />
                        {!pagesList.includes(2) && (
                            <PageButton icon className='text-gray-300 group' onClick={() => setCurrent(1)}>
                                <ChevronDoubleLeftIcon className='w-5 hidden group-hover:block' />
                                <EllipsisHorizontalIcon className='w-5 group-hover:hidden' />
                            </PageButton>
                        )}
                    </>
                )}
                {pagesList.map((page) => (
                    <Page key={'page' + page} page={page} setCurrent={setCurrent} current={current} />
                ))}
                {!pagesList.includes(pageCount) && (
                    <>
                        {!pagesList.includes(pageCount - 1) && (
                            <PageButton icon className='text-gray-300 group' onClick={() => setCurrent(pageCount)}>
                                <EllipsisHorizontalIcon className='w-5 group-hover:hidden' />
                                <ChevronDoubleRightIcon className='w-5 hidden group-hover:block' />
                            </PageButton>
                        )}
                        <Page key={'page' + pageCount} page={pageCount} setCurrent={setCurrent} current={current} />
                    </>
                )}
                <PageButton disabled={current === pageCount} icon onClick={() => setCurrent(current + 1)}>
                    <ChevronRightIcon className='w-5' />
                </PageButton>
            </div>
            <Select
                options={[
                    { label: '10', value: 10 },
                    { label: '15', value: 15 },
                    { label: '20', value: 20 },
                    { label: '50', value: 50 },
                    { label: '100', value: 100 },
                ]}
                value={pageSize}
                setValue={(pageSize) => {
                    setPagination((pagination) => ({
                        ...pagination,
                        pageSize: Number(pageSize),
                        current: 1,
                    }));
                }}
            />
        </div>
    );
};

export default Pagination;
