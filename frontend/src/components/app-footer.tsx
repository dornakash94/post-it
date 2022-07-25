import gitIcon from "../resources/git-icon.png";
import linkedin from "../resources/linkedin.png";

export default () => {
  return (
    <div className="App-footer">
      <a href="https://github.com/dornakash94">
        <img className="footer-icons" src={gitIcon} />
      </a>

      <a href="https://www.linkedin.com/in/dor-nakash-22763a203/">
        <img className="footer-icons" src={linkedin} />
      </a>
    </div>
  );
};
