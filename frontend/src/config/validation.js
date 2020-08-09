const MIMETypes = {
    "image/bmp":true,
    "image/x-bmp":true,
    "image/x-xbitmap":true,
    "image/gif":true,
    "image/jpeg":true,
    "image/jpg":true,
    "image/jpe":true,
    "image/png":true,
};

const checkPictureFile = file => {    
    if(!file.target.files[0]){
        return [false,"Upload image file"];
    }
    const type = file.target.files[0].type;
    const size = file.target.files[0].size;
    if(MIMETypes[type] && size<4000000){
        return [true,""];
    }else{
        return MIMETypes[type] ? [false,"Only files with max. 4MB"] : [false,"File type not supported"];
    }
};

const checkEmail = email => {
    if(email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)){
        return [true,""];
    }else{
        return [false,"No valid email"];
    }
};

const checkName = name => {
    if(name.match(/^([A-Za-z0-9-,\._']){2,15}$/i)){
        return [true,""];
    }else{
        return [false,"Name: length: 2-15 cahracters, all alphabetical characters, numbers, and following special characters:[-,._'] allowed."];
    }
};

const checkPassword  = password => {
    if(password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})/)){
        return [true,""];
    }else{
        return [false,"Password must contain: 1 lowercase and 1 uppercase alphabetical character, 1 numeric, 1 special character: [!@#$%^&*], must be 6 or more characters long"];
    }
};

const checkTitle  = title => {
    if(title.match(/^([a-zA-Z0-9\s]){1,15}$/)){
        return [true,""];
    }else{
        return [false,"Title must be letters,numbers and spaces only, max. 15 characters!"];
    }
};

const checkStory  = (story,type="Story") => {
    if(!story.match(/<\/?[^>]+(>|$)/g)){
        return [true,""];
    }else{
        return [false,`${type} contains invalid characters: [< >].`];
    }
};

const getDate = date => {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = newDate.getMonth();
    const day = newDate.getDate();
    const hour = newDate.getHours();
    const minutes = newDate.getMinutes();
    return `${day}.${month+1}.${year} at ${hour}:${minutes}h`;
};

export {checkPictureFile, checkEmail, checkName, checkPassword, checkTitle, checkStory, getDate};