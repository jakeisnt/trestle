// Title for an article or page.

import { Title as SolidTitle } from "@solidjs/meta";
import { ArrowLeft } from "../icons";
import classes from "./Title.module.scss";
import IconButton from "../IconButton";
import { useNavigate, useLocation } from "@solidjs/router";

/**
 * A title for an article or page.
 */
const Title = (props: { children: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isRootPath = () => location.pathname === "/";

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <>
      <SolidTitle>{props.children} | Trestle</SolidTitle>
      <div class={classes.title}>
        {!isRootPath() && (
          <IconButton class={classes.backButton} onClick={handleBackClick}>
            <ArrowLeft width={20} height={20} />
          </IconButton>
        )}
        <h1>{props.children}</h1>
      </div>
    </>
  );
};

export default Title;
