import {
  useResendVerificationCodeMutation,
  useVerifyOTPMutation,
} from "@/Redux/rtk-query/endpoints/setup/setup";
import {
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

interface SignUpVerifyProps {
  navigateTo: (component: string) => void;
  registerData: any;
  setInitialCompanyId: (companyId: string) => void;
}

const SignUpVerify: React.FC<SignUpVerifyProps> = ({
  navigateTo,
  registerData,
  setInitialCompanyId,
}) => {
  const [verifyOTP, { isLoading }] = useVerifyOTPMutation();
  const [resendOTP, { isLoading: isResendLoading }] =
    useResendVerificationCodeMutation();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const redirectTimeOut = useRef<any>("");

  const [timeLeft, setTimeLeft] = useState(900);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [isWrongNumber, setIsWrongNumber] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const resendIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    redirectTimeOut.current = setTimeout(() => {
      navigateTo("signInTMPro");
    }, 1000 * 60 * 15);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (redirectTimeOut.current) {
        clearTimeout(redirectTimeOut.current);
      }
      if (resendIntervalRef.current) {
        clearInterval(resendIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      resendIntervalRef.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            if (resendIntervalRef.current) {
              clearInterval(resendIntervalRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (resendIntervalRef.current) {
        clearInterval(resendIntervalRef.current);
      }
    };
  }, [resendCooldown]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleInput = (index: number, e: FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (value && !/^\d$/.test(value)) {
      e.currentTarget.value = "";
      return;
    }

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const digits = pastedData.replace(/\D/g, "").split("");

    digits.forEach((digit, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index]!.value = digit;
      }
    });

    const nextIndex = Math.min(digits.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleResendCode = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    await resendOTP({ ...registerData })
      .unwrap()
      .then(() => {
        clearTimeout(redirectTimeOut.current);
        redirectTimeOut.current = setTimeout(() => {
          navigateTo("signInTMPro");
        }, 1000 * 60 * 15);

        const hasPassedOneMinute = timeLeft <= 900;
        if (!hasPassedOneMinute) {
          setResendCooldown(60);
          return;
        }
        if (resendCooldown > 0) {
          return;
        }

        setResendCooldown(60);

        setTimeLeft(900);

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      });
  };

  const canResend = timeLeft <= 839 && resendCooldown === 0;

  return (
    <div className="uk-width-large">
      <h1 className="uk-text-bold uk-h1 uk-text-warning">Verify Code</h1>
      <p className="uk-text-bold uk-text-warning">
        Please enter the code we just sent to email
      </p>
      <p className="uk-text-bold uk-text-warning">{registerData?.email}</p>
      <div
        className="uk-grid uk-grid-small uk-margin uk-flex uk-flex-center"
        uk-grid="true"
      >
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <div key={index}>
            <input
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              maxLength={1}
              className="uk-input uk-text-center uk-text-bold uk-width-small uk-height-small uk-border-rounded uk-text-large "
              onInput={(e) => {
                handleInput(index, e), setIsWrongNumber(false);
              }}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={timeLeft === 0}
              style={{ border: isWrongNumber ? "2px solid #E92E32" : "" }}
            />
          </div>
        ))}
      </div>
      <p className="uk-text-warning uk-text-bold">
        {timeLeft > 0 ? (
          <>
            Please enter your verification code within {formatTime(timeLeft)}.
          </>
        ) : (
          <span className="uk-text-danger">Verification code expired!</span>
        )}
      </p>
      <p className="uk-margin uk-text-bold uk-text-warning">
        Don't Receive OTP?{" "}
        {canResend ? (
          <a href="#" className="uk-text-secondary" onClick={handleResendCode}>
            <u>Resend code</u>
          </a>
        ) : (
          <>
            <span
              className="uk-text-muted"
              style={{ textDecoration: "none", cursor: "not-allowed" }}
            >
              Resend code
            </span>
            {resendCooldown > 0 && (
              <span className="uk-text-muted">
                {" "}
                in {formatTime(resendCooldown)}
              </span>
            )}
            {timeLeft > 839 && resendCooldown === 0 && (
              <span className="uk-text-muted">
                {" "}
                in {formatTime(timeLeft - 840)}
              </span>
            )}
          </>
        )}
      </p>

      <div className="uk-margin">
        <button
          className="uk-button uk-button-secondary uk-button-large uk-width-1-1 uk-border-pill"
          disabled={timeLeft === 0 || isLoading}
          onClick={async (e) => {
            e.preventDefault();
            await verifyOTP({
              code: inputRefs.current.map((input) => input?.value).join(""),
              ...registerData,
            })
              .unwrap()
              .then((result) => {
                setInitialCompanyId(result?.data);
                navigateTo("allSet");
              });
          }}
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default SignUpVerify;
