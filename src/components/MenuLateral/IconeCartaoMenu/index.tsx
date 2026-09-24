type IconeCartaoMenuProps = {
  icone: string
}

export function IconeCartaoMenu({ icone }: Readonly<IconeCartaoMenuProps>) {
  return (
    <span
      className="flex size-6 shrink-0 items-center justify-center bg-brand-dark"
      style={{
        mask: `url(${icone}) center / contain no-repeat`,
        WebkitMask: `url(${icone}) center / contain no-repeat`,
      }}
      aria-hidden="true"
    />
  )
}
