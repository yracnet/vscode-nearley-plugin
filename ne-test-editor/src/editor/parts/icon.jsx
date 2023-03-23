export const Icon = (props) => {
  const { name, color } = props;
  return (
    <i
      className={`icon-${name} text-${color}`}
      style={{ pointerEvents: "none" }}
    />
  );
};

export const ButtonIcon = (props) => {
  const { icon, ...other } = props;
  return (
    <Button {...other}>
      <Icon name={icon} />
    </Button>
  );
};
