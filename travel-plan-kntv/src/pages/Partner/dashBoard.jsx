import { usePartner } from '../../assets/Layouts/PartnerLayout.jsx';
import { MapPin, Clock, Percent, Star } from "lucide-react";
import './dashBoard.css'

const DashBoard = () => {
  const { location, discounts } = usePartner();

  if (!location) {
    return <div style={{ padding: 20 }}>No data available</div>;
  }

  const activeDiscounts = (discounts || []).filter(d => {
    if (!d.startDate || !d.endDate) return false;

    const now = new Date();
    const start = new Date(d.startDate);
    const end = new Date(d.endDate);
    end.setHours(23, 59, 59);

    return now >= start && now <= end;
  }).length;

  return (
    <div className="dashboard">
      <h2>Overview</h2>

      <div className="card">
        <h3>{location?.name || "No name"}</h3>
        <p><MapPin size={16} /> {location?.address || "No address"}</p>
      </div>

      <div className="stats">
        <div className="stat">
          <Clock />
          <div>
            <h4>Hours</h4>
            <p>View schedule</p>
          </div>
        </div>

        <div className="stat">
          <Percent />
          <div>
            <h4>{activeDiscounts}</h4>
            <p>Active Discounts</p>
          </div>
        </div>

        <div className="stat">
          <Star />
          <div>
            <h4>{location?.rating || 4.5}</h4>
            <p>Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
// const DashBoard = () => {
//   const { user } = usePartner();

//   const location = user; // 🔥 FIX
//   const discounts = user?.discounts || [];

//   if (!location) {
//     return <div style={{ padding: 20 }}>No data available</div>;
//   }

//   const activeDiscounts = discounts.filter(d => {
//     if (!d.startDate || !d.endDate) return false;

//     const now = new Date();
//     const start = new Date(d.startDate);
//     const end = new Date(d.endDate);
//     end.setHours(23, 59, 59);

//     return now >= start && now <= end;
//   }).length;

//   return (
//     <div className="dashboard">
//       <h2>Overview</h2>

//       <div className="card">
//         <h3>{location?.name || "No name"}</h3>
//         <p>{location?.address || "No address"}</p>
//       </div>

//       <div className="stats">
//         <div className="stat">
//           <Clock />
//           <div>
//             <h4>Hours</h4>
//             <p>View schedule</p>
//           </div>
//         </div>

//         <div className="stat">
//           <Percent />
//           <div>
//             <h4>{activeDiscounts}</h4>
//             <p>Active Discounts</p>
//           </div>
//         </div>

//         <div className="stat">
//           <Star />
//           <div>
//             <h4>{location?.rating || 4.5}</h4>
//             <p>Rating</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default DashBoard;