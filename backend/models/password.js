const passwordValidator = require('password-validator');
//Schema pour valider le mot de passe
const passwordSchema = new passwordValidator();
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                // Must have at least  digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

module.exports = passwordSchema;
// vérifie que le mot de passe valide le schema décrit

module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
    } else {
        return res.status(400).json({error : " Le mot de passe doit contenir :"+ passwordSchema.validate(req.body.password, {list:true})})
           }
};



