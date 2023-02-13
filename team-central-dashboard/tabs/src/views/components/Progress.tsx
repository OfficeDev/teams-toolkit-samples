const ProgressBar = (props: any) => {
  const { bgcolor, completed } = props;

  const containerStyles = {
    height: "12px",
    width: "100%",
    backgroundColor: "#e0e0de",
    borderRadius: "3px",
  };

  const fillerStyles = {
    height: "100%",
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: "inherit",
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
      </div>
    </div>
  );
};

export default ProgressBar;
