import { Link, useNavigate } from "react-router-dom";

import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queries";
import { useUserContext, INITIAL_USER } from "@/context/AuthContext";

const Topbar = () => {
  const navigate = useNavigate();
  const { user, setUser, setIsAuthenticated} = useUserContext();

  const { mutate: signOut } = useSignOutAccount();

  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    signOut();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    navigate("/sign-in");
  };

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-4">
        <Link to="/" className="flex gap-3 items-center">
          <img src="/assets/images/LoopLink1.png" alt="logo"
            width={130}
            height={325}
          />
        </Link>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="shad-button_ghost"
          // onClick={() => signOut()}
          >
            <img src="/assets/icons/message-icon-violet.png" alt="Message" width={30} />
          </Button>
          <Button
            variant="ghost"
            className="shad-button_ghost"
            // onClick={() => signOut()}
            >
            <img src="/assets/icons/song-icon-violet.png" alt="Song" width={30}/>
          </Button>
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={(e) => handleSignOut(e)}>
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={`/profile/${user.id}`} className="flex-center gap-3 px-1">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
