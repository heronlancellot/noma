interface FormErrorProps {
  msg?: string;
}

export function FormError({ msg }: FormErrorProps) {
  if (!msg) return null;
  return <p className="text-xs text-error font-semibold px-1 mt-0.5">{msg}</p>;
}
