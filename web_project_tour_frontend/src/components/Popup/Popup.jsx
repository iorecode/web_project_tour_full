import "./Popup.css"

export default function Popup({ children, isOpen, specialClass }){
    const popupVisibility = isOpen ? "popup_visible" : "popup_hidden"

    return(
        <div className={"popup " + specialClass + " " + popupVisibility}>
            {children}
        </div>
    )
}