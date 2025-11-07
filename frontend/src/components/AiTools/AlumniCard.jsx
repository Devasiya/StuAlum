export default function AlumniCard({ data }) {
  return (
    <div className="bg-white shadow p-4 rounded-xl border hover:shadow-lg transition">
      <h3 className="text-lg font-semibold">{data.name}</h3>
      <p className="text-gray-600">Company: {data.company}</p>
      <p className="text-gray-600">Experience: {data.experience} years</p>
      <p className="text-sm text-blue-600 italic mt-2">“{data.reason}”</p>
    </div>
  );
}