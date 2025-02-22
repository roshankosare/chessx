const NavBar = () => {
  return (
    <div className="w-full h-[80px] px-2 py-2 flex justify-between">
      <Logo />
    </div>
  );
};

const Logo = () => {
  return (
    <>
      <img src="logo.png" className="sm:mx-10 w-auto h-full" />
    </>
  );
};

export default NavBar;
