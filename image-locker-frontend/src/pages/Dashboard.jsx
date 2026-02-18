import { useEffect, useState } from "react";
import {
  listImages,
  uploadImage,
  renameImage,
  deleteImage,
  downloadImage
} from "../api/images";
import { clearToken } from "../utils/token";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  async function refresh() {
    setErr("");
    setLoading(true);
    try {
      const data = await listImages();
      setImages(data);
    } catch (e) {
      const msg = e?.response?.data?.error || "Failed to load images";
      setErr(msg);
      if (e?.response?.status === 401) {
        clearToken();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onUpload() {
    if (!file) return;
    setErr("");
    try {
      await uploadImage(file);
      setFile(null);
      await refresh();
    } catch (e) {
      setErr(e?.response?.data?.error || "Upload failed");
    }
  }

  async function onRename(id) {
    const newName = prompt("Enter new file name:");
    if (!newName) return;
    setErr("");
    try {
      await renameImage(id, newName);
      await refresh();
    } catch (e) {
      setErr(e?.response?.data?.error || "Rename failed");
    }
  }

  async function onDelete(id) {
    if (!confirm("Delete this image?")) return;
    setErr("");
    try {
      await deleteImage(id);
      await refresh();
    } catch (e) {
      setErr(e?.response?.data?.error || "Delete failed");
    }
  }

  async function onDownload(img) {
    try {
      const res = await downloadImage(img.id);
      const blob = res.data;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = img.originalName || `image-${img.id}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setErr(e?.response?.data?.error || "Download failed");
    }
  }

  function logout() {
    clearToken();
    navigate("/login");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "system-ui, sans-serif"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 950,
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(15px)",
          padding: 30,
          borderRadius: 16,
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
          color: "white"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20
          }}
        >
          <h2 style={{ margin: 0 }}>📁 My Image Locker</h2>
          <button
            onClick={logout}
            style={{
              background: "#ff4d4d",
              border: "none",
              padding: "8px 14px",
              borderRadius: 8,
              color: "white",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>

        {err && (
          <div style={{ color: "#ffb3b3", marginBottom: 12 }}>
            {err}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            marginBottom: 25,
            flexWrap: "wrap"
          }}
        >
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{
              background: "white",
              padding: 6,
              borderRadius: 6
            }}
          />

          <button
            onClick={onUpload}
            disabled={!file}
            style={{
              background: "#00c6ff",
              border: "none",
              padding: "8px 14px",
              borderRadius: 8,
              color: "white",
              cursor: "pointer"
            }}
          >
            Upload
          </button>

          <button
            onClick={refresh}
            style={{
              background: "#38ef7d",
              border: "none",
              padding: "8px 14px",
              borderRadius: 8,
              color: "white",
              cursor: "pointer"
            }}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <table
            width="100%"
            cellPadding="10"
            style={{
              borderCollapse: "collapse",
              background: "rgba(255,255,255,0.05)",
              borderRadius: 12,
              overflow: "hidden"
            }}
          >
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  background: "rgba(0,0,0,0.3)"
                }}
              >
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Size</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {images.map((img) => (
                <tr key={img.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <td>{img.id}</td>
                  <td>{img.originalName}</td>
                  <td>{img.contentType}</td>
                  <td>{(img.sizeBytes / 1024).toFixed(2)} KB</td>
                  <td>{img.createdAt}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => onDownload(img)}>Download</button>
                    <button onClick={() => onRename(img.id)}>Rename</button>
                    <button onClick={() => onDelete(img.id)}>Delete</button>
                  </td>
                </tr>
              ))}

              {images.length === 0 && (
                <tr>
                  <td colSpan="6">No images yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
