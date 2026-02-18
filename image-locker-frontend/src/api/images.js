import api from "./client";

export async function listImages() {
  const res = await api.get("/api/images");
  return res.data; // []
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file); // key must be "file"

  const res = await api.post("/api/images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// If you added PUT /api/images/:id/rename in backend:
export async function renameImage(id, newName) {
  const res = await api.put(`/api/images/${id}/rename`, { newName });
  return res.data;
}

// If you kept PATCH /api/images/:id, use this instead:
// export async function renameImage(id, newName) {
//   const res = await api.patch(`/api/images/${id}`, { newName });
//   return res.data;
// }

export async function deleteImage(id) {
  const res = await api.delete(`/api/images/${id}`);
  return res.data;
}

// Download bytes endpoint: if your backend is GET /api/images/{id}
export async function downloadImage(id) {
  const res = await api.get(`/api/images/${id}`, { responseType: "blob" });
  return res;
}
