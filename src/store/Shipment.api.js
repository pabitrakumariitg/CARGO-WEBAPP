import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios"; // Ensure axiosInstance is correctly set up

export const Shipments = create((set) => ({
  shipments: [],
  isShipmentsLoading: false,
  
  getAllShipments: async () => {
    set({ isShipmentsLoading: true });
    try {
      const res = await axiosInstance.get("/shipments");
      set({ shipments: res.data });
    } catch (error) {
      toast.error("Error fetching shipments: " + error.message);
    } finally {
      set({ isShipmentsLoading: false });
    }
  },
  
  addShipment: async (shipmentData) => {
    try {
      const res = await axiosInstance.post("/shipment", shipmentData);
      set((state) => ({
        shipments: [...state.shipments, res.data], // Adds new shipment to the list
      }));
      toast.success("Shipment added successfully");
      return true; // Indicate success
    } catch (error) {
      toast.error("Failed to add shipment: " + error.message);
      return false; // Indicate failure
    }
  }
}));
