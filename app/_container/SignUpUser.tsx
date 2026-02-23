interface SignUpUserProps {
  navigateTo: (component: string) => void;
}

const SignUpUser: React.FC<SignUpUserProps> = ({ navigateTo }) => {
  return (
    <div className="uk-width-large">
      <h1 className="uk-text-capitalize uk-text-bold uk-text-warning">
        Already a TrolMaster User?
      </h1>
      <div className="uk-flex uk-flex-middle ">
        <img src="/img/tm+ProIcon.svg" alt="logo" width="80" />
        <h2 className="uk-margin-remove uk-text-warning uk-text-bold">
          TM+ PRO APP
        </h2>
      </div>

      <div className="uk-margin">
        <button
          className="uk-button uk-button-default uk-button-large uk-width-1-1 uk-border-pill"
          onClick={(e) => {
            e.preventDefault();
            navigateTo("signInTMPro");
          }}
        >
          Yes
        </button>
      </div>

      <div className="uk-margin">
        <button
          className="uk-button uk-button-default uk-button-large uk-width-1-1 uk-border-pill"
          onClick={(e) => {
            e.preventDefault();
            navigateTo("signUpBoth");
          }}
        >
          No
        </button>
      </div>

      <div className="uk-margin">
        <button
          className="uk-button uk-button-primary uk-button-large uk-width-1-1 uk-border-pill"
          onClick={(e) => {
            e.preventDefault();
            navigateTo("login");
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
};
export default SignUpUser;
