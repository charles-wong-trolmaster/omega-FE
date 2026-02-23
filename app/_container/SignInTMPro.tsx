import { useActiveOmegaMutation } from "@/Redux/rtk-query/endpoints/setup/setup";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface SignInTMProProps {
  navigateTo: (component: string) => void;
  setInitialCompanyId: (companyId: string) => void;
}

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName: string;
  address?: string;
  phoneNumber?: string;
  privacyConsent: boolean;
}

const SignInTMPro: React.FC<SignInTMProProps> = ({
  navigateTo,
  setInitialCompanyId,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeOmega, { isLoading }] = useActiveOmegaMutation();
  const [responseErrorMessage, setResponseErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      companyName: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      address: "",
      privacyConsent: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    const apiPayload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
      companyName: data.companyName,
      address: data.address,
    };
    await activeOmega({ ...apiPayload })
      .unwrap()
      .then((result) => {
        setInitialCompanyId(result?.data);
        navigateTo("allSet");
      })
      .catch((error) => {
        if (error.status === 401) {
          handle401Error();
        } else {
          setResponseErrorMessage(
            error.data.message || "Internal Server Error"
          );
        }
      });
  };

  const handle401Error = () => {
    setError("email", {
      type: "manual",
      message: "Incorrect email ",
    });
    setError("password", {
      type: "manual",
      message: "Incorrect password",
    });
  };

  return (
    <div className="uk-width-2xlarge">
      <div className="uk-margin">
        <h1 className="uk-margin-remove uk-text-bold uk-text-warning">
          Set up OMEGA
        </h1>
      </div>

      <div className="uk-margin-medium">
        <h3 className="uk-margin-remove uk-text-bold uk-text-warning">
          Existing TrolMaster User
        </h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="uk-grid-small uk-child-width-1-2@s" uk-grid="true">
          <div>
            <div className="uk-position-relative">
              {errors.email && (
                <div
                  style={{ top: "-5px", right: "0" }}
                  className="uk-position-absolute uk-position-z-index"
                >
                  <span className="uk-text-small uk-text-danger">
                    *{errors.email.message}
                  </span>
                </div>
              )}
              <div className="uk-margin-xsmall-bottom ">
                <h5 className="uk-margin-remove uk-text-warning">Email *</h5>
              </div>
              <div className="uk-inline uk-width-1-1">
                <span className="uk-form-icon" uk-icon="icon: mail"></span>
                <input
                  className={`uk-input uk-border-pill ${
                    errors.email ? "uk-form-danger" : ""
                  }`}
                  placeholder="Email"
                  {...register("email")}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="uk-position-relative">
              {errors.password && (
                <div
                  style={{ top: "-5px", right: "0" }}
                  className="uk-position-absolute uk-position-z-index"
                >
                  <span className="uk-text-small uk-text-danger">
                    *{errors.password.message}
                  </span>
                </div>
              )}
              <div className="uk-margin-xsmall-bottom ">
                <h5 className="uk-margin-remove uk-text-warning">Password *</h5>
              </div>
              <div className="uk-inline uk-width-1-1">
                <span className="uk-form-icon" uk-icon="icon: lock"></span>
                <a
                  className="uk-form-icon uk-form-icon-flip"
                  uk-icon={`icon: ${showPassword ? "eye-slash" : "eye"}`}
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                ></a>
                <input
                  className={`uk-input uk-border-pill ${
                    errors.password ? "uk-form-danger" : ""
                  }`}
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                />
              </div>
              <div className="uk-text-right uk-margin-xsmall-top">
                <a
                  className="uk-h5 uk-text-warning"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo("forgotTMPro");
                  }}
                >
                  Forgot Password?
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="uk-margin-medium uk-margin-remove-top">
          <h3 className="uk-margin-remove uk-text-bold uk-text-warning">
            Set up your OMEGA
          </h3>
        </div>

        <div
          className="uk-margin uk-grid-small uk-child-width-1-2@s"
          uk-grid="true"
        >
          <div>
            <div className="uk-position-relative">
              {errors.firstName && (
                <div
                  style={{ top: "-5px", right: "0" }}
                  className="uk-position-absolute uk-position-z-index"
                >
                  <span className="uk-text-small uk-text-danger">
                    *{errors.firstName.message}
                  </span>
                </div>
              )}
              <div className="uk-margin-xsmall-bottom ">
                <h5 className="uk-margin-remove uk-text-warning">
                  First Name *
                </h5>
              </div>
              <div className="uk-inline uk-width-1-1">
                <span className="uk-form-icon" uk-icon="icon: user"></span>
                <input
                  className={`uk-input uk-border-pill ${
                    errors.firstName ? "uk-form-danger" : ""
                  }`}
                  placeholder="First Name"
                  type="text"
                  {...register("firstName", {
                    required: "required",
                  })}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="uk-position-relative">
              {errors.lastName && (
                <div
                  style={{ top: "-5px", right: "0" }}
                  className="uk-position-absolute uk-position-z-index"
                >
                  <span className="uk-text-small uk-text-danger">
                    *{errors.lastName.message}
                  </span>
                </div>
              )}
              <div className="uk-margin-xsmall-bottom ">
                <h5 className="uk-margin-remove uk-text-warning">
                  Last Name *
                </h5>
              </div>
              <div className="uk-inline uk-width-1-1">
                <span className="uk-form-icon" uk-icon="icon: user"></span>
                <input
                  className={`uk-input uk-border-pill ${
                    errors.lastName ? "uk-form-danger" : ""
                  }`}
                  placeholder="Last Name"
                  type="text"
                  {...register("lastName", {
                    required: "required",
                  })}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="uk-position-relative">
              {errors.companyName && (
                <div
                  style={{ top: "-5px", right: "0" }}
                  className="uk-position-absolute uk-position-z-index"
                >
                  <span className="uk-text-small uk-text-danger">
                    *{errors.companyName.message}
                  </span>
                </div>
              )}
              <div className="uk-margin-xsmall-bottom ">
                <h5 className="uk-margin-remove uk-text-warning">
                  Company Name *
                </h5>
              </div>
              <div className="uk-inline uk-width-1-1">
                <span className="uk-form-icon" uk-icon="icon: home"></span>
                <input
                  className={`uk-input uk-border-pill ${
                    errors.companyName ? "uk-form-danger" : ""
                  }`}
                  placeholder="Company Name"
                  type="text"
                  {...register("companyName", {
                    required: "required",
                  })}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="uk-margin-xsmall-bottom ">
              <h5 className="uk-margin-remove uk-text-warning">Phone number</h5>
            </div>
            <div className="uk-inline uk-width-1-1">
              <span className="uk-form-icon" uk-icon="icon: receiver"></span>
              <input
                className="uk-input uk-border-pill"
                placeholder="Phone number"
                type="tel"
                {...register("phoneNumber")}
              />
            </div>
          </div>
        </div>

        <div className="uk-margin">
          <div className="uk-margin-xsmall-bottom ">
            <h5 className="uk-margin-remove uk-text-warning">Address</h5>
          </div>
          <div className="uk-inline uk-width-1-1">
            <span className="uk-form-icon" uk-icon="icon: location"></span>
            <input
              className="uk-input uk-border-pill"
              placeholder="Address"
              type="text"
              {...register("address")}
            />
          </div>
        </div>

        <div className="uk-flex uk-flex-top">
          <div className="uk-margin-small-right">
            <input
              className="uk-checkbox uk-border-pill"
              type="checkbox"
              {...register("privacyConsent", {
                required: "You must accept the privacy policy",
              })}
            />
          </div>
          <div>
            <p className="uk-text-small uk-text-bold uk-text-warning">
              We're committed to your privacy. TrolMaster uses the information
              you provide to us to contact you about our relevant content,
              products, and services. You may unsubscribe from these
              communications at any time. For more information, check out our{" "}
              <a href="#" className="uk-text-secondary">
                <u>Privacy Policy</u>
              </a>
              .
            </p>
            {errors.privacyConsent && (
              <span className="uk-text-small uk-text-danger">
                *{errors.privacyConsent.message}
              </span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="uk-margin">
          <button
            className="uk-button uk-button-secondary uk-button-large uk-width-1-1 uk-border-pill"
            type="submit"
            disabled={isLoading}
          >
            Activate
          </button>
        </div>

        <div className="uk-margin">
          <button
            type="button"
            className="uk-button uk-button-default uk-button-large uk-width-1-1 uk-border-pill"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("signUpUser");
            }}
          >
            Back
          </button>
        </div>
      </form>
      <div id="modal-500error" uk-modal="">
        <div className="uk-modal-dialog uk-background-listblue uk-border-rounded">
          <div className="uk-padding">
            <h2 className="uk-margin-remove uk-text-warning">500 error</h2>
          </div>
          <div className="uk-padding uk-padding-remove-vertical ">
            <span className="uk-text-warning">{responseErrorMessage}</span>
          </div>
          <div className="uk-flex uk-flex-center uk-padding">
            <button
              className="uk-button uk-button-default uk-modal-close uk-border-pill uk-margin-small-right"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInTMPro;
