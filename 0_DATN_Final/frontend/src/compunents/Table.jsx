
const Table = (Props)=>{
    if (!Props.data || Props.data.length === 0) {
        return <div>Không có dữ liệu để hiển thị.</div>;
    }
    const headers = Object.keys(Props.data[0]);

    

    return(<>
        <div className="overflow-x-auto shadow-blue-950">
        {/* Container table */}
            <div className="min-w-full border border-gray-300 rounded-lg">
                {/* Header */}
                <div className="flex bg-blue-600 font-semibold">
                {headers.map((header) => (
                    <div
                    key={header}
                    className="w-[200px] p-3 border-r border-gray-300 text-white last:border-r-0 text-sm"
                    >
                    {header}
                    </div>
                ))}
                </div>

                {/* Body */}
                {Props.data.map((row, rowIndex) => (
                <div 
                 onClick={Props.handleOnClick}
                    key={rowIndex}
                    className={`flex border-t hover:bg-gray-300 hover:cursor-pointer border-gray-300 ${
                    rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`  
                    
                }
                >
                    {headers.map((header) => (
                    <div 
                        key={header}
                        className="w-[200px] p-3 border-r border-gray-300 last:border-r-0 text-sm"
                    >
                        {row[header]}
                    </div>
                    ))}
                </div>
                ))}
            </div>
        </div>
    </>)
}

export default Table