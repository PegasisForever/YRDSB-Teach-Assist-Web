export function getDisplayName(course){
    if (course.name!==""){
        return course.name
    }else{
        return course.code
    }
}

