import axios from "axios";

// export const fetchPnodes = async () => {
//   const res = await axios.get("http://localhost:5000/api/pnodes");
//   return res.data.data; // IMPORTANT
// };

export const fetchPnodes = async () => {
  const res = await fetch("/api/pnodes");
  const json = await res.json();
  return json.data; // <-- make sure you return `data` not the whole object
};
