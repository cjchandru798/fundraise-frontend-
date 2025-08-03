import { useEffect, useState } from "react";
import axios from "axios";
import { Megaphone } from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  message: string;
  createdAt: string;
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8080/api/announcements", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnnouncements(res.data);
      } catch (err) {
        setError("Unable to fetch announcements.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-3xl space-y-6">
        <h2 className="text-3xl font-bold text-blue-700 mb-4 flex items-center gap-2">
          <Megaphone className="w-6 h-6" />
          Announcements
        </h2>

        {loading && <p className="text-gray-500 text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {announcements.length === 0 && !loading && (
          <p className="text-center text-gray-600">No announcements yet.</p>
        )}

        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="bg-white shadow border border-gray-200 p-4 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-blue-600">{ann.title}</h3>
              <p className="text-sm text-gray-700 mt-1">{ann.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                Posted on {new Date(ann.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
