function EquipmentStatusBadge({ status }) {

    return (
        <span className={`status-badge status-${status}`}>
            {status}
        </span>
    );

}

export default EquipmentStatusBadge;
