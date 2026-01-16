import Select from 'react-select';

const SelectMultiple = ({ validation, options, name ,selectOptions, placeholder}: any) => {
    return (
        <div>
            <Select
                noOptionsMessage={() => "No se encontraron roles"}
                isMulti
                name={name}
                options={options}
                onChange={(value) => selectOptions(value)}
                onBlur={() => validation.setFieldTouched(name, true)}
                value={validation?.values[name]}
                placeholder={placeholder || "Seleccione los roles"}
            />
            {validation.touched[name] && validation.errors[name] && (
                <p className="text-red-500 text-xs">{validation.errors[name]}</p>
            )}
        </div>




    )
}

export default SelectMultiple