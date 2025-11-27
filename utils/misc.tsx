const formatTime = (dt: any) => {
  if (!dt) return "-";
  try {
    const d = new Date(dt);
    if (isNaN(d.getTime())) return "-";
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "Pm" : "Am";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
  } catch {
    return "-";
  }
};

const formatDate = (dt: any) => {
  if (!dt) return "-";
  try {
    const d = new Date(dt);
    if (isNaN(d.getTime())) return "-";
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "-";
  }
};

export { formatDate, formatTime };
