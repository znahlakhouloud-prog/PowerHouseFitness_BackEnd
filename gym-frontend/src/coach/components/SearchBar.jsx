import { Search } from "lucide-react";

const SearchBar = ({
    value,
    onChange,
    placeholder = "Search..."
}) => {

    return (
        <div className="coach-search">

            <Search size={17} />

            <input
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />

        </div>
    );

};

export default SearchBar;
