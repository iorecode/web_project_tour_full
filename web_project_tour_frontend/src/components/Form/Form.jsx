function Form({ children, title, formClass, onSubmit }) {
  return (
    <form className={`${formClass}__form`} onSubmit={(e) => {
      e.preventDefault(); 
      if (onSubmit) onSubmit(e); 
    }}>
      <p className={`${formClass}__title`}>{title}</p>
      {children}
    </form>
  );
}

export default Form;
