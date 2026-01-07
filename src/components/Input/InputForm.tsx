import { Input } from "@/components/ui/input";

const InputForm = ({ validation, placeholder, name, type = "text" }: any) => {
  return (
    <div className="w-full">
      <Input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        onChange={validation.handleChange}
        value={validation?.values[name]}
        onBlur={validation.onBlur}
      />
      {validation.touched[name] && validation.errors[name] && (
        <p className="text-red-500 text-sm">{validation.errors[name]}</p>
      )}
    </div>
  );
};

export default InputForm;
