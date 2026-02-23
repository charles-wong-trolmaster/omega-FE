import { useGetValidCodeMutation } from "@/Redux/rtk-query/endpoints/setup/setup";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  companyName: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  realm: string;
  privacyConsent: boolean;
  marketingConsent: boolean;
}

interface JoinTrolMasterSetupOmegaProps {
  navigateTo: (component: string) => void;
  setRegisterData: (data: any) => void;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const JoinTrolMasterSetupOmega: React.FC<JoinTrolMasterSetupOmegaProps> = ({
  navigateTo,
  setRegisterData,
}) => {
  const [getValidCode, { isLoading }] = useGetValidCodeMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onSubmit",
    defaultValues: {
      companyName: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      address: "",
      privacyConsent: false,
      marketingConsent: false,
    },
  });

  const password = watch("password") || "";

  const requirements: PasswordRequirement[] = [
    {
      label: "Contain 8 to 30 characters",
      test: (pwd) => pwd.length >= 8 && pwd.length <= 30,
    },
    {
      label: "Contain both lower and uppercase letters",
      test: (pwd) => /[a-z]/.test(pwd) && /[A-Z]/.test(pwd),
    },
    {
      label: "Contain 1 number",
      test: (pwd) => /\d/.test(pwd),
    },
    {
      label: "Contain 1 special character '!@#$%^&*()+' ",
      test: (pwd) => /[!@#$%^&*()+]/.test(pwd),
    },
  ];

  const onSubmit = async (data: FormData) => {
    // Map form data to API JSON structure
    const apiPayload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
      companyName: data.companyName,
      address: data.address,
    };
    await getValidCode({ ...apiPayload })
      .unwrap()
      .then(() => {
        setRegisterData(apiPayload);
        navigateTo("setUpVerify");
      })
      .catch((error) => {
        if (error.status !== 401) {
          handle500Error();
          return;
        }
      });
  };

  const handle500Error = () => {
  };

  return (
    <div className="uk-width-2xlarge">
      <div className="uk-margin uk-flex uk-flex-middle">
        <h1 className="uk-margin-remove uk-h1 uk-text-bold uk-text-warning">
          Join TrolMaster & Set up OMEGA
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div className="uk-margin">
          <div className="uk-position-relative">
            {errors.email && (
              <div
                style={{ top: "-5px", right: "0" }}
                className="uk-position-absolute uk-position-z-index"
              >
                <span className="uk-text-small uk-text-danger">
                  *{errors.email.message || "required"}
                </span>
              </div>
            )}
            <div className="uk-margin-xsmall-bottom">
              <h5 className="uk-margin-remove uk-text-warning">Email *</h5>
            </div>
            <div className="uk-inline uk-width-1-1">
              <span className="uk-form-icon" uk-icon="icon: mail"></span>
              <input
                className={`uk-input uk-border-pill ${
                  errors.email ? "uk-form-danger" : ""
                }`}
                placeholder="Email"
                type="email"
                {...register("email", {
                  required: "required",
                  pattern: {
                    value: /^\S.{6,}\S$/,
                    message: "Invalid email address",
                  },
                })}
              />
            </div>
          </div>
        </div>

        {/* Password and Confirm Password */}
        <div
          className="uk-margin uk-grid-small uk-child-width-1-2"
          uk-grid="true"
        >
          <div>
            <div className="uk-position-relative">
              {errors.password && (
                <div
                  style={{ top: "-5px", right: "0" }}
                  className="uk-position-absolute uk-position-z-index"
                >
                  <span className="uk-text-small uk-text-danger">
                    *{errors.password.message || "required"}
                  </span>
                </div>
              )}
              <div className="uk-flex uk-flex-middle uk-position-relative">
                <div className="uk-margin-xsmall-bottom">
                  <h5 className="uk-margin-remove uk-text-warning">
                    Password *
                  </h5>
                </div>
                <span
                  className="uk-margin-small-left uk-text-warning uk-cursor uk-position-relative uk-margin-xsmall-bottom"
                  uk-icon="icon: info; ratio: 0.8"
                  uk-toggle="target: #password-requirements"
                >
                  <div
                    id="password-requirements"
                    className="uk-position-absolute uk-position-z-index uk-margin-small-bottom"
                    style={{
                      bottom: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "350px",
                    }}
                    hidden
                  >
                    <div className="uk-background-primary uk-padding-small uk-border-rounded">
                      <div className="uk-margin-small">
                        <h4 className="uk-margin-remove uk-text-warning uk-text-bold">
                          Password must:
                        </h4>
                      </div>
                      {requirements.map((requirement, index) => (
                        <div
                          key={index}
                          className="uk-margin-small uk-flex uk-flex-middle"
                        >
                          <span
                            className={`uk-margin-small-right ${
                              requirement.test(password)
                                ? "uk-text-secondary"
                                : "uk-text-danger"
                            }`}
                            uk-icon={`icon: ${
                              requirement.test(password) ? "check" : "close"
                            }; ratio: 0.8`}
                          ></span>
                          <span className="uk-text-small uk-text-warning">
                            {requirement.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </span>
              </div>
              <div className="uk-inline uk-width-1-1">
                <span className="uk-form-icon" uk-icon="icon: lock"></span>
                <a
                  className="uk-form-icon uk-form-icon-flip uk-cursor"
                  uk-icon={`icon: ${showPassword ? "eye-slash" : "eye"}`}
                  onClick={() => setShowPassword(!showPassword)}
                ></a>
                <input
                  className={`uk-input uk-border-pill ${
                    errors.password ? "uk-form-danger" : ""
                  }`}
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "required",
                  })}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="uk-position-relative">
              {errors.confirmPassword && (
                <div
                  style={{ top: "-5px", right: "0" }}
                  className="uk-position-absolute uk-position-z-index"
                >
                  <span className="uk-text-small uk-text-danger">
                    *{errors.confirmPassword.message || "required"}
                  </span>
                </div>
              )}
              <div className="uk-margin-xsmall-bottom">
                <h5 className="uk-margin-remove uk-text-warning">
                  Confirm Password *
                </h5>
              </div>
              <div className="uk-inline uk-width-1-1">
                <span className="uk-form-icon" uk-icon="icon: lock"></span>
                <a
                  className="uk-form-icon uk-form-icon-flip uk-cursor"
                  uk-icon={`icon: ${showConfirmPassword ? "eye-slash" : "eye"}`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                ></a>
                <input
                  className={`uk-input uk-border-pill ${
                    errors.confirmPassword ? "uk-form-danger" : ""
                  }`}
                  placeholder="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* First Name and Last Name */}
        <div
          className="uk-margin uk-grid-small uk-child-width-1-2"
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
                    *required
                  </span>
                </div>
              )}
              <div className="uk-margin-xsmall-bottom">
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
                  {...register("firstName", { required: true })}
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
                    *required
                  </span>
                </div>
              )}
              <div className="uk-margin-xsmall-bottom">
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
                  {...register("lastName", { required: true })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Company Name and Phone Number */}
        <div
          className="uk-margin uk-grid-small uk-child-width-1-2"
          uk-grid="true"
        >
          <div>
            <div className="uk-position-relative">
              {errors.companyName && (
                <div
                  style={{ top: "-5px", right: "0" }}
                  className="uk-position-absolute uk-position-z-index"
                >
                  <span className="uk-text-small uk-text-danger">
                    *required
                  </span>
                </div>
              )}
              <div className="uk-margin-xsmall-bottom">
                <h5 className="uk-margin-remove uk-text-warning">
                  Company Name *
                </h5>
              </div>
              <div className="uk-inline uk-width-1-1">
                <span className="uk-form-icon" uk-icon="icon: server"></span>
                <input
                  className={`uk-input uk-border-pill ${
                    errors.companyName ? "uk-form-danger" : ""
                  }`}
                  placeholder="Company Name"
                  type="text"
                  {...register("companyName", { required: true })}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="uk-position-relative">
              {errors.phoneNumber && (
                <div
                  style={{ top: "-5px", right: "0" }}
                  className="uk-position-absolute uk-position-z-index"
                >
                  <span className="uk-text-small uk-text-danger">
                    *required
                  </span>
                </div>
              )}
              <div className="uk-margin-xsmall-bottom">
                <h5 className="uk-margin-remove uk-text-warning">
                  Phone Number
                </h5>
              </div>
              <div className="uk-inline uk-width-1-1">
                <span className="uk-form-icon" uk-icon="icon: receiver"></span>
                <input
                  className={`uk-input uk-border-pill ${
                    errors.phoneNumber ? "uk-form-danger" : ""
                  }`}
                  placeholder="Phone Number"
                  type="tel"
                  {...register("phoneNumber")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="uk-margin">
          <div className="uk-position-relative">
            <div className="uk-margin-xsmall-bottom">
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
        </div>

        {/* Privacy Policy Consent */}
        <div className="uk-flex uk-flex-top uk-margin">
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
            <p className="uk-text-small uk-text-bold uk-text-warning uk-margin-remove">
              As a new user, a <strong>TM+ Pro</strong> account has been created
              for you and the Omega service has been activated simultaneously.
            </p>
            {errors.privacyConsent && (
              <span className="uk-text-small uk-text-danger">
                *{errors.privacyConsent.message}
              </span>
            )}
          </div>
        </div>

        {/* Marketing Consent */}
        <div className="uk-flex uk-flex-top uk-margin">
          <div className="uk-margin-small-right">
            <input
              className="uk-checkbox uk-border-pill"
              type="checkbox"
              {...register("marketingConsent", {
                required: "You must accept the privacy policy",
              })}
            />
          </div>
          <div>
            <p className="uk-text-small uk-text-bold uk-text-warning uk-margin-remove">
              We're committed to your privacy. TrolMaster uses the information
              you provide to us to contact you about our relevant content,
              products, and services. You may unsubscribe from these
              communications at any time. For more information, check out our{" "}
              <a href="#" className="uk-text-secondary">
                <u>Privacy Policy</u>
              </a>
              .
            </p>
            {errors.marketingConsent && (
              <span className="uk-text-small uk-text-danger">
                *{errors.marketingConsent.message}
              </span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="uk-margin">
          <button
            className={`uk-button uk-button-secondary uk-button-large uk-width-1-1 uk-border-pill ${
              isLoading ? "uk-disabled" : ""
            }`}
            type="submit"
            disabled={isLoading}
          >
            Get Verification Code
          </button>
        </div>

        {/* Back Button */}
        <div className="uk-margin">
          <button
            className="uk-button uk-button-default uk-button-large uk-width-1-1 uk-border-pill"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("login");
            }}
          >
            Back to Login
          </button>
        </div>
      </form>
      {/* <div className="uk-margin uk-flex uk-flex-center">
        <button
          className="uk-button uk-button-primary uk-button-large uk-width-1-3 uk-border-pill"
          uk-toggle="target: #modal-500error"
        >
          Test 500 error
        </button>
      </div> */}
      <div id="modal-500error" uk-modal="">
        <div className="uk-modal-dialog uk-background-listblue uk-border-rounded">
          <div className="uk-padding">
            <h2 className="uk-margin-remove uk-text-warning">500 error</h2>
          </div>
          <div className="uk-padding uk-padding-remove-vertical ">
            <span className="uk-text-warning">/keyCode error </span>
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

export default JoinTrolMasterSetupOmega;
