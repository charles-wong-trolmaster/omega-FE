import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Grow from "@mui/material/Grow";
import AdbIcon from "@mui/icons-material/Adb";
import theme from "@/styles/theme";
import Divider from "@mui/material/Divider";
import { ListItemIcon, ListItemText } from "@mui/material";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const formatDateTime = (date: Date): string => {
  const day = DAYS[date.getDay()];
  const dateNum = String(date.getDate()).padStart(2, "0");
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();

  const rawHours = date.getHours();
  const ampm = rawHours >= 12 ? "PM" : "AM";
  const hours = String(rawHours % 12 || 12).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}, ${dateNum} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
};

const navButtonSx = {
  fontSize: theme.typography.h4.fontSize,
  fontWeight: "normal",
  "&:hover": { color: theme.palette.secondary.main },
};

const facilitySettings = [
  "Facility A",
  "Facility B",
  "Facility C",
  "Manage Facilities",
];

function OmegaAppBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [facilityAnchorEl, setFacilityAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [now, setNow] = React.useState<Date>(new Date());

  const open = Boolean(anchorEl);
  const facilityOpen = Boolean(facilityAnchorEl);

  // ✅ Tick every second to keep the time live
  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ─── Avatar menu handlers ───────────────────────────────────────────────────
  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    if (!open) return;
    const handleDocumentClick = (event: MouseEvent) => {
      if (anchorEl && anchorEl.contains(event.target as Node)) return;
      setAnchorEl(null);
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, [open, anchorEl]);

  // ─── Facility menu handlers ─────────────────────────────────────────────────
  const handleFacilityToggle = (event: React.MouseEvent<HTMLElement>) => {
    setFacilityAnchorEl(facilityAnchorEl ? null : event.currentTarget);
  };

  const handleFacilityClose = () => {
    setFacilityAnchorEl(null);
  };

  React.useEffect(() => {
    if (!facilityOpen) return;
    const handleDocumentClick = (event: MouseEvent) => {
      if (facilityAnchorEl && facilityAnchorEl.contains(event.target as Node))
        return;
      setFacilityAnchorEl(null);
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, [facilityOpen, facilityAnchorEl]);

  return (
    <AppBar position="static">
      <Toolbar>
        <img src="/img/trolmasterLogo.svg" alt="" height="40px" />

        <Box sx={{ flexGrow: 1, display: "flex", marginLeft: "20px" }}>
          <Button sx={navButtonSx} startIcon={<AdbIcon />}>
            Grow Room
          </Button>
          <Button sx={navButtonSx} startIcon={<AdbIcon />}>
            Cultivation
          </Button>
          <Button sx={navButtonSx} startIcon={<AdbIcon />}>
            Task
          </Button>
          <Button sx={navButtonSx} startIcon={<AdbIcon />}>
            Data Analytic
          </Button>
        </Box>

        <Box
          sx={{ display: "flex", alignItems: "center", flexGrow: 0, gap: 1 }}
        >
          <Typography
            variant="h4"
            sx={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}
          >
            {formatDateTime(now)}
          </Typography>

          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ borderColor: theme.palette.primary.contrastText, mx: 1 }}
          />

          {/* ─── Facility Button + Popper ─────────────────────────────────── */}
          <Button
            sx={navButtonSx}
            startIcon={<AdbIcon />}
            onClick={handleFacilityToggle}
          >
            Facility
          </Button>

          <Popper open={facilityOpen} anchorEl={facilityAnchorEl}>
            <Paper elevation={3}>
              <MenuList>
                {facilitySettings.map((facility) => (
                  <MenuItem key={facility} onClick={handleFacilityClose}>
                    <Typography>{facility}</Typography>
                  </MenuItem>
                ))}
              </MenuList>
            </Paper>
          </Popper>

          {/* ─── Avatar + Popper ──────────────────────────────────────────── */}
          <IconButton onClick={handleToggle}>
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/2.jpg"
              sx={{ width: 30, height: 30 }}
            />
          </IconButton>
          <IconButton>
            <NotificationsIcon />
          </IconButton>
          <IconButton>
            <LogoutIcon />
          </IconButton>

          <Popper open={open} anchorEl={anchorEl}>
            <Paper elevation={3}>
              <MenuList>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <AccountCircleIcon
                      sx={{ color: theme.palette.primary.contrastText }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <AdminPanelSettingsIcon
                      sx={{ color: theme.palette.primary.contrastText }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Admin Panel" />
                </MenuItem>
              </MenuList>
            </Paper>
          </Popper>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default OmegaAppBar;
