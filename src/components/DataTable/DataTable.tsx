import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

const DataTable = ({ data, columns }: any) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="w-full">
            <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="border-b bg-muted/50">
                                {headerGroup.headers.map(header => (
                                    <th 
                                        key={header.id} 
                                        className="h-8 px-3 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr 
                                key={row.id} 
                                className="border-b transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted"
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td 
                                        key={cell.id} 
                                        className="p-2 align-middle [&:has([role=checkbox])]:pr-0"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DataTable