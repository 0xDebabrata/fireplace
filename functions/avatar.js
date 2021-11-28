const colours = ["B7C3FF", "FFD1B7", "E5B7FF", "D0D0D0", "D3FFC9"]

export const createAvatar = (count, id, name) => {
    const div = document.createElement("div")
    div.classList.add("avi")
    div.setAttribute("id", id)

    const img = document.createElement("img")
    img.src = `https://ui-avatars.com/api/?name=${name}&size=35&background=${colours[count]}`
    img.style.width = "35px"
    img.style.height= "35px"

    div.appendChild(img)
    const element = document.getElementById("avatarsWrapper")
    element.appendChild(div)
}

