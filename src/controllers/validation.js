

//Value Validation
const isValid = function(value){
    if(typeof value ==='undefined' || value ===null )  return false
    if(typeof value != 'string' || value.trim().length ===0)return false
    return true
}

//Title Validation
const isValidTitle =function(title){
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}


//Name Validation
const isValidName =function(name){
    const  nameRegex =/^[a-zA-Z ]{2,30}$/         ///^[a-zA-Z0-9@$!%*#?&]{8,15}$/
    return nameRegex.test(name)
}

const isValidMobile = function(mobile){
    const mobileRegex = /^[0]?[6789]\d{9}$/
    return mobileRegex.test(mobile)
}

//Email Validation
const isValidEmail = function(email){
    const emailRegex = /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/
    return emailRegex.test(email)
}

//Password Validation
const isValidPassword = function(password){
    const passRegex = /^[a-zA-Z0-9@$!%*#?&]{8,15}$/
    ///^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/
    return passRegex.test(password)
}

const isValidDate= function(date){
    const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/
    return dateRegex.test(date)
}
 
const isValidISBN = function(isbn){
    const isbnRegex = /^(?:ISBN(?:-1[03])?:?\ )?(?=[0-9X]{10}$|(?=(?:[0-9]+[-\ ]){3})[-\ 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[-\ ]){4})[-\ 0-9]{17}$)(?:97[89][-\ ]?)?[0-9]{1,5}[-\ ]?[0-9]+[-\ ]?[0-9]+[-\ ]?[0-9X]$/        
    return isbnRegex.test(isbn)
}
const isValidTitleName = function(title){
    const titleRegex = /^[A-Za-z0-9 ]{2,}$/         
    return titleRegex.test(title)
}


module.exports = { isValid,isValidTitle,isValidName,isValidMobile,isValidEmail,isValidPassword,isValidDate,isValidISBN ,isValidTitleName}