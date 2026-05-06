import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authorizedFetch } from "../../../api";
import { toast } from "sonner";
import Header from "./Header";
import "./History.css";

/* =========================================================
   CONFIG
========================================================= */

// const MODE = "JSON_SERVER";

const JSON_API = "http://localhost:3001/history";

const MODE = "REAL_BACKEND";
const REAL_API = {
  getHistory: "history/",
  getDetail: (id) => `plan/${id}/`,
  editHistory: (id) =>  `plan/${id}/edit/`,
  deleteHistory: (id) => `travel-output/${id}/`,
};

/* =========================================================
   CHECK EDIT VALIDATION
========================================================= */

const canEditPlan = (plan) => {
  if (MODE === "JSON_SERVER"){
    const today = new Date().toISOString().split("T")[0];
    const endDay = plan?.input_data?.return_date;

    if (!endDay) return true;
    return today <= endDay;
  } else {
    const today = new Date().toISOString().split("T")[0];
    const endDay = plan?.end_day; // 🔥 đổi ở đây

    if (!endDay) return true;
    return today <= endDay;
  }
};

/* =========================================================
   API
========================================================= */

const api = {
  /* =========================
     GET HISTORY
  ========================= */
  getHistory: async () => {
    try {
      if (MODE === "JSON_SERVER") {
        const res = await fetch(JSON_API);
        if (!res.ok) return [];

        const data = await res.json();
        return data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      } else {
        const res = await authorizedFetch(REAL_API.getHistory, {
          method: "GET",
        });

        if (res.ok) {
          const data = await res.json();

          console.log("Dữ liệu lịch sử nè: ", data);
          return Array.isArray(data) ? data : data.data || [];

        }
      }
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  /* =========================
     DELETE HISTORY
  ========================= */
  deleteHistory: async (id) => {
    try {
      if (!id) return false;

      if (MODE === "JSON_SERVER") {
        const res = await fetch(`${JSON_API}/${id}`, {
          method: "DELETE",
        });
        return res.ok;
      } else {
        const res = await authorizedFetch(REAL_API.deleteHistory(id), {
          method: "DELETE",
        });
        return res.ok;
      } 
    } catch (err) {
      console.error(err);
      return false;
    }
  },
};

/* =========================================================
   COMPONENT
========================================================= */

function HistoryComponent() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* =========================
     LOAD HISTORY
  ========================= */
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getHistory();
      setHistoryData(data);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     OPEN PLAN (GIỮ NGUYÊN LOGIC CŨ)
  ========================= */
  const openPlan = async (id, mode = "view") => {
    try {
      if (MODE === "JSON_SERVER") {
        const plan = JSON.parse(localStorage.getItem(`plan_${id}`));

        if (!plan) {
          toast.error("Không tìm thấy dữ liệu kế hoạch");
          return;
        }

        // lock check
        if (mode === "change" && plan.is_locked) {
          toast.error("Kế hoạch đã được chốt, chỉ có thể xem");
          mode = "view";
        }

        navigate("/my-trip/output", {
          state: {
            data: plan,
            mode, // 🔥 QUAN TRỌNG
          },
        });
      } else {
        const url =
          mode === "change"
            ? `plan/${id}/edit/`
            : `plan/${id}/`;

        const res = await authorizedFetch(url, {
          method: "GET",
        });

        if (!res.ok) {
          toast.error("Không load được kế hoạch");
          return;
        }

        const data = await res.json();
        console.log("Dữ liệu view output nè: ", data);
        navigate("/my-trip/output", {
          state: {
            data,
            mode,
          },
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi mở kế hoạch");
    }
  };

  /* =========================
     DELETE
  ========================= */
  const handleDelete = async (id) => {
    const success = await api.deleteHistory(id);

    if (!success) {
      toast.error("Xóa thất bại");
      return;
    }

    // update UI
    const updated = historyData.filter((item) => item.id !== id);
    setHistoryData(updated);

    // xoá local detail
    localStorage.removeItem(`plan_${id}`);

    toast.success("Đã xóa kế hoạch");
  };

  /* =========================
     UI
  ========================= */
  return (
    <>
      <Header />

      <div className="history-header">
        <h2>History</h2>
        <p>Your saved travel plans</p>
      </div>

      <div className="history-list">
        {loading && <p>Loading...</p>}

        {!loading && historyData.length === 0 && (
          <p>Chưa có lịch sử nào</p>
        )}

        {Array.isArray(historyData) && historyData.map((item) => (
          <div key={item.id} className="history-card">

            {/* INFO */}
            <div onClick={() => openPlan(item.id, "view")}>
              <h3>
                {item.location ? item.location : <span className="unknown">Unknown</span>}
                {item.is_locked && "🔒"}
              </h3>

              <p className="end-date">
                📅 Ngày kết thúc:{" "}
                {item.end_day
                  ? new Date(item.end_day).toLocaleDateString()
                  : "No date"}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="actions">

              {/* VIEW */}
              <button onClick={() => openPlan(item.id, "view")}>
                View
              </button>

              {/* EDIT */}
              {!item.is_locked && (
                <button
                  disabled={!canEditPlan(item)}
                  onClick={() => {
                    if (!canEditPlan(item)) {
                      toast.error("Đã quá hạn chỉnh sửa");
                      return;
                    }
                    openPlan(item.id, "change");
                  }}
                >
                  Continue Editing
                </button>
              )}

              {/* DELETE */}
              <button onClick={() => handleDelete(item.id)}>
                Delete
              </button>

            </div>

          </div>
        ))}
      </div>
    </>
  );
}

export default HistoryComponent;