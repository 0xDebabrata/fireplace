const colours = ["B7C3FF", "FFD1B7", "E5B7FF", "D0D0D0", "D3FFC9"]

export const createAvatar = (count, id, name) => {
    const div = document.createElement("div")
    div.classList.add("avi")
    div.setAttribute("id", id)
    div.setAttribute("data-colour", colours[count])

    const img = document.createElement("img")
    img.src = `https://ui-avatars.com/api/?name=${name}&size=35&background=${colours[count]}`
    img.style.width = "35px"
    img.style.height= "35px"

    div.appendChild(img)
    const element = document.getElementById("avatarsWrapper")
    element.appendChild(div)
}

export const addGlow = (id) => {
    const div = document.getElementById(id)
    const colour = div.getAttribute("data-colour")

    div.childNodes[0].style.boxShadow = "0 0 10px 3px #" + colour
}

export const removeGlow = (id) => {
    const div = document.getElementById(id)
    if (div) {
        console.log("removing")
        div.childNodes[0].style.removeProperty("box-shadow")
        div.style.removeProperty("box-shadow")
    }
}

