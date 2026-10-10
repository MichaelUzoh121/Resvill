function FormField({
  label,
  className = "",
  ...props
}) {

  return (
    <label className={`block ${className}`}>

      <span className="
        mb-2
        block
        text-sm
        font-bold
        text-dark-800
      ">
        {label}
      </span>


      <input
        {...props}
        className="
          w-full
          rounded-xl
          border border-dark-200
          bg-white
          px-4
          py-3
          text-sm
          text-dark-900
          outline-none
          transition
          placeholder:text-dark-400
          focus:border-primary-500
          focus:ring-4
          focus:ring-primary-100
        "
      />

    </label>
  );
}


export default FormField;