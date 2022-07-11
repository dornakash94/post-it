import { CSSProperties } from "react";
import ghost from "../resources/ghost.jpg";

interface AvatarProps {
  style?: CSSProperties;
  image?: string;
}

export default ({ image, style }: AvatarProps) => {
  const avatar = image || ghost;

  return (
    <div>
      <img src={avatar} className="avatar_image" style={style} />
    </div>
  );
};
