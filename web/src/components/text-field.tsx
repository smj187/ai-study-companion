interface Props {
    id: string
    title: string
    name: string
    placeholder?: string
    value: string | number
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  }
  
  export const TextField: React.FC<Props> = ({
    id,
    title,
    name,
    value,
    placeholder,
    onChange
  }) => {
    return (
      <div className="max-w-full sm:max-w-md relative">
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-inter font-medium text-zinc-300 "
        >
          {title}
        </label>
        <input
          type="text"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="block w-full p-4 font-inter text-zinc-100 border outline-none border-zinc-800 rounded-lg bg-zinc-700 sm:text-md focus:ring-rose-600 focus:border-rose-600 "
        />
      </div>
    )
  }