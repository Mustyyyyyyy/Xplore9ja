const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function uploadImage(file: File) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_URL}/uploads/image`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Image upload failed");
  }

  return data as {
    success: boolean;
    message: string;
    file: {
      url: string;
      publicId: string;
    };
  };
}