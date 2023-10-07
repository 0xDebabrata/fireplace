let drag = false 

const handleMouseMove = (e) => {
    e.preventDefault()
    const border = document.getElementById("border")
    const percent = 100 - (e.clientX / window.innerWidth)*100
    border.style.width = percent + "%"
}

export const handleClick = (e) => {
    const border = document.getElementById("border")
    const rect = border.getBoundingClientRect()
    const clickPointX = e.clientX
    const left = rect.left
    const padding = 2 

    if (clickPointX <= left + padding) {
        drag = true
        document.addEventListener("mousemove", handleMouseMove)
    }
}

export const handleMouseUp = () => {
    if (drag) {
        document.removeEventListener("mousemove", handleMouseMove) 
        drag = false
    }
}
