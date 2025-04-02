import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const Table = (Props) => {
    if (!Props.data || Props.data.length === 0) {
        return (
            <div className="p-6 text-center text-gray-500 text-lg">
                Không có dữ liệu để hiển thị.
            </div>
        );
    }

    const headers = Object.keys(Props.data[0]);

    return (
        <div className="overflow-x-auto">
            <div className="min-w-full bg-white rounded-xl shadow-xl border border-gray-200">
                {/* Header */}
                <div className="flex bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold rounded-t-xl">
                    {headers.map((header) => (
                        <div
                            key={header}
                            className="w-[200px] flex-1 p-4 border-r border-blue-400 last:border-r-0"
                        >
                            {header}
                        </div>
                    ))}
                    <div className="w-[200px] p-4">Hành động</div>
                </div>

                {/* Body */}
                {Props.data.map((row, rowIndex) => {
                    const id = row[Props.idKey];

                    return (
                        <div
                            key={rowIndex}
                            className={`flex border-t border-gray-200 transition-all duration-200 hover:bg-blue-50 ${
                                rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                        >
                            {headers.map((header) => (
                                <div
                                    key={header}
                                    className="w-[200px] flex-1 p-4 text-sm text-gray-700 border-r border-gray-100 last:border-r-0"
                                >
                                    {row[header]}
                                </div>
                            ))}

                            {/* Hành động */}
                            <div className="w-[200px] p-4 flex items-center space-x-2">
                                <button
                                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-md shadow-sm transition"
                                    onClick={() => Props.handleEdit(id)}
                                >
                                    <FaEdit className="text-sm" />
                                    <span>Sửa</span>
                                </button>
                                <button
                                    className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-md shadow-sm transition"
                                    onClick={() => Props.handleDelete(id)}
                                >
                                    <FaTrashAlt className="text-sm" />
                                    <span>Xóa</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Table;
