const read_form = (form_id) => {
    const form_data = new FormData(document.getElementById(form_id)).entries()
    return Object.assign(...Array.from(form_data, ([x, y]) => ({ [x]: y })))
}

function TextAbstract(text, length) {
    if (text === null) {
        return ""
    }
    if (text.length <= length) {
        return text
    }
    text = text.substring(0, length)
    const last = text.lastIndexOf(" ")
    text = text.substring(0, last)
    return `${text} ...`
}
const formatAMPM = (date) => {
    if (!date || date === "") {
        return ""
    }
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const hourss = (hours % 12) ? hours : 12 // the hour '0' should be '12'
    const minutess = minutes < 10 ? `0${minutes}` : minutes
    return `${hourss}:${minutess} ${ampm}`
}
const formatDate = dateStr => {
    if (dateStr === null) {
        return ""
    }
    const dt = new Date(dateStr.split(".")[0])
    const month = (`0${dt.getMonth() + 1}`).slice(-2)
    const day = (`0${dt.getDate()}`).slice(-2)
    const date = `${day}/${month}/${dt.getFullYear()} ${formatAMPM(dt)}`
    return date
}


export { read_form, formatDate, TextAbstract }