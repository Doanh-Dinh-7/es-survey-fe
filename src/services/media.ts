import api from "./api";

export const uploadMedia = async (formData: FormData) => {
  try {
    const response = await api.post("/media/upload-file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const deleteMedia = async (mediaUrl: string) => {
  try {
    const response = await api.delete("/media?mediaUrl=" + mediaUrl);
    return response.data;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};
