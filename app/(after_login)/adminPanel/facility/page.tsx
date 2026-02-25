"use client";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  useCreateFacilitiesMutation,
  useDeleteFacilityMutation,
  useGetFacilityListQuery,
  useUpdateFacilityMutation,
} from "@/Redux/rtk-query/endpoints/admin/facilities";
import {
  useCreateRoomsMutation,
  useDeleteRoomMutation,
  useGetRoomListQuery,
  useUpdateRoomMutation,
} from "@/Redux/rtk-query/endpoints/admin/rooms";
import {
  useCreateZonesMutation,
  useDeleteZoneMutation,
  useUpdateZoneMutation,
} from "@/Redux/rtk-query/endpoints/admin/zones";

interface Zone {
  id: string;
  name: string;
}

interface Room {
  id: string;
  name: string;
  zones: Zone[];
}

interface Facility {
  id: string;
  name: string;
}

const Counter = ({
  count,
  onIncrement,
  onDecrement,
}: {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      bgcolor: "white",
      borderRadius: "999px",
      overflow: "hidden",
    }}
  >
    <Button
      onClick={onDecrement}
      disabled={count <= 1}
      sx={{ color: "success.main", minWidth: 36, px: 1 }}
    >
      −
    </Button>
    <Typography
      sx={{ color: "success.main", px: 2, minWidth: 40, textAlign: "center" }}
    >
      {count}
    </Typography>
    <Button
      onClick={onIncrement}
      sx={{ color: "success.main", minWidth: 36, px: 1 }}
    >
      +
    </Button>
  </Box>
);

