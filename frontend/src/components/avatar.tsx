import ghost from "../resources/ghost.jpg";

interface AvatarProps {
  className?: string;
  image?: string;
}

export default ({ image, className }: AvatarProps) => {
  const avatar = image || ghost;

  return (
    <div>
      <img src={avatar} className={`avatar_image ${className}`} />
    </div>
  );
};
