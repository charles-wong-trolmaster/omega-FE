"use client";

import OmegaSwitcher from "@/components/OmegaSwitcher";
import OmegaTextField from "@/components/OmegaTextfield";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Box, Button, Link, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface ForgotProps {
  navigateTo: (component: string) => void;
}

interface ForgotFormData {
  email: string;
}

const OmegaForgotPassword: React.FC<ForgotProps> = ({ navigateTo }) => {
  // ✅ Merged activeTab & loginMethod into one state — they were doing the same thing
  const [activeTab, setActiveTab] = useState<"companyId" | "password">(
    "companyId",
  );

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<ForgotFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotFormData) => {
    // TODO: handle forgot companyId / password
    console.log(activeTab, data);
  };

  return (
    <Box sx={{ paddingTop: "80px", width: "100%" }}>
      <img src="/img/trolmasterLogo.svg" alt="" />

      <Box sx={{ margin: "30px 0px" }}>
        <Typography sx={{ fontWeight: "bold" }} variant="h1">
          Forgot
        </Typography>
      </Box>

      {/* Switcher */}
      <Box sx={{ marginBottom: "30px" }}>
        <OmegaSwitcher
          options={[
            { label: "Company ID", value: "companyId" },
            { label: "Password", value: "password" },
          ]}
          value={activeTab}
          onChange={(val) => setActiveTab(val)}
          fullWidth
          exclusive
        />
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ width: "100%" }}
      >
        <Stack spacing={5}>
          {/* Description */}
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Please provide the email address that you used when signed up for
            your account. If you forgot your email, please{" "}
            <Link href="#" underline="always">
              contact us
            </Link>
            .
          </Typography>

          {/* Email Field */}
          <Box>
            <Typography variant="h5" sx={{ marginBottom: "5px" }}>
              Email *
            </Typography>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <OmegaTextField
                  {...field}
                  startIcon={<MailOutlineIcon />}
                  size="small"
                  fullWidth
                  placeholder="Email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Box>

          {/* Dynamic message based on active tab */}
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {activeTab === "companyId"
              ? "We have sent your Company ID to the email address you provided."
              : "You will receive a link to create a new password via e-mail."}
          </Typography>
        </Stack>

        {/* Buttons */}
        <Stack spacing={2} sx={{ marginTop: "30px" }}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            type="submit"
            disabled={!isValid}
          >
            Confirm
          </Button>
          <Button
            variant="contained"
            fullWidth
            type="button"
            onClick={(e) => {
              e.preventDefault();
              navigateTo("login");
            }}
          >
            Back
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default OmegaForgotPassword;
