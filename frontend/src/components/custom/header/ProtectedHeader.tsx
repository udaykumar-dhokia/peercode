const ProtectedHeader = ({ slug }: any) => {
  return (
    <>
      <div className="logo text-2xl font-bold">
        <h1>{slug}</h1>
      </div>
    </>
  );
};

export default ProtectedHeader;
