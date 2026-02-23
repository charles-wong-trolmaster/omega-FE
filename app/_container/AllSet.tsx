import React from "react";

interface AllSetProps {
  navigateTo: (component: string) => void;
}

const AllSet: React.FC<AllSetProps> = ({ navigateTo }) => {
  return (
    <div className="uk-flex uk-flex-center uk-flex-middle uk-margin-small-top uk-width-2xlarge">
      <div className="uk-text-center">
        {/* Title */}
        <div className="uk-margin-large">
          <h1 className="uk-text-bold uk-text-warning">
            All Set! Time to Launch Your Business!
          </h1>
          <h3 className="uk-text-warning uk-margin-remove">
            Congratulations! You have successfully activated the OMEGA service.
            Omega is now ready to serve your farm.
          </h3>
        </div>

        {/* Party Emoji Section */}
        <div className="uk-margin">
          <h2 className="uk-margin-remove uk-text-warning">
            🎉 Let's get started! 🎉
          </h2>
        </div>

        {/* Go to Omega Button */}
        <div className="uk-margin-large-top">
          <button
            className="uk-button uk-button-secondary uk-button-large uk-width-1-1 uk-border-pill"
            type="button"
            onClick={() => navigateTo("login")}
          >
            Go to Omega
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllSet;
