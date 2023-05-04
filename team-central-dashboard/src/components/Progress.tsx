import { mergeStyles } from "@fluentui/react";

// This component renders a progress bar with a given background color and completion percentage
const ProgressBar = (props: any) => {
  const { bgcolor, completed } = props;

  // Styles for the container div of the progress bar
  const containerStyles = mergeStyles({
    height: "12px",
    width: "100%",
    backgroundColor: "#e0e0de",
    borderRadius: "3px",
  });

  // Styles for the filler div of the progress bar
  const fillerStyles = mergeStyles({
    height: "100%",
    width: `${completed}%`,
    backgroundColor: bgcolor,
    borderRadius: "inherit",
  });

  // Render the progress bar with the container and filler divs
  return (
    <div className={containerStyles}>
      <div className={fillerStyles}></div>
    </div>
  );
};

export default ProgressBar;
