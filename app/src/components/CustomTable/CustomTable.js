import React, { Fragment } from 'react';
import {
    useTable,
    useSortBy,
    useFilters,
    useExpanded,
    usePagination,
} from 'react-table';
import { Table, Row, Col, Button } from 'reactstrap';
import { Filter, DefaultColumnFilter } from './filters';

const CustomTable = ({ columns, data }) => {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        visibleColumns,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            defaultColumn: { Filter: DefaultColumnFilter },
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useFilters,
        useSortBy,
        useExpanded,
        usePagination
    );



    const generateSortingIndicator = (column) => {
        return column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : '';
    };

    const onChangeInSelect = (event) => {
        setPageSize(Number(event.target.value));
    };

    const onChangeInInput = (event) => {
        const page = event.target.value ? Number(event.target.value) - 1 : 0;
        gotoPage(page);
    };

    return (
        <Fragment>
            <Table bordered hover {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>
                                    <div {...column.getSortByToggleProps()}>
                                        {column.render('Header')}
                                        {generateSortingIndicator(column)}
                                    </div>
                                    <Filter column={column} />
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                    prepareRow(row);
                    return (
                    <Fragment key={row.getRowProps().key}>
                        <tr>
                        {row.cells.map((cell) => {
                            return (
                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            );
                        })}
                        </tr>
                    </Fragment>
                    );
                })}
                </tbody>
            </Table>

            <Row style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center', justifyContent: 'space-between' }}>
                <Col md={3}>
                    <Button
                        color='primary'
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                        className="me-2"
                    >
                        {'<<'}
                    </Button>
                    <Button
                        color='primary'
                        onClick={previousPage}
                        disabled={!canPreviousPage}
                    >
                        {'<'}
                    </Button>
                </Col>
                <Col md={2} style={{ marginTop: 7 }}>
                    Página{' '}
                    <strong>
                        {pageIndex + 1} de {pageOptions.length}
                    </strong>
                </Col>
                <Col md={3}>
                    <Button color='primary' onClick={nextPage} disabled={!canNextPage}>
                        {'>'}
                    </Button>
                    <Button
                        color='primary'
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                        className="ms-2"
                    >
                        {'>>'}
                    </Button>
                </Col>
            </Row>
        </Fragment>
    )
}

export default CustomTable;