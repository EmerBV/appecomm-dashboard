import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';
import Loading from './Loading';

const Table = ({
  columns,
  data,
  isLoading,
  emptyMessage = 'No data to display',
  onRowClick,
  selectable,
  selectedRows,
  onSelectRow,
  className,
}) => {
  const handleRowClick = (item, index) => {
    if (onRowClick) {
      onRowClick(item, index);
    }
  };

  const handleRowSelect = (e, item, index) => {
    e.stopPropagation();
    if (onSelectRow) {
      onSelectRow(item, index);
    }
  };

  const isRowSelected = (item) => {
    if (!selectedRows) return false;
    return selectedRows.some((row) => row.id === item.id);
  };

  return (
    <div className={twMerge("overflow-x-auto", className)}>
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {selectable && (
              <th scope="col" className="w-10 px-3 py-3.5">
                <span className="sr-only">Select</span>
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={twMerge(
                  "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
                  column.className
                )}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {isLoading ? (
            <tr>
              <td
                colSpan={selectable ? columns.length + 1 : columns.length}
                className="py-10 text-center"
              >
                <div className="flex justify-center">
                  <Loading size="md" />
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={selectable ? columns.length + 1 : columns.length}
                className="py-10 text-center text-sm text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={item.id || index}
                className={twMerge(
                  onRowClick ? "cursor-pointer hover:bg-gray-50" : "",
                  isRowSelected(item) ? "bg-primary-50" : ""
                )}
                onClick={() => handleRowClick(item, index)}
              >
                {selectable && (
                  <td className="w-10 px-3 py-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={isRowSelected(item)}
                      onChange={(e) => handleRowSelect(e, item, index)}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={`${item.id || index}-${column.key}`}
                    className={twMerge(
                      "whitespace-nowrap px-3 py-4 text-sm text-gray-900",
                      column.cellClassName
                    )}
                  >
                    {column.render
                      ? column.render(item, index)
                      : item[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.node.isRequired,
      render: PropTypes.func,
      className: PropTypes.string,
      cellClassName: PropTypes.string,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  emptyMessage: PropTypes.node,
  onRowClick: PropTypes.func,
  selectable: PropTypes.bool,
  selectedRows: PropTypes.array,
  onSelectRow: PropTypes.func,
  className: PropTypes.string,
};

export default Table;