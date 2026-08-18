

export const authorizeRoles =(...roles)=>{
    return (req,res,next)=>{

        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                message : "Access denied"
            });
        }
        next();


    };
};

// Allows access if the caller holds one of the given roles, OR is
// requesting their own resource (req.user.id matches the URL param).
// Used for routes keyed by a user id where a member should only ever
// reach their own data, but staff can reach anyone's.
export const authorizeOwnerOrRoles = (paramName, ...roles) => {
    return (req, res, next) => {

        const isOwner =
            String(req.user.id) === String(req.params[paramName]);

        if (!isOwner && !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        next();

    };
};