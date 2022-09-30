import React from 'react';
import PageButton from './PageButton';

type PageProps = { setCurrent: (value: number) => void; page: number; current: number };

const Page = ({ setCurrent, page, current }: PageProps) => {
    return (
        <PageButton onClick={() => setCurrent(page)} active={page === current}>
            {page}
        </PageButton>
    );
};

export default Page;
