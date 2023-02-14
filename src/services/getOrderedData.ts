const getOrderedData = <DataSource>(
    data: DataSource[] | undefined,
    current = 1,
    pageSize = 10,
): (DataSource & { order: number })[] => {
    return (
        data?.map((item, index) => {
            return {
                ...item,
                order: (current - 1) * pageSize + index + 1,
            };
        }) || []
    );
};

export default getOrderedData;