const FacilityPage = () => {
  // RTK Query hooks
  const { data: facilitiesData, isLoading: isLoadingFacilities } =
    useGetFacilityListQuery({});
  const [createFacilities, { isLoading: isCreatingFacilities }] =
    useCreateFacilitiesMutation();
  const [updateFacility, { isLoading: isUpdatingFacility }] =
    useUpdateFacilityMutation();
  const [deleteFacility, { isLoading: isDeletingFacility }] =
    useDeleteFacilityMutation();
  const [createRooms, { isLoading: isCreatingRooms }] =
    useCreateRoomsMutation();
  const [updateRoom, { isLoading: isUpdatingRoom }] = useUpdateRoomMutation();
  const [deleteRoom, { isLoading: isDeletingRoom }] = useDeleteRoomMutation();
  const [createZones, { isLoading: isCreatingZones }] =
    useCreateZonesMutation();
  const [updateZone, { isLoading: isUpdatingZone }] = useUpdateZoneMutation();
  const [deleteZone, { isLoading: isDeletingZone }] = useDeleteZoneMutation();

  // Selection state
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(
    null,
  );
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Create form state
  const [facilityCount, setFacilityCount] = useState(1);
  const [facilityNames, setFacilityNames] = useState(["Facility A"]);
  const [roomCount, setRoomCount] = useState(1);
  const [roomNames, setRoomNames] = useState(["Room 1"]);
  const [zoneCount, setZoneCount] = useState(1);
  const [zoneNames, setZoneNames] = useState(["Zone 1"]);

  // Edit state
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [editingFacilityName, setEditingFacilityName] = useState("");
  const [editingRoom, setEditingRoom] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editingRoomName, setEditingRoomName] = useState("");
  const [editingZone, setEditingZone] = useState<{
    roomId: string;
    zone: Zone;
  } | null>(null);
  const [editingZoneName, setEditingZoneName] = useState("");

  // Delete state
  const [facilityToDelete, setFacilityToDelete] = useState<Facility | null>(
    null,
  );
  const [roomToDelete, setRoomToDelete] = useState<{
    facilityId: string;
    room: Room;
  } | null>(null);
  const [zoneToDelete, setZoneToDelete] = useState<{
    facilityId: string;
    roomId: string;
    zone: Zone;
  } | null>(null);

  // Modal open state
  const [openCreateFacility, setOpenCreateFacility] = useState(false);
  const [openCreateRoom, setOpenCreateRoom] = useState(false);
  const [openCreateZone, setOpenCreateZone] = useState(false);
  const [openEditFacility, setOpenEditFacility] = useState(false);
  const [openEditRoom, setOpenEditRoom] = useState(false);
  const [openEditZone, setOpenEditZone] = useState(false);
  const [openDeleteFacility, setOpenDeleteFacility] = useState(false);
  const [openDeleteRoom, setOpenDeleteRoom] = useState(false);
  const [openDeleteZone, setOpenDeleteZone] = useState(false);

  // Menu anchor state
  const [facilityMenuAnchor, setFacilityMenuAnchor] = useState<{
    el: HTMLElement;
    id: string;
  } | null>(null);
  const [roomMenuAnchor, setRoomMenuAnchor] = useState<{
    el: HTMLElement;
    id: string;
  } | null>(null);
  const [zoneMenuAnchor, setZoneMenuAnchor] = useState<{
    el: HTMLElement;
    id: string;
  } | null>(null);

  const facilities: Facility[] = facilitiesData?.data ?? [];
  const { data: roomsData } = useGetRoomListQuery(selectedFacilityId!, {
    skip: !selectedFacilityId,
  });
  const currentRooms: Room[] = roomsData?.data || [];

  useEffect(() => {
    if (!selectedFacilityId && facilities.length > 0) {
      setSelectedFacilityId(facilities[0].id);
    }
  }, [facilities, selectedFacilityId]);

  // Facility handlers
  const handleEditFacilityClick = (facility: Facility) => {
    setFacilityMenuAnchor(null);
    setEditingFacility(facility);
    setEditingFacilityName(facility.name);
    setOpenEditFacility(true);
  };

  const handleSaveFacilityName = async () => {
    if (!editingFacility || !editingFacilityName.trim()) {
      setOpenEditFacility(false);
      setEditingFacility(null);
      return;
    }
    try {
      await updateFacility({
        facility_id: editingFacility.id,
        name: editingFacilityName.trim(),
      }).unwrap();
      setEditingFacility(null);
      setEditingFacilityName("");
      setOpenEditFacility(false);
    } catch (error) {
      console.error("Failed to update facility:", error);
    }
  };

  const handleDeleteFacilityClick = (facility: Facility) => {
    setFacilityMenuAnchor(null);
    setFacilityToDelete(facility);
    setOpenDeleteFacility(true);
  };

  const handleConfirmDeleteFacility = async () => {
    if (!facilityToDelete) return;
    try {
      await deleteFacility(facilityToDelete.id).unwrap();
      if (selectedFacilityId === facilityToDelete.id) {
        const remaining = facilities.filter(
          (f) => f.id !== facilityToDelete.id,
        );
        setSelectedFacilityId(remaining.length > 0 ? remaining[0].id : null);
      }
      setFacilityToDelete(null);
      setOpenDeleteFacility(false);
    } catch (error) {
      console.error("Failed to delete facility:", error);
    }
  };

  // Room handlers
  const handleEditRoomClick = (room: Room) => {
    setRoomMenuAnchor(null);
    setEditingRoom({ id: room.id, name: room.name });
    setEditingRoomName(room.name);
    setOpenEditRoom(true);
  };

  const handleSaveRoomName = async () => {
    if (!selectedFacilityId || !editingRoomName.trim() || !editingRoom) {
      setOpenEditRoom(false);
      setEditingRoom(null);
      return;
    }
    try {
      await updateRoom({
        facility_id: selectedFacilityId,
        room_id: editingRoom.id,
        name: editingRoomName.trim(),
      }).unwrap();
      setEditingRoom(null);
      setEditingRoomName("");
      setOpenEditRoom(false);
    } catch (error) {
      console.error("Failed to update room:", error);
    }
  };

  const handleDeleteRoomClick = (room: Room) => {
    if (!selectedFacilityId) return;
    setRoomMenuAnchor(null);
    setRoomToDelete({ facilityId: selectedFacilityId, room });
    setOpenDeleteRoom(true);
  };

  const handleConfirmDeleteRoom = async () => {
    if (!roomToDelete) return;
    try {
      await deleteRoom({
        facility_id: roomToDelete.facilityId,
        room_id: roomToDelete.room.id,
      }).unwrap();
      setRoomToDelete(null);
      setOpenDeleteRoom(false);
    } catch (error) {
      console.error("Failed to delete room:", error);
    }
  };

  // Zone handlers
  const handleEditZoneClick = (roomId: string, zone: Zone) => {
    setZoneMenuAnchor(null);
    setEditingZone({ roomId, zone });
    setEditingZoneName(zone.name);
    setOpenEditZone(true);
  };

  const handleSaveZoneName = async () => {
    if (!selectedFacilityId || !editingZoneName.trim() || !editingZone) {
      setOpenEditZone(false);
      setEditingZone(null);
      return;
    }
    try {
      await updateZone({
        facility_id: selectedFacilityId,
        room_id: editingZone.roomId,
        zone_id: editingZone.zone.id,
        name: editingZoneName.trim(),
      }).unwrap();
      setEditingZone(null);
      setEditingZoneName("");
      setOpenEditZone(false);
    } catch (error) {
      console.error("Failed to update zone:", error);
    }
  };

  const handleDeleteZoneClick = (roomId: string, zone: Zone) => {
    if (!selectedFacilityId) return;
    setZoneMenuAnchor(null);
    setZoneToDelete({ facilityId: selectedFacilityId, roomId, zone });
    setOpenDeleteZone(true);
  };

  const handleConfirmDeleteZone = async () => {
    if (!zoneToDelete) return;
    try {
      await deleteZone({
        facility_id: zoneToDelete.facilityId,
        room_id: zoneToDelete.roomId,
        zone_id: zoneToDelete.zone.id,
      }).unwrap();
      setZoneToDelete(null);
      setOpenDeleteZone(false);
    } catch (error) {
      console.error("Failed to delete zone:", error);
    }
  };

  // Count helpers
  const incrementCount = () => {
    setFacilityCount(facilityCount + 1);
    setFacilityNames([
      ...facilityNames,
      `Facility ${String.fromCharCode(65 + facilityNames.length)}`,
    ]);
  };

  const decrementCount = () => {
    if (facilityCount > 1) {
      setFacilityCount(facilityCount - 1);
      setFacilityNames(facilityNames.slice(0, facilityCount - 1));
    }
  };

  const incrementRoomCount = () => {
    setRoomCount(roomCount + 1);
    setRoomNames([...roomNames, `Room ${roomNames.length + 1}`]);
  };

  const decrementRoomCount = () => {
    if (roomCount > 1) {
      setRoomCount(roomCount - 1);
      setRoomNames(roomNames.slice(0, roomCount - 1));
    }
  };

  const incrementZoneCount = () => {
    setZoneCount(zoneCount + 1);
    setZoneNames([...zoneNames, `Zone ${zoneNames.length + 1}`]);
  };

  const decrementZoneCount = () => {
    if (zoneCount > 1) {
      setZoneCount(zoneCount - 1);
      setZoneNames(zoneNames.slice(0, zoneCount - 1));
    }
  };

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...facilityNames];
    newNames[index] = value;
    setFacilityNames(newNames);
  };

  const handleRoomNameChange = (index: number, value: string) => {
    const newNames = [...roomNames];
    newNames[index] = value;
    setRoomNames(newNames);
  };

  const handleZoneNameChange = (index: number, value: string) => {
    const newNames = [...zoneNames];
    newNames[index] = value;
    setZoneNames(newNames);
  };

  const handleRemoveFacility = (index: number) => {
    if (facilityNames.length > 1) {
      const newNames = facilityNames.filter((_, i) => i !== index);
      setFacilityNames(newNames);
      setFacilityCount(newNames.length);
    }
  };

  const handleRemoveRoom = (index: number) => {
    if (roomNames.length > 1) {
      const newNames = roomNames.filter((_, i) => i !== index);
      setRoomNames(newNames);
      setRoomCount(newNames.length);
    }
  };

  const handleRemoveZone = (index: number) => {
    if (zoneNames.length > 1) {
      const newNames = zoneNames.filter((_, i) => i !== index);
      setZoneNames(newNames);
      setZoneCount(newNames.length);
    }
  };

  const handleCreateFacilities = async () => {
    const validNames = facilityNames.filter((name) => name.trim());
    if (validNames.length === 0) return;
    try {
      await createFacilities(
        validNames.map((name) => ({ name: name.trim() })),
      ).unwrap();
      resetModal();
      setOpenCreateFacility(false);
    } catch (error) {
      console.error("Failed to create facilities:", error);
    }
  };

  const handleCreateRooms = async () => {
    const validNames = roomNames.filter((name) => name.trim());
    if (validNames.length === 0 || !selectedFacilityId) return;
    try {
      await createRooms({
        facility_id: selectedFacilityId,
        rooms: validNames.map((name) => ({ name: name.trim() })),
      }).unwrap();
      resetRoomModal();
      setOpenCreateRoom(false);
    } catch (error) {
      console.error("Failed to create rooms:", error);
    }
  };

  const handleCreateZones = async () => {
    const validNames = zoneNames.filter((name) => name.trim());
    if (validNames.length === 0 || !selectedFacilityId || !selectedRoom) return;
    try {
      await createZones({
        facility_id: selectedFacilityId,
        room_id: selectedRoom.id,
        zones: validNames.map((name) => ({ name: name.trim() })),
      }).unwrap();
      resetZoneModal();
      setOpenCreateZone(false);
    } catch (error) {
      console.error("Failed to create zones:", error);
    }
  };

  const resetModal = () => {
    setFacilityCount(1);
    setFacilityNames(["Facility A"]);
  };

  const resetRoomModal = () => {
    setRoomCount(1);
    setRoomNames(["Room 1"]);
  };

  const resetZoneModal = () => {
    setSelectedRoom(null);
    setZoneCount(1);
    setZoneNames(["Zone 1"]);
  };

  const openZoneModal = (room: Room) => {
    setSelectedRoom(room);
    setZoneCount(1);
    setZoneNames(["Zone 1"]);
    setOpenCreateZone(true);
  };

  const selectedFacility = facilities.find((f) => f.id === selectedFacilityId);

  return (
    <Box
      sx={{ p: 2, display: "flex", justifyContent: "center", height: "100%" }}
    >
      <Box sx={{ width: "100%", maxWidth: 1700, height: "100%" }}>
        <Box sx={{ display: "flex", gap: 2, height: "100%" }}>
          {/* Sidebar */}
          <Box
            sx={{ width: "16.66%", display: "flex", flexDirection: "column" }}
          >
            <Box
              sx={{
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                bgcolor: "primary.main",
                height: "45%",
              }}
            >
              {/* Sidebar Header */}
              <Box
                sx={{
                  p: 1.5,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: "secondary.main",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h3"
                  sx={{ color: "warning.main", fontWeight: "bold" }}
                >
                  My Facilities
                </Typography>
                <IconButton
                  onClick={() => setOpenCreateFacility(true)}
                  sx={{ color: "warning.main" }}
                >
                  <AddCircleIcon />
                </IconButton>
              </Box>

              {/* Facility List */}
              <Box sx={{ p: 1, flex: 1, overflowY: "auto" }}>
                {isLoadingFacilities ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <CircularProgress size={20} />
                  </Box>
                ) : facilities.length === 0 ? (
                  <Typography sx={{ p: 1, textAlign: "center" }}>
                    No facilities yet
                  </Typography>
                ) : (
                  facilities.map((facility) => (
                    <Box
                      key={facility.id}
                      onClick={() => setSelectedFacilityId(facility.id)}
                      sx={{
                        bgcolor:
                          selectedFacilityId === facility.id
                            ? "rgba(255,255,255,0.1)"
                            : "transparent",
                        borderRadius: 2,
                        p: 1,
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="h4"
                        noWrap
                        title={facility.name}
                        sx={{
                          color: "warning.main",
                          fontWeight: "bold",
                          flex: 1,
                          mr: 1,
                        }}
                      >
                        {facility.name}
                      </Typography>
                      {selectedFacilityId === facility.id && (
                        <>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFacilityMenuAnchor({
                                el: e.currentTarget,
                                id: facility.id,
                              });
                            }}
                            sx={{ color: "warning.main" }}
                          >
                            <MoreHorizIcon />
                          </IconButton>
                          <Menu
                            anchorEl={
                              facilityMenuAnchor?.id === facility.id
                                ? facilityMenuAnchor.el
                                : null
                            }
                            open={facilityMenuAnchor?.id === facility.id}
                            onClose={() => setFacilityMenuAnchor(null)}
                          >
                            <MenuItem
                              onClick={() => handleEditFacilityClick(facility)}
                            >
                              <EditIcon fontSize="small" sx={{ mr: 1 }} />
                              Edit Name
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleDeleteFacilityClick(facility)
                              }
                              sx={{ color: "error.main" }}
                            >
                              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                              Delete
                            </MenuItem>
                          </Menu>
                        </>
                      )}
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          </Box>

          {/* Main Content */}
          <Box
            sx={{
              flex: 1,
              bgcolor: "primary.main",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              borderRadius: 2,
            }}
          >
            {selectedFacility ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    pb: 0,
                  }}
                >
                  <Typography
                    variant="h3"
                    noWrap
                    sx={{ color: "warning.main", fontWeight: "bold", flex: 1 }}
                  >
                    {selectedFacility.name}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => setOpenCreateRoom(true)}
                  >
                    ADD ROOM
                  </Button>
                </Box>

                <Box sx={{ p: 1 }}>
                  {currentRooms.length === 0 ? (
                    <Typography sx={{ textAlign: "center", p: 1 }}>
                      No rooms yet. Click "ADD ROOM" to create one.
                    </Typography>
                  ) : (
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                      {currentRooms.map((room) => (
                        <Box key={room.id} sx={{ p: 1 }}>
                          <Box
                            sx={{
                              width: 500,
                              height: 280,
                              borderRadius: 2,
                              display: "flex",
                              flexDirection: "column",
                              bgcolor: "background.default",
                            }}
                          >
                            {/* Room Header */}
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                p: 1,
                                bgcolor: "secondary.main",
                                borderRadius: 2,
                              }}
                            >
                              <Typography
                                variant="h4"
                                noWrap
                                title={room.name}
                                sx={{
                                  color: "warning.main",
                                  fontWeight: "bold",
                                  flex: 1,
                                }}
                              >
                                {room.name}
                              </Typography>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setRoomMenuAnchor({
                                      el: e.currentTarget,
                                      id: room.id,
                                    });
                                  }}
                                  sx={{ color: "warning.main" }}
                                >
                                  <MoreHorizIcon />
                                </IconButton>
                                <Menu
                                  anchorEl={
                                    roomMenuAnchor?.id === room.id
                                      ? roomMenuAnchor.el
                                      : null
                                  }
                                  open={roomMenuAnchor?.id === room.id}
                                  onClose={() => setRoomMenuAnchor(null)}
                                >
                                  <MenuItem
                                    onClick={() => handleEditRoomClick(room)}
                                  >
                                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                                    Edit Name
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => handleDeleteRoomClick(room)}
                                    sx={{ color: "error.main" }}
                                  >
                                    <DeleteIcon
                                      fontSize="small"
                                      sx={{ mr: 1 }}
                                    />
                                    Delete
                                  </MenuItem>
                                </Menu>
                                <IconButton
                                  size="small"
                                  onClick={() => openZoneModal(room)}
                                  sx={{ color: "white" }}
                                >
                                  <AddCircleIcon />
                                </IconButton>
                              </Box>
                            </Box>

                            {/* Zones */}
                            <Box sx={{ p: 2, overflowY: "auto", flex: 1 }}>
                              {room.zones.length === 0 ? (
                                <Typography
                                  variant="body2"
                                  sx={{ textAlign: "center" }}
                                >
                                  No zones yet
                                </Typography>
                              ) : (
                                room.zones.map((zone, index) => (
                                  <Box
                                    key={zone.id}
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      p: 1,
                                      borderRadius: 2,
                                      border: "1px solid white",
                                      mb: index < room.zones.length - 1 ? 1 : 0,
                                    }}
                                  >
                                    <Typography
                                      variant="h4"
                                      noWrap
                                      title={zone.name}
                                      sx={{ color: "warning.main", flex: 1 }}
                                    >
                                      {zone.name}
                                    </Typography>
                                    <IconButton
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setZoneMenuAnchor({
                                          el: e.currentTarget,
                                          id: zone.id,
                                        });
                                      }}
                                      sx={{ color: "warning.main" }}
                                    >
                                      <MoreHorizIcon />
                                    </IconButton>
                                    <Menu
                                      anchorEl={
                                        zoneMenuAnchor?.id === zone.id
                                          ? zoneMenuAnchor.el
                                          : null
                                      }
                                      open={zoneMenuAnchor?.id === zone.id}
                                      onClose={() => setZoneMenuAnchor(null)}
                                    >
                                      <MenuItem
                                        onClick={() =>
                                          handleEditZoneClick(room.id, zone)
                                        }
                                      >
                                        <EditIcon
                                          fontSize="small"
                                          sx={{ mr: 1 }}
                                        />
                                        Edit Name
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() =>
                                          handleDeleteZoneClick(room.id, zone)
                                        }
                                        sx={{ color: "error.main" }}
                                      >
                                        <DeleteIcon
                                          fontSize="small"
                                          sx={{ mr: 1 }}
                                        />
                                        Delete
                                      </MenuItem>
                                    </Menu>
                                  </Box>
                                ))
                              )}
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Typography>Please create or select a facility</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Create Facility Modal */}
      <Dialog
        open={openCreateFacility}
        onClose={() => {
          setOpenCreateFacility(false);
          resetModal();
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ color: "warning.main", fontWeight: "bold" }}>
          Create Facility
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              mt: 1,
            }}
          >
            <Typography variant="h4">Number of Facility</Typography>
            <Counter
              count={facilityCount}
              onIncrement={incrementCount}
              onDecrement={decrementCount}
            />
          </Box>
          {facilityNames.map((name, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                Name
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  fullWidth
                  size="small"
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder={`Facility ${String.fromCharCode(65 + index)}`}
                />
                {facilityNames.length > 1 && (
                  <IconButton
                    onClick={() => handleRemoveFacility(index)}
                    color="error"
                    sx={{ ml: 1 }}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </Box>
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCreateFacilities}
            disabled={
              !facilityNames.some((name) => name.trim()) || isCreatingFacilities
            }
          >
            {isCreatingFacilities ? "Creating..." : "Create"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenCreateFacility(false);
              resetModal();
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Room Modal */}
      <Dialog
        open={openCreateRoom}
        onClose={() => {
          setOpenCreateRoom(false);
          resetRoomModal();
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ color: "warning.main", fontWeight: "bold" }}>
          Create Room
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              mt: 1,
            }}
          >
            <Typography variant="h4">Number of Room</Typography>
            <Counter
              count={roomCount}
              onIncrement={incrementRoomCount}
              onDecrement={decrementRoomCount}
            />
          </Box>
          {roomNames.map((name, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                Name
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  fullWidth
                  size="small"
                  value={name}
                  onChange={(e) => handleRoomNameChange(index, e.target.value)}
                  placeholder={`Room ${index + 1}`}
                />
                {roomNames.length > 1 && (
                  <IconButton
                    onClick={() => handleRemoveRoom(index)}
                    color="error"
                    sx={{ ml: 1 }}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </Box>
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCreateRooms}
            disabled={!roomNames.some((name) => name.trim()) || isCreatingRooms}
          >
            {isCreatingRooms ? "Creating..." : "Create"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenCreateRoom(false);
              resetRoomModal();
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Zone Modal */}
      <Dialog
        open={openCreateZone}
        onClose={() => {
          setOpenCreateZone(false);
          resetZoneModal();
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ color: "warning.main", fontWeight: "bold" }}>
          Create Zone
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              mt: 1,
            }}
          >
            <Typography variant="h4">Number of Zone</Typography>
            <Counter
              count={zoneCount}
              onIncrement={incrementZoneCount}
              onDecrement={decrementZoneCount}
            />
          </Box>
          {zoneNames.map((name, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="h5" sx={{ mb: 0.5 }}>
                Name
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  fullWidth
                  size="small"
                  value={name}
                  onChange={(e) => handleZoneNameChange(index, e.target.value)}
                  placeholder={`Zone ${index + 1}`}
                />
                {zoneNames.length > 1 && (
                  <IconButton
                    onClick={() => handleRemoveZone(index)}
                    color="error"
                    sx={{ ml: 1 }}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </Box>
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCreateZones}
            disabled={!zoneNames.some((name) => name.trim()) || isCreatingZones}
          >
            {isCreatingZones ? "Creating..." : "Create"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenCreateZone(false);
              resetZoneModal();
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Facility Modal */}
      <Dialog
        open={openEditFacility}
        onClose={() => setOpenEditFacility(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ color: "warning.main", fontWeight: "bold" }}>
          Edit Facility Name
        </DialogTitle>
        <DialogContent>
          <Typography variant="h5" sx={{ mb: 0.5, mt: 1 }}>
            Name
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={editingFacilityName}
            onChange={(e) => setEditingFacilityName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveFacilityName();
            }}
            placeholder="Facility Name"
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSaveFacilityName}
            disabled={isUpdatingFacility}
          >
            {isUpdatingFacility ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenEditFacility(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Room Modal */}
      <Dialog
        open={openEditRoom}
        onClose={() => setOpenEditRoom(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ color: "warning.main", fontWeight: "bold" }}>
          Edit Room Name
        </DialogTitle>
        <DialogContent>
          <Typography variant="h5" sx={{ mb: 0.5, mt: 1 }}>
            Name
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={editingRoomName}
            onChange={(e) => setEditingRoomName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveRoomName();
            }}
            placeholder="Room Name"
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSaveRoomName}
            disabled={isUpdatingRoom}
          >
            {isUpdatingRoom ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenEditRoom(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Zone Modal */}
      <Dialog
        open={openEditZone}
        onClose={() => setOpenEditZone(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ color: "warning.main", fontWeight: "bold" }}>
          Edit Zone Name
        </DialogTitle>
        <DialogContent>
          <Typography variant="h5" sx={{ mb: 0.5, mt: 1 }}>
            Name
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={editingZoneName}
            onChange={(e) => setEditingZoneName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveZoneName();
            }}
            placeholder="Zone Name"
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSaveZoneName}
            disabled={isUpdatingZone}
          >
            {isUpdatingZone ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenEditZone(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Facility Modal */}
      <Dialog
        open={openDeleteFacility}
        onClose={() => setOpenDeleteFacility(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ color: "warning.main", fontWeight: "bold" }}>
          Delete Facility
        </DialogTitle>
        <DialogContent>
          <Typography>
            Deleting <strong>{facilityToDelete?.name}</strong> will also remove
            all associated Rooms & Zones. This action cannot be undone. Are you
            sure you want to proceed?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDeleteFacility}
            disabled={isDeletingFacility}
          >
            {isDeletingFacility ? "Deleting..." : "Delete"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDeleteFacility(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Room Modal */}
      <Dialog
        open={openDeleteRoom}
        onClose={() => setOpenDeleteRoom(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ color: "warning.main", fontWeight: "bold" }}>
          Delete Room
        </DialogTitle>
        <DialogContent>
          <Typography>
            Deleting <strong>{roomToDelete?.room.name}</strong> will also remove
            all associated Zones. This action cannot be undone. Are you sure you
            want to proceed?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDeleteRoom}
            disabled={isDeletingRoom}
          >
            {isDeletingRoom ? "Deleting..." : "Delete"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDeleteRoom(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Zone Modal */}
      <Dialog
        open={openDeleteZone}
        onClose={() => setOpenDeleteZone(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ color: "warning.main", fontWeight: "bold" }}>
          Delete Zone
        </DialogTitle>
        <DialogContent>
          <Typography>
            Deleting <strong>{zoneToDelete?.zone.name}</strong> will also remove
            all settings associated with this Zone. This action cannot be
            undone. Are you sure you want to proceed?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDeleteZone}
            disabled={isDeletingZone}
          >
            {isDeletingZone ? "Deleting..." : "Delete"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDeleteZone(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacilityPage;
