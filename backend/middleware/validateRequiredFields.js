export function validateRequiredFields(requiredFields) {
    return (req, res, next) => {
        const missing = requiredFields.filter(field => !(field in req.body));
        if (missing.length) {
            return res.status(400).json({ error: `Faltan campos requeridos: ${missing.join(', ')}` });
        }
        next();
    };
}