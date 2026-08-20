// Age is never stored - it's always derived from birth_date so it
// stays correct as the birthday passes, instead of going stale.
export const calculateAge = (birthDate) => {

    if (!birthDate) {
        return null;
    }

    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();

    const hasHadBirthdayThisYear =
        today.getMonth() > birth.getMonth() ||
        (
            today.getMonth() === birth.getMonth() &&
            today.getDate() >= birth.getDate()
        );

    if (!hasHadBirthdayThisYear) {
        age--;
    }

    return age;

};

export const formatDateOnly = (value) => {

    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleDateString();

};
