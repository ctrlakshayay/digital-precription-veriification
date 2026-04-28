const DataTable = ({ columns, data }) => (
  <div className="overflow-x-auto rounded-xl border bg-white">
    <table className="min-w-full text-sm">
      <thead className="bg-slate-100 text-left">
        <tr>
          {columns.map((col) => (
            <th key={col.key} className="px-4 py-2 font-semibold text-slate-700">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="border-t">
            {columns.map((col) => (
              <td key={col.key} className="px-4 py-2 text-slate-600">
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DataTable;
