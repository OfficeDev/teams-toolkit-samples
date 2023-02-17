import { mergeStyles } from "@fluentui/react";

const ProgressBar = (props: any) => {
  const { bgcolor, completed } = props;

  const containerStyles = mergeStyles({
    height: "12px",
    width: "100%",
    backgroundColor: "#e0e0de",
    borderRadius: "3px",
  });

  const fillerStyles = mergeStyles({
    height: "100%",
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: "inherit",
  });

  return (
    <div className={containerStyles}>
      <div className={fillerStyles}></div>
    </div>
  );
};

export default ProgressBar;
