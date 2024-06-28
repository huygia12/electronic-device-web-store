const PageNotFound = () => {
  return (
    <div className="flex items-center flex-col">
      <img src="/notFound.svg" alt="notFound" className="w-[40rem]" />
      <span className="text-xl font-semibold text-slate-500">
        Page Not Found :((
      </span>
    </div>
  );
};

export default PageNotFound;
