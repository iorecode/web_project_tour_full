import './Spinner.css'

export default function Spinner({ isLoading }){
    const spinnerClass = isLoading ? `spinner-active` : `spinner-disabled`

    return(
    <div className={spinnerClass + ' spinner__container'}>
    <div className="spinner"></div>
    <p className="spinner__text">Carregando...</p>
    </div>
)
}