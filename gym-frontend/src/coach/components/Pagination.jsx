import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange
}) => {

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="pagination">

            <button
                className="pagination-button"
                onClick={() =>
                    onPageChange(currentPage - 1)
                }
                disabled={currentPage <= 1}
            >
                <ChevronLeft size={16} />
                Previous
            </button>

            <span className="pagination-info">
                Page {currentPage} of {totalPages}
            </span>

            <button
                className="pagination-button"
                onClick={() =>
                    onPageChange(currentPage + 1)
                }
                disabled={currentPage >= totalPages}
            >
                Next
                <ChevronRight size={16} />
            </button>

        </div>
    );

};

export default Pagination;
