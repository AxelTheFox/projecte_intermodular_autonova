export const requireAdmin = (req, res, next) => {
    if (!req.session || !req.session.isAdmin) {
        return res.status(401).json({
            message: "Accés no autoritzat. Inicia sessió com a administrador."
        });
    }
    next();
};
