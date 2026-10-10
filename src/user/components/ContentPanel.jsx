function ContentPanel({
  title,
  description,
  children,
}) {

  return (
    <div className="
      rounded-2xl
      border border-dark-200
      bg-white
      p-5
      shadow-soft
      sm:p-6
    ">

      <h2 className="
        text-xl
        font-bold
        text-dark-900
      ">
        {title}
      </h2>


      <p className="
        mb-5
        mt-1
        text-sm
        text-dark-600
      ">
        {description}
      </p>


      {children}

    </div>
  );
}


export default ContentPanel;