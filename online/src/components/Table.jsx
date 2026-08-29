const Table = ({
  columns = [],
  data = [],
  renderRow,
  emptyMessage = "No data found",
}) => {
  return (
    <div className="bg-white border rounded-xl overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-50 border-b">

            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left px-5 py-4 text-sm font-semibold text-gray-600 whitespace-nowrap"
                >
                  {column.label}
                </th>
              ))}
            </tr>

          </thead>

          <tbody>

            {data.length > 0 ? (
              data.map((item, index) =>
                renderRow(item, index)
              )
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-10 text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Table;