export const CUISINE_TYPES = [
    { value: 1, label: "Meat" },
    { value: 2, label: "Seafood" },
    { value: 3, label: "Vegetarian" },
    { value: 4, label: "Family-style" },
    { value: 5, label: "Set meals" },
    { value: 6, label: "Hotpot" },
];

const renderCuisineTypes = ({ form, toggleArrayValue }) => (
    <div className="section">
        <h3>🍽 Cuisine Types</h3>

        <div className="tag-group">
            {CUISINE_TYPES.map(opt => (
                <button
                    key={opt.value}
                    type="button"
                    className={`tag ${
                        form.cuisine_types?.includes(opt.value) ? "active" : ""
                    }`}
                    onClick={() =>
                        toggleArrayValue("cuisine_types", opt.value)
                    }
                >
                    {opt.label}
                </button>
            ))}
        </div>
    </div>
);




const renderHotelType = ({ form, handleChange }) => (
    <div className="section">
        <h3>🏨 Hotel Type</h3>

        <select
            value={form.hotel_type || 1}
            onChange={(e) =>
                handleChange("hotel_type", Number(e.target.value))
            }
        >
            <option value={1}>Hotel</option>
            <option value={2}>Motel</option>
            <option value={3}>Homestay</option>
            <option value={4}>Resort</option>
            <option value={5}>Villa</option>
        </select>
    </div>
);




export const TAGS = [
    { value: 1, label: "Relax" },
    { value: 2, label: "Adventure" },
    { value: 3, label: "Food tour" },
    { value: 4, label: "Cultural" },
    { value: 5, label: "Playground" },
    { value: 6, label: "History" },
    { value: 7, label: "Thrill" },
    { value: 8, label: "Beach" },
    { value: 9, label: "Take picture" },
];

const renderTags = ({ form, toggleArrayValue }) => (
    <div className="section">
        <h3>🎡 Tags</h3>

        <div className="tag-group">
            {TAGS.map(opt => (
                <button
                    key={opt.value}
                    type="button"
                    className={`tag ${
                        form.tags?.includes(opt.value) ? "active" : ""
                    }`}
                    onClick={() => toggleArrayValue("tags", opt.value)}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    </div>
);




const FIELD_RENDERERS = {
    RESTAURANT: renderCuisineTypes,
    ACCOMMODATION: renderHotelType,
    ENTERTAINMENT: renderTags,
};

export const renderFieldsByType = (type, props) => {
    const renderer = FIELD_RENDERERS[type];
    return renderer ? renderer(props) : null;
};
