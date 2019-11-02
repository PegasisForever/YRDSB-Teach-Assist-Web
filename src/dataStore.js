let data={}

export function store(key, obj) {
    data[key]=obj
}

export function read(key) {
    return data[key]
}