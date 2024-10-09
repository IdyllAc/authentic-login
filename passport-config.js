const LocalStrategy = require('passport-local').Strategy
const bcrypt =require('bcrypt')

function initialize(passport, getUserByEmail, getUserById) {
    // Function to authenticate users
    const authenticateUser = async (email, password, done) => {
        // Get users by email
        const user = getUserByEmail(email)
        if (user == null) {
            return done(null, false, {message: '!لا يوجد إيميل لهذا المستخدم' })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: '!الإيميل او كلمة المرور غير صحيحة' })
            }
        } catch (e) {
            return done(e)
     }

}
     passport.use(new LocalStrategy({ usernameField: 'email' },
     authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))  
    passport.deserializeUser((id, done) => {                       
       return done(null, getUserById(id))
})
}
module.exports = initialize




