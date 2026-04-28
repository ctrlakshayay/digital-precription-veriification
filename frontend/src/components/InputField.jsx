const InputField = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-sm text-slate-700">{label}</label>
    <input
      className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
      {...props}
    />
  </div>
);

export default InputField;
