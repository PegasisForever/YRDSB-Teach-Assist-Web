import getString from "./strings"
import {safeDiv} from "./tools"

export function getDisplayName(course) {
    if (course.name !== null) {
        return course.name
    } else if (course.code !== null) {
        return course.code
    } else {
        return getString("unnamed_course")
    }
}

export function getPeriodRoom(course) {
    let strs = []
    if (course.block !== null) {
        strs.push(getString("period_number").replace("%s", course.block))
    }
    if (course.room !== null) {
        strs.push(getString("room_number").replace("%s", course.room))
    }
    return strs.join(" - ")
}

export const categories = ["KU", "T", "C", "A", "O", "F"]

export function smallMarkGroupHasFinished(smallMarkGroup) {
    return smallMarkGroup.find(smallMark => smallMark.finished === true) != null
}

function smallMarkGroupHasWeight(smallMarkGroup) {
    if(!smallMarkGroup) return false
    return smallMarkGroup.find(smallMark => smallMark.weight > 0) != null
}

function smallMarkGetPercentage(smallMark) {
    return safeDiv(smallMark.get, smallMark.total)
}

export function smallMarkGroupGetPercentage(smallMarkGroup) {
    let get = 0.0
    let total = 0.0
    smallMarkGroup.forEach(smallMark => {
        get += smallMarkGetPercentage(smallMark) * smallMark.weight
        total += smallMark.weight
    })
    return safeDiv(get, total)
}

function smallMarkGroupGetAllWeight(smallMarkGroup) {
    let sum = 0.0
    smallMarkGroup.forEach(smallMark => {
        sum += smallMark.finished ? smallMark.weight : 0
    })
    return sum
}

export function getCourseOverallList(course) {
    let overallList = []

    let i = 0
    let weightTable=course.weight_table
    let gets = categories.reduce((map, category) => {
        map[category] = 0.0
        return map
    }, {})
    let totals = categories.reduce((map, category) => {
        map[category] = 0.0
        return map
    }, {})
    course.assignments.forEach((assi) => {
        categories.forEach((category) => {
            if (!assi[category]) return
            let smallMarkGroup = assi[category]
            if (smallMarkGroupHasFinished(smallMarkGroup) && smallMarkGroupHasWeight(smallMarkGroup)) {
                let groupWeight = smallMarkGroupGetAllWeight(smallMarkGroup)
                gets[category] += smallMarkGroupGetPercentage(smallMarkGroup) * groupWeight
                totals[category] += groupWeight
            }
        })

        let avg = 0.0
        let avgn = 0.0
        categories.forEach((category) => {
            let smallAvg=gets[category]/totals[category]
            if (isFinite(smallAvg)){
                avg+=smallAvg*weightTable[category].CW
                avgn+=weightTable[category].CW
            }
        })
        if (avgn > 0.0) {
            overallList.push([i, avg / avgn * 100])
        }
        i++
    })

    return overallList
}

export function oldGetCourseOverallList(course) {
    let overallList = []

    let i = 0.0
    let K = 0.0
    let Kn = 0.0
    let T = 0.0
    let Tn = 0.0
    let C = 0.0
    let Cn = 0.0
    let A = 0.0
    let An = 0.0
    let O = 0.0
    let On = 0.0
    let F = 0.0
    let Fn = 0.0
    course.assignments.forEach((assi) => {
        if (assi.KU && assi.KU.available && assi.KU.finished) {
            K += assi.KU.get / assi.KU.total * assi.KU.weight
            Kn += assi.KU.weight
        }
        if (assi.T && assi.T.available && assi.T.finished) {
            T += assi.T.get / assi.T.total * assi.T.weight
            Tn += assi.T.weight
        }
        if (assi.C && assi.C.available && assi.C.finished) {
            C += assi.C.get / assi.C.total * assi.C.weight
            Cn += assi.C.weight
        }
        if (assi.A && assi.A.available && assi.A.finished) {
            A += assi.A.get / assi.A.total * assi.A.weight
            An += assi.A.weight
        }
        if (assi.O && assi.O.available && assi.O.finished) {
            O += assi.O.get / assi.O.total * assi.O.weight
            On += assi.O.weight
        }
        if (assi.F && assi.F.available && assi.F.finished) {
            O += assi.F.get / assi.F.total * assi.F.weight
            On += assi.F.weight
        }

        let Ka = K / Kn
        let Ta = T / Tn
        let Ca = C / Cn
        let Aa = A / An
        let Oa = O / On
        let Fa = F / Fn
        let avg = 0.0
        let avgn = 0.0
        if (Ka >= 0.0) {
            avg += Ka * course.weight_table.KU.W
            avgn += course.weight_table.KU.W
        }
        if (Ta >= 0.0) {
            avg += Ta * course.weight_table.T.W
            avgn += course.weight_table.T.W
        }
        if (Ca >= 0.0) {
            avg += Ca * course.weight_table.C.W
            avgn += course.weight_table.C.W
        }
        if (Aa >= 0.0) {
            avg += Aa * course.weight_table.A.W
            avgn += course.weight_table.A.W
        }
        if (Oa >= 0.0) {
            avg += Oa * course.weight_table.O.W
            avgn += course.weight_table.O.W
        }
        if (Fa >= 0.0) {
            avg += Fa * course.weight_table.F.W
            avgn += course.weight_table.F.W
        }

        if (avgn > 0.0) {
            overallList.push([i, avg / avgn * 100])
        }
        i++
    })

    return overallList
}

export function isNoWeight(assi) {
    return smallMarkGroupHasWeight(assi.KU) &&
        smallMarkGroupHasWeight(assi.T) &&
        smallMarkGroupHasWeight(assi.C) &&
        smallMarkGroupHasWeight(assi.A) &&
        smallMarkGroupHasWeight(assi.O) &&
        smallMarkGroupHasWeight(assi.F)
}

export function getAverage(assi, weights) {
    let get = 0.0
    let total = 0.0

    if (assi.KU && assi.KU.finished) {
        get += assi.KU.get / assi.KU.total * weights.KU.CW
        total += weights.KU.CW
    }
    if (assi.T && assi.T.finished) {
        get += assi.T.get / assi.T.total * weights.T.CW
        total += weights.T.CW
    }
    if (assi.C && assi.C.finished) {
        get += assi.C.get / assi.C.total * weights.C.CW
        total += weights.C.CW
    }
    if (assi.A && assi.A.finished) {
        get += assi.A.get / assi.A.total * weights.A.CW
        total += weights.A.CW
    }
    if (assi.O && assi.O.finished) {
        get += assi.O.get / assi.O.total * weights.O.CW
        total += weights.O.CW
    }
    if (assi.F && assi.F.finished) {
        get += assi.F.get / assi.F.total * weights.F.CW
        total += weights.F.CW
    }

    return (total > 0) ? (get / total * 100) : null
}